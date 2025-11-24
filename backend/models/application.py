from sqlalchemy import Column, String, Text, TIMESTAMP, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(Text, unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    full_name = Column(Text)
    nationality = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True))
    visa_type_id = Column(UUID(as_uuid=True))
    status = Column(String, nullable=False, default='draft')  # draft, submitted, completed
    profile_data = Column(JSON, nullable=False)  # User input data
    recommended = Column(JSON, nullable=False, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

class ApplicationScore(Base):
    __tablename__ = "application_scores"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), nullable=False)
    score_table_id = Column(UUID(as_uuid=True), nullable=False)
    total_score = Column(JSON, nullable=False)
    passed = Column(JSON, nullable=False)
    breakdown = Column(JSON, nullable=False)  # Detailed score breakdown
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
