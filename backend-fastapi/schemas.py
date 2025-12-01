from pydantic import BaseModel
from typing import Optional, Dict
from uuid import UUID
from datetime import date

class EventBase(BaseModel):
    name: str
    event_date: date
    pulse_link: Optional[str] = None
    cheat_sheet_data: Optional[Dict] = None
    is_active: bool = True

class Event(EventBase):
    id: UUID

    class Config:
        from_attributes = True

class ClaimResponse(BaseModel):
    message: str
    certificate_url: Optional[str] = None