"""
Run from backend/ with: pytest tests/test_security.py -v
"""
import time
import pytest
from jose import jwt, JWTError

from app.core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
)
from app.core.config import SECRET_KEY, ALGORITHM


# ── password hashing ──────────────────────────────────────────────────────

def test_hash_password_does_not_return_plaintext():
    hashed = hash_password("correct-horse-battery-staple")
    assert hashed != "correct-horse-battery-staple"


def test_verify_password_accepts_correct_password():
    hashed = hash_password("hunter2")
    assert verify_password("hunter2", hashed) is True


def test_verify_password_rejects_wrong_password():
    hashed = hash_password("hunter2")
    assert verify_password("wrong-password", hashed) is False


def test_same_password_hashes_differently_each_time():
    # bcrypt salts automatically -- two hashes of the same password must differ
    h1 = hash_password("same-password")
    h2 = hash_password("same-password")
    assert h1 != h2
    assert verify_password("same-password", h1) is True
    assert verify_password("same-password", h2) is True


def test_empty_password_still_round_trips():
    hashed = hash_password("")
    assert verify_password("", hashed) is True
    assert verify_password("not-empty", hashed) is False


# ── access / refresh tokens ──────────────────────────────────────────────

def test_access_token_decodes_to_correct_subject():
    token = create_access_token("user-123")
    payload = decode_token(token)
    assert payload["sub"] == "user-123"
    assert payload["type"] == "access"


def test_refresh_token_decodes_to_correct_subject():
    token = create_refresh_token("user-456")
    payload = decode_token(token)
    assert payload["sub"] == "user-456"
    assert payload["type"] == "refresh"


def test_access_and_refresh_tokens_are_distinguishable():
    access = decode_token(create_access_token("user-1"))
    refresh = decode_token(create_refresh_token("user-1"))
    assert access["type"] != refresh["type"]


def test_decode_token_rejects_garbage_string():
    with pytest.raises(JWTError):
        decode_token("this-is-not-a-jwt")


# def test_decode_token_rejects_tampered_signature():
#     token = create_access_token("user-123")
#     # flip the last character of the signature -- must fail verification
#     tampered = token[:-1] + ("A" if token[-1] != "A" else "B")
#     with pytest.raises(JWTError):
#         decode_token(tampered)


def test_decode_token_rejects_tampered_signature():
    token = create_access_token("user-123")
    # Flip a character a few positions before the end, not the very last
    # one. JWT HS256 signatures are 256 bits but base64url encodes 6 bits
    # per character, so the final character only carries 4 meaningful bits
    # (2 are discarded on decode) -- flipping *that specific* character can,
    # for some byte values, decode to the identical signature and make this
    # test flaky. A character further in doesn't have that edge case.
    idx = len(token) - 4
    flipped = "A" if token[idx] != "A" else "B"
    tampered = token[:idx] + flipped + token[idx + 1:]
    with pytest.raises(JWTError):
        decode_token(tampered)


def test_decode_token_rejects_expired_token():
    # hand-craft an already-expired token using the same secret/algorithm
    import datetime
    expired_payload = {
        "sub": "user-123",
        "type": "access",
        "exp": datetime.datetime.utcnow() - datetime.timedelta(minutes=5),
    }
    expired_token = jwt.encode(expired_payload, SECRET_KEY, algorithm=ALGORITHM)
    with pytest.raises(JWTError):
        decode_token(expired_token)


def test_decode_token_rejects_wrong_secret():
    forged = jwt.encode({"sub": "user-123", "type": "access"}, "not-the-real-secret", algorithm=ALGORITHM)
    with pytest.raises(JWTError):
        decode_token(forged)