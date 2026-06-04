from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class PostBase(BaseModel):
    title: str
    content: str
    category: Optional[str] = "News"
    is_published: Optional[bool] = True

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    is_published: Optional[bool] = None

class PostResponse(PostBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
