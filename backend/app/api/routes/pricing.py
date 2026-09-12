from fastapi import APIRouter

from app.schemas.pricing import PriceRecommendation, PriceRecommendationRequest
from app.services.pricing import recommend_price

router = APIRouter(prefix="/pricing", tags=["pricing"])


@router.post("/recommend", response_model=PriceRecommendation)
def calculate_recommended_price(data: PriceRecommendationRequest) -> PriceRecommendation:
    return recommend_price(data)
