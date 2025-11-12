# app/models.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any

class ParentInfo(BaseModel):
    name: str
    email: Optional[EmailStr]
    alt_email: Optional[EmailStr]
    phone: str
    alt_phone: Optional[str]

class ChildInfo(BaseModel):
    name: str
    age: int
    skin_complexion: str
    birth_marks: Optional[List[str]] = Field(default_factory=list)  # multiple birthmarks
    city: str

class VolunteerInfo(BaseModel):
    name: str
    email: Optional[EmailStr]
    alt_email: Optional[EmailStr]
    phone: str
    alt_phone: Optional[str]

class FoundChild(BaseModel):
    name: str
    age: int
    skin_complexion: str
    birth_marks: Optional[List[str]] = Field(default_factory=list)
    city: str
    address: Optional[str]

class UploadResponse(BaseModel):
    image_code: str
    message: str
    image_id: str
    role: str
    match: Optional[Any] = None
