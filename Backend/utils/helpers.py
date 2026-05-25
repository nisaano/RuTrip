from datetime import datetime
from typing import Any

from fastapi import HTTPException, status


def utc_now() -> datetime:
    return datetime.utcnow()


def validate_password_strength(password: str) -> None:
    if not any(char.isdigit() for char in password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пароль должен содержать хотя бы одну цифру",
        )

    if not any(char.isalpha() for char in password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пароль должен содержать хотя бы одну букву",
        )


def build_user_response(user: Any) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "avatar": user.avatar,
        "visited_subjects": user.visited_subjects or [],
        "achievements": user.achievements or [],
    }


def normalize_search_query(query: str) -> str:
    return query.strip()