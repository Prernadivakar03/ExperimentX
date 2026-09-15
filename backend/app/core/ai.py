import os
import logging
from groq import Groq

logger = logging.getLogger("experimentx.ai")

MODEL = os.getenv("AI_MODEL", "openai/gpt-oss-120b")

_client = None


def _get_client() -> Groq:
    """Lazily construct the Groq client on first real use, so a missing
    GROQ_API_KEY can't block the whole API from starting — it only breaks
    the AI endpoints when they're actually called."""
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not set — AI features are unavailable."
            )
        _client = Groq(api_key=api_key)
    return _client


def chat(system: str, user: str, max_tokens: int = 1000) -> str:
    """Simple single-turn chat. Returns the response text."""
    response = _get_client().chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        max_tokens=max_tokens,
        temperature=0.7,
    )
    return response.choices[0].message.content


def chat_json(system: str, user: str, max_tokens: int = 1000) -> str:
    """Forces JSON output. Returns raw string — caller must json.loads()."""
    response = _get_client().chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system + "\n\nYou MUST respond with valid JSON only. No markdown, no backticks, no explanation. Raw JSON only."},
            {"role": "user", "content": user},
        ],
        max_tokens=max_tokens,
        temperature=0.3,
        response_format={"type": "json_object"},
    )
    return response.choices[0].message.content