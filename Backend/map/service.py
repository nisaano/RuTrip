from sqlalchemy.orm import Session

from map.models import Region, VisitedRegion
from map.schemas import VisitedRegionCreate


def get_all_regions(db: Session) -> list[Region]:
    return db.query(Region).order_by(Region.name).all()


def get_user_visited_regions(db: Session, user_id: int) -> dict:
    visited_regions = (
        db.query(VisitedRegion)
        .filter(VisitedRegion.user_id == user_id)
        .all()
    )

    result = {}

    for item in visited_regions:
        result[item.region_id] = {
            "regionId": item.region_id,
            "visitedByRoute": item.visited_by_route,
            "selectedSights": item.selected_sights or [],
            "reviewText": item.review_text,
            "rating": item.rating,
            "photos": item.photos or [],
            "suggestion": item.suggestion,
            "visitedAt": item.visited_at,
        }

    return result


def create_or_update_visited_region(
    db: Session,
    user_id: int,
    data: VisitedRegionCreate,
) -> dict:
    region = db.query(Region).filter(Region.id == data.regionId).first()

    if not region:
        region = Region(
            id=data.regionId,
            name=data.regionId,
            sights=[],
        )
        db.add(region)
        db.flush()

    visited_region = (
        db.query(VisitedRegion)
        .filter(
            VisitedRegion.user_id == user_id,
            VisitedRegion.region_id == data.regionId,
        )
        .first()
    )

    if not visited_region:
        visited_region = VisitedRegion(
            user_id=user_id,
            region_id=data.regionId,
        )
        db.add(visited_region)

    visited_region.visited_by_route = data.visitedByRoute
    visited_region.selected_sights = data.selectedSights
    visited_region.review_text = data.reviewText
    visited_region.rating = data.rating
    visited_region.photos = data.photos
    visited_region.suggestion = data.suggestion

    db.commit()
    db.refresh(visited_region)

    return {
        "regionId": visited_region.region_id,
        "visitedByRoute": visited_region.visited_by_route,
        "selectedSights": visited_region.selected_sights or [],
        "reviewText": visited_region.review_text,
        "rating": visited_region.rating,
        "photos": visited_region.photos or [],
        "suggestion": visited_region.suggestion,
        "visitedAt": visited_region.visited_at,
    }


def delete_user_visited_region(
    db: Session,
    user_id: int,
    region_id: str,
) -> bool:
    visited_region = (
        db.query(VisitedRegion)
        .filter(
            VisitedRegion.user_id == user_id,
            VisitedRegion.region_id == region_id,
        )
        .first()
    )

    if not visited_region:
        return False

    db.delete(visited_region)
    db.commit()

    return True