from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    hash_pin,
    create_access_token
)
from app.models.user import User
from app.schemas.user import (
    UserRegister,
    UserLogin,
    UserProfileUpdate,
    PasswordChangeRequest,
    UserResponse,
    TokenResponse
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if email is already registered
    existing_user_email = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Check if username is already taken
    existing_user_username = db.query(User).filter(User.username == user_in.username).first()
    if existing_user_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This username is already taken. Please choose another."
        )

    # Create new user
    user = User(
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email.lower(),
        phone=user_in.phone,
        age=user_in.age,
        gender=user_in.gender,
        username=user_in.username,
        hashed_password=hash_password(user_in.password),
        pin_hash=hash_pin(user_in.pin),
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate JWT token
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email.lower()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is deactivated."
        )

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.put("/me", response_model=UserResponse)
def update_me(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_in.first_name is not None:
        current_user.first_name = profile_in.first_name
    if profile_in.last_name is not None:
        current_user.last_name = profile_in.last_name
    if profile_in.phone is not None:
        current_user.phone = profile_in.phone
    if profile_in.age is not None:
        current_user.age = profile_in.age
    if profile_in.gender is not None:
        current_user.gender = profile_in.gender
    if profile_in.username is not None and profile_in.username != current_user.username:
        # Check if new username is taken
        existing = db.query(User).filter(User.username == profile_in.username).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken."
            )
        current_user.username = profile_in.username

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)

@router.post("/change-password")
def change_password(
    pass_in: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(pass_in.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect."
        )

    current_user.hashed_password = hash_password(pass_in.new_password)
    db.commit()
    return {"message": "Password updated successfully."}
