"""FastAPI 入口：會員登入、管理員審核、牌庫上傳、對戰。啟動後開啟 /docs 測試。"""
import json
import secrets
import sqlite3
from typing import Optional, Union

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

from .auth import PHONE_RE, check_password_policy, hash_password, verify_password
from .cards import CardError, build_entries, expand_entries, validate_deck
from .db import connect, init_db
from .engine import GameError, apply_action, new_battle, run_computers, view_for

MAX_DECKS = 5  # 共同牌庫上限

app = FastAPI(title="寶可夢紙牌對戰（基本流程版）")
conn = connect()
init_db(conn)


# ---------- 請求格式 ----------
class RegisterIn(BaseModel):
    phone: str
    password: str


class LoginIn(BaseModel):
    phone: str
    password: str


class DeckIn(BaseModel):
    name: str = Field(min_length=1, max_length=40)
    lines: list[str] = Field(min_length=1, max_length=100)


class BattleIn(BaseModel):
    my_deck_id: int
    opponent: Union[str, int]  # "computer" 或對手的會員 id
    opponent_deck_id: int


class ActionIn(BaseModel):
    type: str
    uid: Optional[int] = None
    target_uid: Optional[int] = None
    index: Optional[int] = None
    bench_uid: Optional[int] = None


# ---------- 身分驗證 ----------
def get_user(authorization: Optional[str]) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "請先登入")
    row = conn.execute(
        "SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token=?",
        (authorization[7:],),
    ).fetchone()
    if not row:
        raise HTTPException(401, "登入已失效，請重新登入")
    return dict(row)


def require_member(user: dict):
    if user["status"] != "approved":
        raise HTTPException(403, "帳號尚未通過審核")


def require_admin(user: dict):
    if user["role"] != "admin":
        raise HTTPException(403, "僅系統管理員可執行此操作")


def load_all_cards() -> dict:
    return {r["id"]: json.loads(r["data"]) for r in conn.execute("SELECT id, data FROM cards")}


def _viewer_key(state, user_id):
    for key, owner in state["owners"].items():
        if owner == user_id:
            return key
    raise HTTPException(403, "你不是這場對戰的玩家")


def _load_battle(battle_id):
    row = conn.execute("SELECT state FROM battles WHERE id=?", (battle_id,)).fetchone()
    if not row:
        raise HTTPException(404, "找不到這場對戰")
    return json.loads(row["state"])


