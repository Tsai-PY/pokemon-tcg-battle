"""簡化版寶可夢集換式卡牌對戰引擎（基本流程版）。

設計：純函式，輸入狀態與卡片資料、輸出新狀態，方便測試。
玩家代號：A、B。owners 記錄每一方是使用者 id 或 "computer"。

尚未實作：訓練家卡的效果（目前只會棄置）、特性、特殊能量與道具效果、
開局自選戰鬥寶可夢。
"""
import random
import re

BENCH_MAX = 5
PRIZE_COUNT = 6
OPENING_HAND = 7
OTHER = {"A": "B", "B": "A"}


class GameError(Exception):
    """玩家的動作不合法。"""


# ---------- 卡片判斷 ----------
def is_pokemon(c):
    return c["supertype"] == "Pokémon"


def is_basic_pokemon(c):
    return is_pokemon(c) and "Basic" in c["subtypes"]


def is_energy(c):
    return c["supertype"] == "Energy"


def is_basic_energy(c):
    return is_energy(c) and "Basic" in c["subtypes"]


def is_trainer(c):
    return c["supertype"] == "Trainer"


def is_supporter(c):
    return is_trainer(c) and "Supporter" in c["subtypes"]


def is_ex(c):
    return any(s.lower() == "ex" for s in c["subtypes"]) or c["name"].endswith(" ex")


def energy_type(c):
    if is_basic_energy(c):
        return c["name"].replace(" Energy", "").strip()
    return "Colorless"


def _damage_value(text):
    m = re.match(r"\d+", text or "")
    return int(m.group()) if m else 0


def _can_pay(cost, attached):
    """檢查已附加的能量是否足以支付招式費用（Colorless 可用任何能量）。"""
    colorless = 0
    need = {}
    for t in cost:
        if t == "Colorless":
            colorless += 1
        else:
            need[t] = need.get(t, 0) + 1
    pool = [e["type"] for e in attached]
    for t, n in need.items():
        for _ in range(n):
            if t in pool:
                pool.remove(t)
            else:
                return False
    return len(pool) >= colorless


# ---------- 狀態輔助 ----------
def _card(cards, inst):
    return cards[inst["card"]]


def _new_inst(state, card_id):
    state["uid_seq"] += 1
    return {"uid": state["uid_seq"], "card": card_id, "energy": [], "damage": 0, "played": 0}


def _log(state, msg):
    state["log"].append(msg)
    state["log"] = state["log"][-50:]


def _field(p):
    return ([p["active"]] if p["active"] else []) + p["bench"]


def _find_hand(p, uid):
    for i, c in enumerate(p["hand"]):
        if c["uid"] == uid:
            return i
    raise GameError("手牌中沒有這張卡")


def _find_field(p, uid):
    for c in _field(p):
        if c["uid"] == uid:
            return c
    raise GameError("場上沒有這隻寶可夢")


def _remove_bench(p, uid):
    for i, c in enumerate(p["bench"]):
        if c["uid"] == uid:
            return p["bench"].pop(i)
    raise GameError("備戰區沒有這隻寶可夢")


# ---------- 對戰建立與回合 ----------
def new_battle(deck_a, deck_b, cards, owners, seed=None):
    """deck_a / deck_b 為 60 個卡號的列表。"""
    rng = random.Random(seed)
    state = {
        "owners": owners, "turn": 1, "uid_seq": 0, "log": [], "winner": None,
        "pending_promote": None, "players": {}, "first": None, "current": None,
        "flags": {},
    }
    for key, ids in (("A", deck_a), ("B", deck_b)):
        deck = [_new_inst(state, cid) for cid in ids]
        rng.shuffle(deck)
        p = {"deck": deck, "hand": [], "active": None, "bench": [], "prizes": [], "discard": []}
        # 手牌必須至少有 1 隻基礎寶可夢，否則重洗（mulligan）
        while True:
            p["hand"], p["deck"] = p["deck"][:OPENING_HAND], p["deck"][OPENING_HAND:]
            if any(is_basic_pokemon(_card(cards, c)) for c in p["hand"]):
                break
            p["deck"] += p["hand"]
            p["hand"] = []
            rng.shuffle(p["deck"])
        idx = next(i for i, c in enumerate(p["hand"]) if is_basic_pokemon(_card(cards, c)))
        p["active"] = p["hand"].pop(idx)
        p["prizes"], p["deck"] = p["deck"][:PRIZE_COUNT], p["deck"][PRIZE_COUNT:]
        state["players"][key] = p

    state["first"] = rng.choice(["A", "B"])
    state["current"] = state["first"]
    _log(state, f"先攻為 {state['first']}")
    _start_turn(state)
    return state


