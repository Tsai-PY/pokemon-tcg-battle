"""SQLite 資料庫連線與資料表建立。"""
import os
import sqlite3

from .auth import hash_password

DB_PATH = os.environ.get("PTCG_DB", "ptcg.db")

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY,
    phone    TEXT UNIQUE NOT NULL,
    pw_hash  TEXT NOT NULL,
    role     TEXT NOT NULL DEFAULT 'member',     -- member / admin
    status   TEXT NOT NULL DEFAULT 'pending'     -- pending / approved / rejected
);
CREATE TABLE IF NOT EXISTS sessions (
    token    TEXT PRIMARY KEY,
    user_id  INTEGER NOT NULL REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS cards (
    id       TEXT PRIMARY KEY,                   -- 例如 sv1-1
    data     TEXT NOT NULL                       -- 正規化後的卡片 JSON
);
CREATE TABLE IF NOT EXISTS decks (
    id        INTEGER PRIMARY KEY,
    owner_id  INTEGER NOT NULL REFERENCES users(id),
    name      TEXT NOT NULL,
    cards     TEXT NOT NULL                      -- 60 個卡號的 JSON 陣列
);
CREATE TABLE IF NOT EXISTS battles (
    id       INTEGER PRIMARY KEY,
    state    TEXT NOT NULL                       -- 對戰狀態 JSON
);
"""


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)
    # 管理員只從環境變數建立，程式碼中不寫入任何密碼
    phone = os.environ.get("PTCG_ADMIN_PHONE")
    password = os.environ.get("PTCG_ADMIN_PASSWORD")
    if phone and password:
        exists = conn.execute("SELECT 1 FROM users WHERE phone=?", (phone,)).fetchone()
        if not exists:
            conn.execute(
                "INSERT INTO users(phone, pw_hash, role, status) VALUES(?,?,'admin','approved')",
                (phone, hash_password(password)),
            )
    conn.commit()
