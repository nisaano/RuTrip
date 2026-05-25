from pydantic import BaseModel
from typing import List, Optional


class GottenInfo(BaseModel):
    query: str
    tags: Optional[List[str]] = None
    top_k: Optional[int] = None


class SearchResponse(BaseModel):
    status: str
    query: str
    detected_tags: List[str]
    ai_recommendation: Optional[str]
    regions: List[str]