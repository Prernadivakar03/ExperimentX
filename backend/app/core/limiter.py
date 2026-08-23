from fastapi import Request, HTTPException, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from limits import parse
from limits.storage import MemoryStorage
from limits.strategies import FixedWindowRateLimiter

limiter = Limiter(key_func=get_remote_address)


# ── Pre-auth rate limiting for public tracking endpoints ────────────────────
# @limiter.limit(...) only fires once the decorated function's BODY runs --
# but FastAPI resolves Depends() (including get_org_from_api_key) *before*
# calling that function. So a request with a missing/invalid API key raises
# its 401 during dependency resolution and the decorator never even sees
# it -- meaning junk/unauthenticated traffic to /assign, /track-event,
# /track-conversion, and /flags/evaluate was going completely unthrottled,
# while only successfully-authenticated traffic was actually being limited.
#
# This dependency uses the same underlying `limits` library slowapi wraps,
# but as a plain FastAPI Depends() instead of a decorator -- so as long as
# it's listed FIRST in a route's parameters, it always runs before auth can
# short-circuit it, regardless of whether the API key turns out to be valid.
_pre_auth_storage = MemoryStorage()
_pre_auth_strategy = FixedWindowRateLimiter(_pre_auth_storage)


def rate_limit_by_ip(limit_str: str):
    """
    Usage: add as the FIRST parameter, e.g.
        def my_route(_rl = Depends(rate_limit_by_ip("60/minute")), ...):
    """
    parsed = parse(limit_str)

    def dependency(request: Request):
        client_ip = request.client.host if request.client else "unknown"
        key = f"{client_ip}:{request.url.path}"
        if not _pre_auth_strategy.hit(parsed, key):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded: {limit_str}",
            )

    return dependency
