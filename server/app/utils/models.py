from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime
import uuid

# --------------------------------------------------------------------
# Pydantic Model for Confirm/Reject requests
# --------------------------------------------------------------------
class MatchUpdateRequest(BaseModel):
    submission_id: str

# --------------------------------------------------------------------
# API Response Model for Match Page
# --------------------------------------------------------------------
class MatchResponse(BaseModel):
    submission_id: str
    match_score: float
    # These will be populated with submission data dicts
    parent_report: dict 
    volunteer_report: dict

    class Config:
        from_attributes = True # Replaces orm_mode for Pydantic v2

# --------------------------------------------------------------------
# NEW: Nested Schema Models
# --------------------------------------------------------------------

class ParentInfo(BaseModel):
    name: str
    email: str
    alt_email: Optional[str] = None
    phone: str
    alt_phone: Optional[str] = None

class ChildInfo(BaseModel):
    name: str
    age: int
    skin: str
    birthmarks: List[str]
    city: str

class VolunteerInfo(BaseModel):
    name: str
    email: str
    phone: str
    alt_phone: Optional[str] = None

class FoundChildInfo(BaseModel):
    # Field names match your schema
    approx_age: int
    skin: str
    birthmarks: List[str]
    city_found: str
    address_found: str

class MatchInfo(BaseModel):
    volunteer_report_id: Optional[str] = None
    parent_report_id: Optional[str] = None
    score: Optional[float] = None
    confirmed: bool = False
    confirmed_at: Optional[datetime] = None # Added for tracking

# --------------------------------------------------------------------
# NEW: Database Schema Models
# --------------------------------------------------------------------

class ParentSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    # user_id: Optional[str] = None # Skipped for now
    parent: ParentInfo
    child_entered: ChildInfo
    image_path: Optional[str] = None # Changed from image_id
    embedding: Optional[List[float]] = None
    match: MatchInfo = Field(default_factory=MatchInfo)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}

class VolunteerSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    # user_id: Optional[str] = None # Skipped for now
    volunteer: VolunteerInfo
    found_child: FoundChildInfo
    image_path: Optional[str] = None # Changed from image_id
    embedding: Optional[List[float]] = None
    match: MatchInfo = Field(default_factory=MatchInfo)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}

class FinalChildInfo(BaseModel):
    final_name: str
    final_age: int
    skin: str
    birthmarks: List[str]
    city_last_seen: str
    address_found: str

class FinalImages(BaseModel):
    parent_image_path: Optional[str] = None
    volunteer_image_path: Optional[str] = None # Renamed from parent/volunteer_image_id

class ChildDB(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    parent_report_id: str
    volunteer_report_id: str
    child: FinalChildInfo
    images: FinalImages
    match_score: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}