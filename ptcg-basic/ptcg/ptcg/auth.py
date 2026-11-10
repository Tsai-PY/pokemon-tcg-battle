"""密碼雜湊與密碼政策。密碼以 PBKDF2-SHA256 雜湊後儲存，不保存明碼。"""
import hashlib
import hmac
import re
import secrets

PHONE_RE = re.compile(r"^09\d{8}$")  # 台灣手機號碼：09 開頭共 10 碼
ITERATIONS = 200_000


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, ITERATIONS)
    return f"pbkdf2_sha256${ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        _, iters, salt_hex, digest_hex = stored.split("$")
    except ValueError:
        return False
    test = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), int(iters)
    )
    return hmac.compare_digest(test.hex(), digest_hex)


def check_password_policy(password: str) -> str | None:
    """回傳錯誤訊息；合格則回傳 None。"""
    if len(password) < 8:
        return "密碼至少需要 8 個字元"
    if password.isdigit() and len(password) == 8:
        return "密碼不可只用 8 位數字（例如生日），請加入英文字母或符號"
    return None
