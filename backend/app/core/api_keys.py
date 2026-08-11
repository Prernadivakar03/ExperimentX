"""
API key generation and hashing for org-scoped SDK authentication.

Format: expx_live_<32 url-safe chars>
The "live" segment mirrors Stripe-style key prefixes and leaves room for a
future "expx_test_" prefix for sandbox/staging keys without a schema change.
"""
import hashlib
import secrets

KEY_PREFIX = "expx_live_"
_SECRET_LENGTH = 32  # characters of random secret after the prefix
_DISPLAY_PREFIX_CHARS = 8  # how much of the secret to keep visible in the UI


def generate_api_key() -> dict:
    """
    Returns a dict with:
      - "full_key": the plaintext key — show this to the user exactly once
      - "display_prefix": short, safe-to-store-and-show fragment (e.g. for a
        "Production SDK — expx_live_ab12cd34…" list row)
      - "key_hash": sha256 hex digest — this is what gets stored in the DB
    """
    secret = secrets.token_urlsafe(_SECRET_LENGTH)[:_SECRET_LENGTH]
    full_key = f"{KEY_PREFIX}{secret}"
    return {
        "full_key": full_key,
        "display_prefix": full_key[: len(KEY_PREFIX) + _DISPLAY_PREFIX_CHARS],
        "key_hash": hash_api_key(full_key),
    }


def hash_api_key(full_key: str) -> str:
    return hashlib.sha256(full_key.encode("utf-8")).hexdigest()


def looks_like_api_key(value: str) -> bool:
    return bool(value) and value.startswith(KEY_PREFIX)