# ---------- 會員 ----------
@app.post("/api/register", status_code=201)
def register(body: RegisterIn):
    if not PHONE_RE.match(body.phone):
        raise HTTPException(400, "請輸入正確的手機號碼（09 開頭共 10 碼）")
    err = check_password_policy(body.password)
    if err:
        raise HTTPException(400, err)
    try:
        conn.execute(
            "INSERT INTO users(phone, pw_hash) VALUES(?,?)",
            (body.phone, hash_password(body.password)),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(409, "此手機號碼已申請過")
    return {"message": "申請已送出，待管理員審核後即可登入"}


@app.post("/api/login")
def login(body: LoginIn):
    row = conn.execute("SELECT * FROM users WHERE phone=?", (body.phone,)).fetchone()
    if not row or not verify_password(body.password, row["pw_hash"]):
        raise HTTPException(401, "手機號碼或密碼錯誤")
    if row["status"] != "approved":
        raise HTTPException(403, "帳號尚未通過審核")
    token = secrets.token_urlsafe(32)
    conn.execute("INSERT INTO sessions(token, user_id) VALUES(?,?)", (token, row["id"]))
    conn.commit()
    return {"token": token, "role": row["role"]}


# ---------- 管理員 ----------
@app.get("/api/admin/pending")
def list_pending(authorization: Optional[str] = Header(default=None)):
    require_admin(get_user(authorization))
    rows = conn.execute("SELECT id, phone FROM users WHERE status='pending'").fetchall()
    return [dict(r) for r in rows]


@app.post("/api/admin/users/{user_id}/approve")
def approve(user_id: int, authorization: Optional[str] = Header(default=None)):
    require_admin(get_user(authorization))
    conn.execute("UPDATE users SET status='approved' WHERE id=?", (user_id,))
    conn.commit()
    return {"message": "已核准"}


@app.post("/api/admin/users/{user_id}/reject")
def reject(user_id: int, authorization: Optional[str] = Header(default=None)):
    require_admin(get_user(authorization))
    conn.execute("UPDATE users SET status='rejected' WHERE id=?", (user_id,))
    conn.commit()
    return {"message": "已拒絕"}


# ---------- 牌庫 ----------
@app.post("/api/decks", status_code=201)
def upload_deck(body: DeckIn, authorization: Optional[str] = Header(default=None)):
    user = get_user(authorization)
    require_member(user)
    count = conn.execute("SELECT COUNT(*) FROM decks").fetchone()[0]
    if count >= MAX_DECKS:
        raise HTTPException(409, f"共同牌庫已達 {MAX_DECKS} 組上限")
    try:
        entries = build_entries(body.lines, conn)
    except CardError as e:
        raise HTTPException(400, str(e))
    errors = validate_deck(entries)
    if errors:
        raise HTTPException(400, "；".join(errors))
    card_ids = expand_entries(entries)
    cur = conn.execute(
        "INSERT INTO decks(owner_id, name, cards) VALUES(?,?,?)",
        (user["id"], body.name, json.dumps(card_ids)),
    )
    conn.commit()
    return {"id": cur.lastrowid, "name": body.name, "card_count": len(card_ids)}


@app.get("/api/decks")
def list_decks(authorization: Optional[str] = Header(default=None)):
    user = get_user(authorization)
    require_member(user)
    rows = conn.execute("SELECT id, owner_id, name, cards FROM decks").fetchall()
    return [
        {"id": r["id"], "name": r["name"], "mine": r["owner_id"] == user["id"],
         "card_count": len(json.loads(r["cards"]))}
        for r in rows
    ]


# ---------- 對戰 ----------
@app.post("/api/battles", status_code=201)
def create_battle(body: BattleIn, authorization: Optional[str] = Header(default=None)):
    user = get_user(authorization)
    require_member(user)
    mine = conn.execute("SELECT cards FROM decks WHERE id=?", (body.my_deck_id,)).fetchone()
    theirs = conn.execute("SELECT cards FROM decks WHERE id=?", (body.opponent_deck_id,)).fetchone()
    if not mine or not theirs:
        raise HTTPException(404, "找不到指定的牌組")

    if body.opponent == "computer":
        owners = {"A": user["id"], "B": "computer"}
    elif isinstance(body.opponent, int):
        opp = conn.execute("SELECT id, status FROM users WHERE id=?", (body.opponent,)).fetchone()
        if not opp or opp["status"] != "approved":
            raise HTTPException(400, "對手不存在或尚未通過審核")
        owners = {"A": user["id"], "B": opp["id"]}
    else:
        raise HTTPException(400, "對手請填 computer 或會員 id")

    state = new_battle(json.loads(mine["cards"]), json.loads(theirs["cards"]),
                       load_all_cards(), owners)
    run_computers(state, load_all_cards())
    cur = conn.execute("INSERT INTO battles(state) VALUES(?)", (json.dumps(state),))
    conn.commit()
    return {"battle_id": cur.lastrowid}


@app.get("/api/battles/{battle_id}")
def get_battle(battle_id: int, authorization: Optional[str] = Header(default=None)):
    user = get_user(authorization)
    state = _load_battle(battle_id)
    key = _viewer_key(state, user["id"])
    return view_for(state, load_all_cards(), key)


@app.post("/api/battles/{battle_id}/actions")
def do_action(battle_id: int, body: ActionIn, authorization: Optional[str] = Header(default=None)):
    user = get_user(authorization)
    state = _load_battle(battle_id)
    key = _viewer_key(state, user["id"])
    cards = load_all_cards()
    action = {k: v for k, v in body.model_dump().items() if v is not None}
    try:
        apply_action(state, cards, key, action)
        run_computers(state, cards)
    except GameError as e:
        raise HTTPException(400, str(e))
    conn.execute("UPDATE battles SET state=? WHERE id=?", (json.dumps(state), battle_id))
    conn.commit()
    return view_for(state, cards, key)
