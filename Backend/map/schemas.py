from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class RegionRead(BaseModel):
    id: str
    name: str
    sights: list[str] = []


class VisitedRegionCreate(BaseModel):
    regionId: str
    visitedByRoute: Optional[bool] = None
    selectedSights: list[str] = Field(default_factory=list)
    reviewText: Optional[str] = None
    rating: Optional[int] = None
    photos: list[str] = Field(default_factory=list)
    suggestion: Optional[str] = None


class VisitedRegionRead(BaseModel):
    regionId: str
    visitedByRoute: Optional[bool] = None
    selectedSights: list[str] = []
    reviewText: Optional[str] = None
    rating: Optional[int] = None
    photos: list[str] = []
    suggestion: Optional[str] = None
    visitedAt: datetime


class UserProfileUpdate(BaseModel):
    name: str
    email: Optional[str] = None