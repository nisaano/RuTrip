from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from database.models import Base


class Region(Base):
    __tablename__ = "regions"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    sights = Column(JSON, default=list, nullable=False)

    visited_records = relationship(
        "VisitedRegion",
        back_populates="region",
        cascade="all, delete-orphan",
    )


class VisitedRegion(Base):
    __tablename__ = "visited_regions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    region_id = Column(
        String,
        ForeignKey("regions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    visited_by_route = Column(Boolean, nullable=True)
    selected_sights = Column(JSON, default=list, nullable=False)
    review_text = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True)
    photos = Column(JSON, default=list, nullable=False)
    suggestion = Column(Text, nullable=True)

    visited_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    user = relationship("User")
    region = relationship(
        "Region",
        back_populates="visited_records",
    )