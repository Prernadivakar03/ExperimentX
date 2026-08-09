"""
API key generation and hashing utilities.

Keys are generated once, shown to the user in full exactly one time, and
only the SHA-256 hash is persisted. This module never stores or logs the
plaintext key itself.
"""

import hashlib
import secrets

KEY_PREFIX = "expx_live_"

# How many characters of the full key are safe to store/display for
# identification purposes (e.g. "expx_live_ab12cd34..." in a dashboard
# table) without exposing enough of the secret to be useful to an attacker.
DISPLAY_PREFIX_LENGTH = 14


def generate_api_key() -> dict:
    """
    Generate a new API key.

    Returns a dict with:
      - full_key: the complete secret, e.g. "expx_live_<43 random chars>".
        Only ever returned once, at creation time — show it to the user
        and do not store it anywhere.
      - display_prefix: a short, non-secret prefix of full_key, safe to
        store and show in a UI so users can recognize which key is which.
      - key_hash: the SHA-256 hex digest of full_key. This is what should
        be persisted and compared against on each request.
    """
    secret = secrets.token_urlsafe(32)
    full_key = f"{KEY_PREFIX}{secret}"

    return {
        "full_key": full_key,
        "display_prefix": full_key[:DISPLAY_PREFIX_LENGTH],
        "key_hash": hash_api_key(full_key),
    }


def hash_api_key(key: str) -> str:
    """
    Return the SHA-256 hex digest of the given API key string.

    Deterministic — the same input always produces the same output — so
    this can be used both to compute the hash to store at creation time
    and to verify an incoming request's key by re-hashing and comparing.
    """
    return hashlib.sha256(key.encode("utf-8")).hexdigest()


def looks_like_api_key(value) -> bool:
    """
    Cheap, non-cryptographic check for whether a string is shaped like one
    of our API keys (correct prefix, non-empty). Useful for quick request
    validation before doing a database lookup. Safe to call with None.
    """
    if not value:
        return False
    return value.startswith(KEY_PREFIX)