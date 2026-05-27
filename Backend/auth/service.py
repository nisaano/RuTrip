from datetime import timedelta
import uuid

import bcrypt
import jwt
from sqlalchemy.orm import Session

from core.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
)

from auth.models import User, RefreshToken
from utils.helpers import utc_now


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()

    expire = utc_now() + (
        expires_delta
        if expires_delta
        else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update(
        {
            "exp": expire,
            "type": "access",
        }
    )

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def create_refresh_token(user_id: int, db: Session) -> str:
    token = str(uuid.uuid4())
    expires_at = utc_now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    refresh_token_obj = RefreshToken(
        token=token,
        user_id=user_id,
        expires_at=expires_at,
    )

    db.add(refresh_token_obj)
    db.commit()

    return token


def send_verification_email(email: str, code: str) -> None:
    print(f"Письмо для {email}: Код подтверждения {code}")


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()