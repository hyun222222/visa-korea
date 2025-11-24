from sqlalchemy import Column, String, Integer, Boolean, Text, TIMESTAMP, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from database import Base

class VisaType(Base):
    __tablename__ = "visa_types"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String, nullable=False)  # e.g. 'E-7', 'D-10', 'F-2'
    subcode = Column(String)  # e.g. 'E-7-1', 'E-7-4', 'D-10-T'
    name_ko = Column(Text, nullable=False)
    name_en = Column(Text)
    category = Column(String, nullable=False)  # 'employment', 'study', 'residence'
    is_points_based = Column(Boolean, nullable=False, default=False)
    is_top_tier = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    manual_ref = Column(Text)  # Reference to manual page
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class VisaRule(Base):
    __tablename__ = "visa_rules"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    visa_type_id = Column(UUID(as_uuid=True), nullable=False)
    eligibility = Column(JSON, nullable=False)  # Qualification requirements
    disqualifiers = Column(JSON)  # Disqualification reasons
    income_rules = Column(JSON)  # GNI multiples, minimum wage, etc.
    special_notes = Column(JSON)  # Top-tier exceptions, etc.
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

class ScoreTable(Base):
    __tablename__ = "score_tables"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    visa_type_id = Column(UUID(as_uuid=True), nullable=False)
    name = Column(Text, nullable=False)  # e.g. 'F-2-7 Standard 2025'
    total_points = Column(Integer, nullable=False)  # e.g. 300
    pass_points = Column(Integer, nullable=False)  # e.g. 80
    meta = Column(JSON)  # version, GNI reference year, etc.
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class ScoreItem(Base):
    __tablename__ = "score_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    score_table_id = Column(UUID(as_uuid=True), nullable=False)
    code = Column(String, nullable=False)  # 'AGE', 'DEGREE', 'INCOME', 'KOREAN'
    label_ko = Column(Text, nullable=False)
    label_en = Column(Text)
    weight_max = Column(Integer, nullable=False)
    config = Column(JSON, nullable=False)  # Interval-based scoring rules
    is_required = Column(Boolean, nullable=False, default=False)
    sort_order = Column(Integer, nullable=False, default=0)