def _start_turn(state):
    key = state["current"]
    p = state["players"][key]
    state["flags"] = {"energy": False, "retreat": False, "supporter": False}
    if state["turn"] > 1:  # 先攻玩家的第一回合不抽牌
        if not p["deck"]:
            state["winner"] = OTHER[key]
            _log(state, f"{key} 牌庫已空無法抽牌，{OTHER[key]} 獲勝")
            return
        p["hand"].append(p["deck"].pop(0))
    _log(state, f"第 {state['turn']} 回合：玩家 {key}")


def _end_turn(state):
    if state["winner"]:
        return
    state["current"] = OTHER[state["current"]]
    state["turn"] += 1
    _start_turn(state)


def _knock_out(state, cards, taker_key, owner_key, poke):
    owner = state["players"][owner_key]
    taker = state["players"][taker_key]
    if owner["active"] is poke:
        owner["active"] = None
    else:
        _remove_bench(owner, poke["uid"])
    owner["discard"].append(poke)
    owner["discard"].extend(poke["energy"])
    poke["energy"] = []
    _log(state, f"{owner_key} 的 {_card(cards, poke)['name']} 昏厥")

    for _ in range(2 if is_ex(_card(cards, poke)) else 1):
        if taker["prizes"]:
            taker["hand"].append(taker["prizes"].pop(0))
    if not taker["prizes"]:
        state["winner"] = taker_key
        _log(state, f"{taker_key} 拿完所有獎賞卡，獲勝")
        return
    if owner["active"] is None:
        if owner["bench"]:
            state["pending_promote"] = owner_key
        else:
            state["winner"] = taker_key
            _log(state, f"{owner_key} 場上已無寶可夢，{taker_key} 獲勝")


def _promote(state, p, uid):
    if p["active"] is not None:
        raise GameError("戰鬥區已有寶可夢")
    p["active"] = _remove_bench(p, uid)
    state["pending_promote"] = None
    _log(state, "已選擇替補寶可夢")


# ---------- 動作處理 ----------
def _play_basic(state, cards, key, p, a):
    i = _find_hand(p, a["uid"])
    c = p["hand"][i]
    if not is_basic_pokemon(_card(cards, c)):
        raise GameError("只能把基礎寶可夢放到備戰區")
    if len(p["bench"]) >= BENCH_MAX:
        raise GameError("備戰區已滿（最多 5 隻）")
    p["hand"].pop(i)
    c["played"] = state["turn"]
    p["bench"].append(c)


def _evolve(state, cards, key, p, a):
    if state["turn"] == 1:
        raise GameError("第一回合不能進化")
    i = _find_hand(p, a["uid"])
    c = p["hand"][i]
    cc = _card(cards, c)
    if not is_pokemon(cc) or not cc.get("evolvesFrom"):
        raise GameError("這張卡不是進化寶可夢")
    target = _find_field(p, a.get("target_uid"))
    if target["played"] >= state["turn"]:
        raise GameError("本回合剛下場或已進化的寶可夢不能進化")
    if _card(cards, target)["name"] != cc["evolvesFrom"]:
        raise GameError("進化關係不符")
    p["hand"].pop(i)
    c["energy"], c["damage"] = target["energy"], target["damage"]
    c["played"] = state["turn"]
    target["energy"] = []
    p["discard"].append(target)
    if p["active"] is target:
        p["active"] = c
    else:
        p["bench"][p["bench"].index(target)] = c


