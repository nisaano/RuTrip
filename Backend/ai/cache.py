import hashlib
import json
from typing import Any, Optional
import redis

from core.config import REDIS_URL, AI_CACHE_TTL_SECONDS


redis_client = redis.Redis.from_url(
    REDIS_URL,
    decode_responses=True,
)


def build_ai_cache_key(
    query: str,
    tags: list[str] | None = None,
    top_k: int | None = None,
) -> str:
    normalized_tags = sorted(tags or [])

    raw_key = {
        "query": query,
        "tags": normalized_tags,
        "top_k": top_k,
    }

    key_string = json.dumps(
        raw_key,
        ensure_ascii=False,
        sort_keys=True,
    )

    key_hash = hashlib.sha256(key_string.encode("utf-8")).hexdigest()

    return f"ai_search:{key_hash}"


def get_cached_ai_response(cache_key: str) -> Optional[dict[str, Any]]:
    try:
        cached = redis_client.get(cache_key)

        if not cached:
            return None

        return json.loads(cached)

    except Exception:
        return None


def set_cached_ai_response(cache_key: str, data: dict[str, Any]) -> None:
    try:
        redis_client.setex(
            cache_key,
            AI_CACHE_TTL_SECONDS,
            json.dumps(data, ensure_ascii=False),
        )
    except Exception:
        pass