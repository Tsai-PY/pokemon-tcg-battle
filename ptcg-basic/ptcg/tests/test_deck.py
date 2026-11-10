from ptcg.cards import validate_deck


def card(name, supertype="Pokémon", subtypes=("Basic",)):
    return {"id": name.lower(), "name": name, "supertype": supertype, "subtypes": list(subtypes)}


ENERGY = card("Fire Energy", "Energy")


def test_valid_deck():
    entries = [(card("Pikachu"), 4), (ENERGY, 56)]
    assert validate_deck(entries) == []


def test_wrong_total():
    entries = [(card("Pikachu"), 4)]
    assert any("60" in e for e in validate_deck(entries))


def test_same_name_limit():
    entries = [(card("Pikachu"), 5), (ENERGY, 55)]
    assert any("超過 4 張" in e for e in validate_deck(entries))


def test_basic_energy_exempt_from_name_limit():
    entries = [(card("Pikachu"), 4), (ENERGY, 56)]
    assert not any("超過 4 張" in e for e in validate_deck(entries))


def test_ace_spec_limit():
    ace = card("Rare Candy X", "Trainer", ("Item", "ACE SPEC"))
    entries = [(ace, 2), (card("Pikachu"), 4), (ENERGY, 54)]
    assert any("ACE SPEC" in e for e in validate_deck(entries))


def test_needs_basic_pokemon():
    entries = [(card("Potion", "Trainer", ("Item",)), 4), (ENERGY, 56)]
    assert any("基礎寶可夢" in e for e in validate_deck(entries))
