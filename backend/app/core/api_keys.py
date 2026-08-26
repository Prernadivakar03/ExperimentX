"""
API key generation and hashing for org-scoped SDK authentication.

Two key types, same as Stripe/most SaaS SDKs:
  - Public key  (expx_public_...): safe to embed in browser JS. Can only
    call visitor-facing endpoints (/assign, /track-event,
    /track-conversion, /flags/evaluate). Anyone can read it out of your
    page source — that's expected and fine, since it can't do anything
    sensitive.
  - Secret key  (expx_secret_...): server-side only, never sent to a
    browser. Reserved for future management/admin API access. Today
    nothing requires it yet, but the type is enforced at the DB level now
    so adding a privileged endpoint later is a route-level dependency
    change, not a schema migration.
"""
import hashlib
import secrets
from typing import Literal

PUBLIC_KEY_PREFIX = "expx_public_"
SECRET_KEY_PREFIX = "expx_secret_"
_SECRET_LENGTH = 32  # characters of random secret after the prefix
_DISPLAY_PREFIX_CHARS = 8  # how much of the secret to keep visible in the UI

KeyType = Literal["public", "secret"]


def generate_api_key(key_type: KeyType = "public") -> dict:
    """
    Returns a dict with:
      - "full_key": the plaintext key — show this to the user exactly once
      - "display_prefix": short, safe-to-store-and-show fragment
      - "key_hash": sha256 hex digest — this is what gets stored in the DB
      - "key_type": "public" or "secret", echoed back for convenience
    """
    prefix = SECRET_KEY_PREFIX if key_type == "secret" else PUBLIC_KEY_PREFIX
    secret = secrets.token_urlsafe(_SECRET_LENGTH)[:_SECRET_LENGTH]
    full_key = f"{prefix}{secret}"
    return {
        "full_key": full_key,
        "display_prefix": full_key[: len(prefix) + _DISPLAY_PREFIX_CHARS],
        "key_hash": hash_api_key(full_key),
        "key_type": key_type,
    }


def hash_api_key(full_key: str) -> str:
    return hashlib.sha256(full_key.encode("utf-8")).hexdigest()


def looks_like_api_key(value: str) -> bool:
    return bool(value) and (value.startswith(PUBLIC_KEY_PREFIX) or value.startswith(SECRET_KEY_PREFIX))