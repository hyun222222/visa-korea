from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# User Profile Input
class UserProfile(BaseModel):
    nationality: str
    age: int
    purpose: str  # 'employment', 'study', 'residence', 'top_tier'
    degree_level: Optional[str] = None  # 'bachelor', 'master', 'doctor'
    major_field: Optional[str] = None
    annual_income_krw: Optional[int] = None
    korean_level: Optional[int] = 0  # 0-6
    career_years: Optional[int] = 0
    is_in_top_tier_field: Optional[bool] = False

# Visa Recommendation Response
class VisaRecommendation(BaseModel):
    visa_code: str
    visa_name: str
    probability: str  # 'high', 'medium', 'low'
    reasons: List[str]
    missing_requirements: List[str]
    score: Optional[int] = None

class RecommendationResponse(BaseModel):
    recommendations: List[VisaRecommendation]

# Score Calculation Request
class ScoreCalculationRequest(BaseModel):
    visa_code: str
    profile: UserProfile

class ScoreCalculationResponse(BaseModel):
    total_score: int
    pass_score: int
    passed: bool
    breakdown: Dict[str, Any]

# Application schemas  
class ApplicationCreate(BaseModel):
    visa_type_id: str
    profile_data: Dict[str, Any]

class ApplicationResponse(BaseModel):
    id: str
    user_id: Optional[str]
    visa_type_id: str
    status: str
    profile_data: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True
