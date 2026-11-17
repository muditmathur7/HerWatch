from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ContactBase(BaseModel):
    name: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=5)
    email: Optional[str] = None
    relationship: Optional[str] = None
    is_primary: bool = Field(False, alias="isPrimary")

    class Config:
        populate_by_name = True

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    relationship: Optional[str] = None
    is_primary: Optional[bool] = Field(None, alias="isPrimary")

    class Config:
        populate_by_name = True

class ContactResponse(ContactBase):
    id: int
    user_id: int = Field(..., alias="userId")
    created_at: Optional[datetime] = Field(None, alias="createdAt")

    class Config:
        from_attributes = True
        populate_by_name = True
