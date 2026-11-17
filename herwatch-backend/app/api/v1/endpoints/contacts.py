from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.models.contact import EmergencyContact
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/contacts", tags=["Emergency Contacts"])

@router.get("", response_model=List[ContactResponse])
def get_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contacts = db.query(EmergencyContact).filter(
        EmergencyContact.user_id == current_user.id
    ).order_by(EmergencyContact.is_primary.desc(), EmergencyContact.created_at.desc()).all()
    return contacts

@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def add_contact(
    contact_in: ContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contact = EmergencyContact(
        user_id=current_user.id,
        name=contact_in.name,
        phone=contact_in.phone,
        email=contact_in.email,
        relationship=contact_in.relationship,
        is_primary=contact_in.is_primary
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(
    contact_id: int,
    contact_in: ContactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contact = db.query(EmergencyContact).filter(
        EmergencyContact.id == contact_id,
        EmergencyContact.user_id == current_user.id
    ).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency contact not found."
        )

    if contact_in.name is not None:
        contact.name = contact_in.name
    if contact_in.phone is not None:
        contact.phone = contact_in.phone
    if contact_in.email is not None:
        contact.email = contact_in.email
    if contact_in.relationship is not None:
        contact.relationship = contact_in.relationship
    if contact_in.is_primary is not None:
        contact.is_primary = contact_in.is_primary

    db.commit()
    db.refresh(contact)
    return contact

@router.delete("/{contact_id}")
def delete_contact(
    contact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contact = db.query(EmergencyContact).filter(
        EmergencyContact.id == contact_id,
        EmergencyContact.user_id == current_user.id
    ).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency contact not found."
        )

    db.delete(contact)
    db.commit()
    return {"message": "Contact removed successfully."}
