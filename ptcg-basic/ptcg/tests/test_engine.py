import pytest

from ptcg.engine import GameError, apply_action, new_battle, run_computers


def mk(cid, name, types, hp, attacks, weakness=None, retreat=1, supertype="Pokémon", subtypes=("Basic",)):
    return {"id": cid, "name": name, "supertype": supertype, "subtypes": list(subtypes),
            "hp": hp, "types": types, "evolvesFrom": None, "attacks": attacks,
            "weakness": weakness, "resistance": None, "retreatCost": retreat}


def make_cards():
    return {
        "ch": mk("ch", "Charmander", ["Fire"], 70, [{"name": "Ember", "cost": ["Fire"], "damage": "30"}],
                 weakness="Water"),
        "wp": mk("wp", "Squirtle", ["Water"], 70, [{"name": "Bubble", "cost": ["Water"], "damage": "10"}],
                 weakness="Fire"),
        "fire": mk("fire", "Fire Energy", [], 0, [], retreat=0, supertype="Energy"),
    }


def test_first_turn_cannot_attack():
    cards = make_cards()
    st = new_battle(["ch"] * 30 + ["fire"] * 30, ["wp"] * 60, cards, {"A": 1, "B": "computer"}, seed=1)
    with pytest.raises(GameError):
        apply_action(st, cards, st["first"], {"type": "attack", "index": 0})


def test_weakness_doubles_damage_and_ends_turn():
    cards = make_cards()
    st = new_battle(["ch"] * 60, ["wp"] * 60, cards, {"A": 1, "B": "computer"}, seed=3)
    st["current"] = "A"
    st["turn"] = 2
    st["players"]["A"]["active"]["energy"] = [{"uid": 900, "card": "fire", "type": "Fire"}]
    apply_action(st, cards, "A", {"type": "attack", "index": 0})
    assert st["players"]["B"]["active"]["damage"] == 60  # 30 × 弱點 2
    assert st["current"] == "B"


def test_energy_requirement_enforced():
    cards = make_cards()
    st = new_battle(["ch"] * 60, ["wp"] * 60, cards, {"A": 1, "B": "computer"}, seed=3)
    st["current"] = "A"
    st["turn"] = 2
    with pytest.raises(GameError):
        apply_action(st, cards, "A", {"type": "attack", "index": 0})


def test_computer_game_terminates():
    cards = make_cards()
    st = new_battle(["ch"] * 30 + ["fire"] * 30, ["wp"] * 30 + ["fire"] * 30,
                    cards, {"A": "computer", "B": "computer"}, seed=7)
    run_computers(st, cards)
    assert st["winner"] in ("A", "B")