def _attach(state, cards, key, p, a):
    if state["flags"]["energy"]:
        raise GameError("每回合只能附加一張能量")
    i = _find_hand(p, a["uid"])
    c = p["hand"][i]
    cc = _card(cards, c)
    if not is_energy(cc):
        raise GameError("這不是能量卡")
    target = _find_field(p, a.get("target_uid"))
    p["hand"].pop(i)
    target["energy"].append({"uid": c["uid"], "card": c["card"], "type": energy_type(cc)})
    state["flags"]["energy"] = True


def _retreat(state, cards, key, p, a):
    if state["flags"]["retreat"]:
        raise GameError("每回合只能撤退一次")
    active = p["active"]
    if active is None:
        raise GameError("沒有戰鬥寶可夢")
    new = next((c for c in p["bench"] if c["uid"] == a.get("bench_uid")), None)
    if new is None:
        raise GameError("請選擇備戰區的寶可夢")
    cost = _card(cards, active)["retreatCost"]
    if len(active["energy"]) < cost:
        raise GameError(f"能量不足，撤退需要丟棄 {cost} 個能量")
    dropped = active["energy"][:cost]
    active["energy"] = active["energy"][cost:]
    p["discard"].extend(dropped)
    _remove_bench(p, new["uid"])
    p["bench"].append(active)
    p["active"] = new
    state["flags"]["retreat"] = True
    _log(state, f"{key} 撤退，換上 {_card(cards, new)['name']}")


def _trainer(state, cards, key, p, a):
    i = _find_hand(p, a["uid"])
    c = p["hand"][i]
    cc = _card(cards, c)
    if not is_trainer(cc):
        raise GameError("這不是訓練家卡")
    if is_supporter(cc):
        if state["turn"] == 1:
            raise GameError("第一回合不能使用支援者卡")
        if state["flags"]["supporter"]:
            raise GameError("每回合只能使用一張支援者卡")
        state["flags"]["supporter"] = True
    p["hand"].pop(i)
    p["discard"].append(c)
    _log(state, f"{key} 使用 {cc['name']}（效果尚未實作，僅棄置）")


def _attack(state, cards, key, p, a):
    if state["turn"] == 1:
        raise GameError("先攻第一回合不能攻擊")
    attacker = p["active"]
    if attacker is None:
        raise GameError("沒有戰鬥寶可夢")
    acard = _card(cards, attacker)
    idx = a.get("index", 0)
    if not 0 <= idx < len(acard["attacks"]):
        raise GameError("招式不存在")
    atk = acard["attacks"][idx]
    if not _can_pay(atk["cost"], attacker["energy"]):
        raise GameError("能量不足，無法使用此招式")

    opp_key = OTHER[key]
    defender = state["players"][opp_key]["active"]
    dcard = _card(cards, defender)
    dmg = _damage_value(atk["damage"])
    attacker_type = acard["types"][0] if acard["types"] else "Colorless"
    if dmg > 0:
        if dcard.get("weakness") == attacker_type:
            dmg *= 2
        if dcard.get("resistance") == attacker_type:
            dmg = max(0, dmg - 30)
        defender["damage"] += dmg
    _log(state, f"{key} 的 {acard['name']} 使用 {atk['name']}，造成 {dmg} 點傷害")

    if defender["damage"] >= dcard["hp"]:
        _knock_out(state, cards, key, opp_key, defender)
    _end_turn(state)  # 攻擊階段結束回合


def _end_turn_action(state, cards, key, p, a):
    _end_turn(state)


HANDLERS = {
    "play_basic": _play_basic,
    "evolve": _evolve,
    "attach_energy": _attach,
    "retreat": _retreat,
    "play_trainer": _trainer,
    "attack": _attack,
    "end_turn": _end_turn_action,
}


