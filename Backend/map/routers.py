from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth.models import User
from auth.service import get_current_user
from database.database import get_db

from map.schemas import (
    RegionRead,
    UserProfileUpdate,
    VisitedRegionCreate,
)
from map.service import (
    create_or_update_visited_region,
    delete_user_visited_region,
    get_all_regions,
    get_user_visited_regions,
)


router = APIRouter(
    tags=["map"],
)


@router.get("/regions", response_model=list[RegionRead])
def get_regions(
    db: Session = Depends(get_db),
):
    return get_all_regions(db)


@router.get("/users/{user_id}/visited")
def get_visited_regions(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    return get_user_visited_regions(db, user_id)


@router.post("/users/{user_id}/visited")
def save_visited_region(
    user_id: int,
    data: VisitedRegionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    return create_or_update_visited_region(
        db=db,
        user_id=user_id,
        data=data,
    )


@router.delete("/users/{user_id}/visited/{region_id}")
def delete_visited_region(
    user_id: int,
    region_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    success = delete_user_visited_region(
        db=db,
        user_id=user_id,
        region_id=region_id,
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Visited region not found",
        )

    return {
        "message": "Visited region deleted",
    }


@router.get("/users/{user_id}/friends")
def get_friends(
    user_id: int,
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    return []


@router.put("/users/{user_id}")
def update_profile(
    user_id: int,
    data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    current_user.name = data.name

    if data.email:
        current_user.email = data.email

    db.commit()
    db.refresh(current_user)

    return current_user