"""
Run from backend/ with: pytest tests/test_api_keys.py -v
"""
from app.core.api_keys import generate_api_key, hash_api_key, looks_like_api_key, KEY_PREFIX


def test_generated_key_starts_with_expected_prefix():
    result = generate_api_key()
    assert result["full_key"].startswith(KEY_PREFIX)


def test_display_prefix_never_leaks_the_full_secret():
    result = generate_api_key()
    assert len(result["display_prefix"]) < len(result["full_key"])
    assert result["display_prefix"] == result["full_key"][: len(result["display_prefix"])]


def test_key_hash_matches_hashing_the_full_key_again():
    result = generate_api_key()
    assert result["key_hash"] == hash_api_key(result["full_key"])


def test_two_generated_keys_are_never_equal():
    a = generate_api_key()
    b = generate_api_key()
    assert a["full_key"] != b["full_key"]
    assert a["key_hash"] != b["key_hash"]


def test_hash_is_deterministic_for_the_same_input():
    key = "expx_live_some_fixed_value_for_testing"
    assert hash_api_key(key) == hash_api_key(key)


def test_hash_is_a_sha256_hex_digest():
    result = hash_api_key("expx_live_whatever")
    assert len(result) == 64
    assert all(c in "0123456789abcdef" for c in result)


def test_hash_never_contains_the_plaintext_key():
    key = "expx_live_super_secret_value_123"
    hashed = hash_api_key(key)
    assert key not in hashed


def test_looks_like_api_key_accepts_valid_prefix():
    assert looks_like_api_key("expx_live_abcdef123456") is True


def test_looks_like_api_key_rejects_wrong_prefix():
    assert looks_like_api_key("sk_live_abcdef123456") is False


def test_looks_like_api_key_rejects_empty_string():
    assert looks_like_api_key("") is False


def test_looks_like_api_key_rejects_none_safely():
    assert looks_like_api_key(None) is False