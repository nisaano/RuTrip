from typing import List, Optional

import requests
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from ai.cache import (
    build_ai_cache_key,
    get_cached_ai_response,
    set_cached_ai_response,
)
from core.config import ML_SERVICE_URL
from utils.helpers import normalize_search_query


router = APIRouter(prefix="/ai", tags=["ai"])


class GottenInfo(BaseModel):
    query: str
    tags: Optional[List[str]] = None
    top_k: Optional[int] = None


def is_valid_ml_response(data: dict) -> bool:
    if data.get("status") != "success":
        return False

    fallback_text = "Сейчас мы не можем связаться с ИИ"

    ai_recommendation = data.get("ai_recommendation") or ""

    if fallback_text in ai_recommendation:
        return False

    return True


@router.post("/search")
def search(info: GottenInfo):
    query = normalize_search_query(info.query)

    if not query:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Поисковый запрос не может быть пустым",
        )

    tags = info.tags or []

    cache_key = build_ai_cache_key(
        query=query,
        tags=tags,
        top_k=info.top_k,
    )

    cached_response = get_cached_ai_response(cache_key)

    if cached_response:
        cached_response["cache"] = "hit"
        return cached_response

    payload = {
        "query": query,
        "tags": tags,
    }

    if info.top_k is not None:
        payload["top_k"] = info.top_k

    try:
        response = requests.post(
            f"{ML_SERVICE_URL}/search",
            json=payload,
            timeout=30,
        )

        response.raise_for_status()

    except requests.RequestException:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML-сервис временно недоступен",
        )

    data = response.json()
    data["cache"] = "miss"

    if is_valid_ml_response(data):
        set_cached_ai_response(cache_key, data)

    return data