def apply_action(state, cards, actor, action):
    if state["winner"]:
        raise GameError("對戰已結束")
    p = state["players"][actor]
    t = action.get("type")
    if state["pending_promote"]:
        if actor != state["pending_promote"] or t != "promote":
            raise GameError("請先選擇替補寶可夢")
        _promote(state, p, action.get("uid"))
        return state
    if actor != state["current"]:
        raise GameError("現在不是你的回合")
    handler = HANDLERS.get(t)
    if handler is None:
        raise GameError(f"未知的動作：{t}")
    handler(state, cards, actor, p, action)
    return state


# ---------- 電腦對手 ----------
def _computer_choose(state, cards, key):
    p = state["players"][key]
    if state["pending_promote"]:
        best = max(p["bench"], key=lambda c: _card(cards, c)["hp"])
        return {"type": "promote", "uid": best["uid"]}

    hand = p["hand"]
    # 1. 進化
    if state["turn"] > 1:
        for h in hand:
            hc = _card(cards, h)
            if is_pokemon(hc) and hc.get("evolvesFrom"):
                for t in _field(p):
                    if t["played"] < state["turn"] and _card(cards, t)["name"] == hc["evolvesFrom"]:
                        return {"type": "evolve", "uid": h["uid"], "target_uid": t["uid"]}
    # 2. 放基礎寶可夢到備戰區
    if len(p["bench"]) < BENCH_MAX:
        for h in hand:
            if is_basic_pokemon(_card(cards, h)):
                return {"type": "play_basic", "uid": h["uid"]}
    # 3. 附加能量到戰鬥寶可夢
    if not state["flags"]["energy"] and p["active"] is not None:
        for h in hand:
            if is_energy(_card(cards, h)):
                return {"type": "attach_energy", "uid": h["uid"], "target_uid": p["active"]["uid"]}
    active = p["active"]
    if active is not None:
        acard = _card(cards, active)
        # 4. 攻擊（選傷害最高且能量足夠的招式）
        if state["turn"] > 1:
            ok = [(i, a) for i, a in enumerate(acard["attacks"]) if _can_pay(a["cost"], active["energy"])]
            if ok:
                i, _ = max(ok, key=lambda x: _damage_value(x[1]["damage"]))
                return {"type": "attack", "index": i}
        # 5. 戰鬥寶可夢無法攻擊時，撤退到能攻擊的備戰寶可夢
        if not state["flags"]["retreat"] and len(active["energy"]) >= acard["retreatCost"]:
            for b in p["bench"]:
                bc = _card(cards, b)
                if any(_can_pay(a["cost"], b["energy"]) for a in bc["attacks"]):
                    return {"type": "retreat", "bench_uid": b["uid"]}
    return {"type": "end_turn"}


def run_computers(state, cards):
    """若輪到電腦（或電腦需要替補），自動連續行動，直到輪到真人或對戰結束。"""
    for _ in range(500):
        if state["winner"]:
            break
        key = state["pending_promote"] or state["current"]
        if state["owners"][key] != "computer":
            break
        try:
            apply_action(state, cards, key, _computer_choose(state, cards, key))
        except GameError:
            if state["pending_promote"]:
                raise
            apply_action(state, cards, key, {"type": "end_turn"})
    return state


# ---------- 給前端的檢視（隱藏對手手牌與牌庫內容） ----------
def view_for(state, cards, viewer):
    players, used = {}, set()
    for key, p in state["players"].items():
        own = key == viewer
        for c in list(_field(p)) + list(p["discard"]):
            used.add(c["card"])
            for e in c.get("energy", []):
                used.add(e["card"])
        if own:
            used.update(c["card"] for c in p["hand"])
        players[key] = {
            "active": p["active"],
            "bench": p["bench"],
            "discard": p["discard"],
            "hand": p["hand"] if own else None,
            "hand_count": len(p["hand"]),
            "deck_count": len(p["deck"]),
            "prize_count": len(p["prizes"]),
        }
    return {
        "you": viewer,
        "turn": state["turn"],
        "current": state["current"],
        "your_turn": state["current"] == viewer,
        "winner": state["winner"],
        "pending_promote": state["pending_promote"],
        "flags": state["flags"],
        "players": players,
        "log": state["log"][-15:],
        "cards": {cid: cards[cid] for cid in used},
    }
