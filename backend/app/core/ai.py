import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.1-70b-versatile"   # free, fast, very capable


def chat(system: str, user: str, max_tokens: int = 1000) -> str:
    """Simple single-turn chat. Returns the response text."""
    response = client.chat.completions.create(
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
    response = client.chat.completions.create(
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