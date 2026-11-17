from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    first_name: str = Field(..., alias="firstName")
    last_name: Optional[str] = Field(None, alias="lastName")
    email: EmailStr
    phone: str
    age: Optional[int] = None
    gender: Optional[str] = None
    username: str

    class Config:
        populate_by_name = True

class UserRegister(UserBase):
    password: str = Field(..., min_length=6)
    pin: str = Field(..., min_length=4, max_length=4)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = Field(None, alias="firstName")
    last_name: Optional[str] = Field(None, alias="lastName")
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    username: Optional[str] = None

    class Config:
        populate_by_name = True

class PasswordChangeRequest(BaseModel):
    current_password: str = Field(..., alias="currentPassword")
    new_password: str = Field(..., alias="newPassword", min_length=6)

    class Config:
        populate_by_name = True

class UserResponse(BaseModel):
    id: int
    first_name: str = Field(..., alias="firstName")
    last_name: Optional[str] = Field(None, alias="lastName")
    email: str
    phone: str
    age: Optional[int] = None
    gender: Optional[str] = None
    username: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
