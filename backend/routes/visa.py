from fastapi import APIRouter, HTTPException
from schemas.visa_schemas import (
    UserProfile, 
    RecommendationResponse, 
    VisaRecommendation,
    ScoreCalculationRequest,
    ScoreCalculationResponse
)
from services.visa_recommender import VisaRecommender

router = APIRouter()

@router.post("/recommend", response_model=RecommendationResponse)
async def recommend_visa(profile: UserProfile):
    """
    Recommend suitable visas based on user profile.
    
    - **nationality**: User's nationality
    - **age**: User's age
    - **purpose**: employment, study, residence, top_tier
    - **degree_level**: bachelor, master, doctor
    - **annual_income_krw**: Annual income in KRW
    - **korean_level**: TOPIK level (0-6)
    """
    try:
        recommender = VisaRecommender()
        recommendations_data = recommender.recommend_visa(profile.dict())
        
        # Convert to Pydantic models
        recommendations = [VisaRecommendation(**rec) for rec in recommendations_data]
        
        return RecommendationResponse(recommendations=recommendations)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate-score", response_model=ScoreCalculationResponse)
async def calculate_score(request: ScoreCalculationRequest):
    """
    Calculate points for point-based visas (F-2-7, E-7-4, etc.)
    """
    try:
        recommender = VisaRecommender()
        
        if request.visa_code == 'F-2-7':
            score = recommender._calculate_f27_score(request.profile.dict())
            return ScoreCalculationResponse(
                total_score=score,
                pass_score=80,
                passed=score >= 80,
                breakdown={
                    'age': 'Calculated based on age bracket',
                    'education': 'Calculated based on degree level',
                    'income': 'Calculated based on GNI ratio',
                    'korean': 'Calculated based on TOPIK level'
                }
            )
        else:
            raise HTTPException(status_code=400, detail=f"Score calculation not available for {request.visa_code}")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
