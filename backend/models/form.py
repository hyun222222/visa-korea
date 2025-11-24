from sqlalchemy import Column, String, Integer, Boolean, Text, TIMESTAMP, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from database import Base

class Form(Base):
    __tablename__ = "forms"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String, nullable=False)  # e.g. 'B34', 'B21'
    name_ko = Column(Text, nullable=False)
    file_path = Column(Text, nullable=False)  # Server template path
    version = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class FormField(Base):
    __tablename__ = "form_fields"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    form_id = Column(UUID(as_uuid=True), nullable=False)
    field_name = Column(Text, nullable=False)  # internal name
    label_ko = Column(Text)
    page = Column(Integer, nullable=False)
    x = Column(Numeric, nullable=False)
    y = Column(Numeric, nullable=False)
    font_size = Column(Numeric, nullable=False, default=10)
    width = Column(Numeric)
    height = Column(Numeric)
    alignment = Column(String, default='left')

class FormMapping(Base):
    __tablename__ = "form_mappings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    form_id = Column(UUID(as_uuid=True), nullable=False)
    visa_type_id = Column(UUID(as_uuid=True))
    field_id = Column(UUID(as_uuid=True), nullable=False)
    source_path = Column(Text, nullable=False)  # e.g. 'applicant.fullNameKo'
    required = Column(Boolean, nullable=False, default=False)
