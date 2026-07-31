# backend/app/core/geoip.py
"""
Server-side IP -> country lookup, using a local MaxMind GeoLite2 database
(no per-request network call — /assign is a hot path, latency matters).

If the .mmdb file isn't present (e.g. you haven't set it up yet, or in a
test/CI environment), this degrades gracefully to always returning None
rather than crashing every single /assign call.
"""
import os
from functools import lru_cache

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "GeoLite2-Country.mmdb")

_PRIVATE_PREFIXES = ("127.", "10.", "192.168.", "172.16.", "172.17.", "172.18.",
                      "172.19.", "172.2", "172.3", "::1")


@lru_cache(maxsize=1)
def _get_reader():
    if not os.path.exists(DB_PATH):
        return None
    try:
        import geoip2.database
        return geoip2.database.Reader(DB_PATH)
    except Exception as e:
        print(f"[geoip] Failed to load GeoLite2 database: {e}")
        return None


def get_country_from_ip(ip: str) -> str | None:
    if not ip or ip.startswith(_PRIVATE_PREFIXES):
        return None

    reader = _get_reader()
    if reader is None:
        return None

    try:
        response = reader.country(ip)
        return response.country.iso_code
    except Exception:
        return None


def get_client_ip(request) -> str:
    """
    Most deployments (Railway included) sit behind a reverse proxy, so
    request.client.host is the PROXY's IP, not the visitor's. The real
    visitor IP is in X-Forwarded-For (first entry — proxies append their
    own IP to the end of the chain, the original client is always first).
    """
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else ""