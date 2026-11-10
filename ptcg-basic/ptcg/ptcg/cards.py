"""從公開資料庫（pokemontcg.io）查詢卡片，並做牌庫解析與規則驗證。"""
import json
import os
import re

import requests

from .engine import is_basic_energy, is_basic_pokemon

API_URL = "https://api.pokemontcg.io/v2/cards"
ID_RE = re.compile(r"^[a-z0-9]+-[A-Za-z0-9]+$")  # 卡號，例如 sv1-1
LINE_RE = re.compile(r"^(.+?)\s+[xX×]?\s*(\d+)$")  # 例如 "sv1-1 x4"


class CardError(Exception):
    pass


def parse_line(line: str):
    s = line.strip()
    if not s:
        return None
    m = LINE_RE.match(s)
    if m:
        return m.group(1).strip(), int(m.group(2))
    return s, 1


def normalize(raw: dict) -> dict:
    weak = (raw.get("weaknesses") or [{}])[0].get("type")
    resist = (raw.get("resistances") or [{}])[0].get("type")
    return {
        "id": raw["id"],
        "name": raw["name"],
        "supertype": raw.get("supertype", ""),
        "subtypes": raw.get("subtypes") or [],
        "hp": int(raw.get("hp") or 0),
        "types": raw.get("types") or [],
        "evolvesFrom": raw.get("evolvesFrom"),
        "attacks": [
            {"name": a["name"], "cost": a.get("cost") or [], "damage": a.get("damage") or ""}
            for a in raw.get("attacks") or []
        ],
        "weakness": weak,
        "resistance": resist,
        "retreatCost": len(raw.get("retreatCost") or []),
        "image": (raw.get("images") or {}).get("small"),
    }


def _fetch_raw(key: str) -> dict:
    headers = {}
    api_key = os.environ.get("POKEMONTCG_API_KEY")
    if api_key:
        headers["X-Api-Key"] = api_key
    try:
        if ID_RE.match(key):
            r = requests.get(f"{API_URL}/{key}", headers=headers, timeout=15)
            if r.status_code == 404:
                raise CardError(f"公開資料庫找不到卡號 {key}")
            r.raise_for_status()
            return r.json()["data"]
        r = requests.get(
            API_URL, params={"q": f'name:"{key}"', "pageSize": 1},
            headers=headers, timeout=15,
        )
        r.raise_for_status()
        data = r.json()["data"]
        if not data:
            raise CardError(f"公開資料庫找不到卡片名稱「{key}」（目前僅支援英文名稱，建議改用卡號）")
        return data[0]
    except requests.RequestException as e:
        raise CardError(f"無法連線公開資料庫：{e}") from e


def load_card(key: str, conn) -> dict:
    """先查本機快取，沒有才去公開資料庫抓，並存入快取。"""
    if ID_RE.match(key):
        row = conn.execute("SELECT data FROM cards WHERE id=?", (key,)).fetchone()
        if row:
            return json.loads(row["data"])
    card = normalize(_fetch_raw(key))
    conn.execute(
        "INSERT OR REPLACE INTO cards(id, data) VALUES(?,?)",
        (card["id"], json.dumps(card, ensure_ascii=False)),
    )
    conn.commit()
    return card


def build_entries(lines, conn):
    entries = []
    for line in lines:
        parsed = parse_line(line)
        if not parsed:
            continue
        key, n = parsed
        if not 1 <= n <= 60:
            raise CardError(f"數量不合法：{line}")
        entries.append((load_card(key, conn), n))
    return entries


def expand_entries(entries):
    ids = []
    for card, n in entries:
        ids.extend([card["id"]] * n)
    return ids


def validate_deck(entries):
    """回傳錯誤訊息列表；空列表代表合格。"""
    errors = []
    total = sum(n for _, n in entries)
    if total != 60:
        errors.append(f"牌數必須剛好 60 張，目前 {total} 張")

    by_name = {}
    for card, n in entries:
        if is_basic_energy(card):
            continue  # 基本能量不受同名限制
        by_name[card["name"]] = by_name.get(card["name"], 0) + n
    for name, n in by_name.items():
        if n > 4:
            errors.append(f"同名卡「{name}」超過 4 張（目前 {n} 張）")

    ace = sum(n for c, n in entries if "ACE SPEC" in c["subtypes"])
    if ace > 1:
        errors.append(f"ACE SPEC（王牌）最多 1 張，目前 {ace} 張")

    if not any(is_basic_pokemon(c) and n > 0 for c, n in entries):
        errors.append("牌庫至少需要 1 隻基礎寶可夢")
    return errors
