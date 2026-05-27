from datetime import datetime
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from auth.models import User, RefreshToken
from auth.schemas import (
    UserRegister,
    UserLogin,
    ForgotPasswordRequest,
    RefreshTokenRequest,
    VerifyEmailRequest,
)
from auth.service import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    send_verification_email,
    get_user_by_email,
)
from database.database import get_db
from utils.helpers import (
    validate_password_strength,
    build_user_response,
)


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, user_data.email)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким email уже существует",
        )

    validate_password_strength(user_data.password)

    verification_code = str(uuid.uuid4())[:6]
    hashed_pw = hash_password(user_data.password)

    new_user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_pw,
        verification_code=verification_code,
        visited_subjects=[],
        achievements=["Новичок"],
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    send_verification_email(user_data.email, verification_code)

    return {
        "message": "Регистрация успешна. Подтвердите email",
        "user_id": new_user.id,
        "requires_verification": True,
    }


@router.post("/login")
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, login_data.email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
        )

    if not user.hashed_password or not verify_password(
        login_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
        )

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
        }
    )

    refresh_token = create_refresh_token(user.id, db)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": build_user_response(user),
    }


@router.post("/refresh")
async def refresh_access_token(
    data: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    token_record = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token == data.refresh_token,
            RefreshToken.expires_at > datetime.utcnow(),
        )
        .first()
    )

    if not token_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный или истекший refresh токен",
        )

    user = db.query(User).filter(User.id == token_record.user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден",
        )

    new_access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
        }
    )

    return {
        "access_token": new_access_token,
    }


@router.post("/logout")
async def logout(
    data: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    token_record = (
        db.query(RefreshToken)
        .filter(RefreshToken.token == data.refresh_token)
        .first()
    )

    if token_record:
        db.delete(token_record)
        db.commit()

    return {
        "message": "Выход выполнен успешно",
    }


@router.get("/me")
async def get_me(
    current_user: User = Depends(get_current_user),
):
    return build_user_response(current_user)


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    user = get_user_by_email(db, request.email)

    if not user:
        return {
            "message": "Инструкции отправлены на email",
        }

    reset_code = str(uuid.uuid4())[:8]
    user.verification_code = reset_code

    db.commit()

    print(f"Сброс пароля для {request.email}: код {reset_code}")

    return {
        "message": "Инструкции отправлены на email",
    }


@router.post("/verify")
async def verify_email(
    data: VerifyEmailRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.verification_code == data.code)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неверный код подтверждения",
        )

    user.is_verified = True
    user.is_active = True
    user.verification_code = None

    db.commit()

    return {
        "message": "Email успешно подтвержден",
    }


@router.get("/vk/login")
async def vk_login():
    return {
        "redirect_url":
            "https://oauth.vk.com/authorize"
            "?client_id=YOUR_CLIENT_ID"
            "&redirect_uri=YOUR_REDIRECT_URI"
            "&response_type=code"
    }


@router.get("/telegram/login")
async def telegram_login():
    return {
        "redirect_url":
            "https://oauth.telegram.org/auth"
            "?bot_id=YOUR_BOT_ID"
            "&origin=YOUR_DOMAIN"
            "&embed=1"
    }


@router.get("/yandex/login")
async def yandex_login():
    return {
        "redirect_url":
            "https://oauth.yandex.ru/authorize"
            "?response_type=code"
            "&client_id=YOUR_CLIENT_ID"
    }


@router.post("/vk/callback")
async def vk_callback(
    code: str,
    db: Session = Depends(get_db),
):
    return {
        "message": "Авторизация через VK",
    }