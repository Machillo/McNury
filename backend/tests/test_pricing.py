from app.schemas.pricing import PriceRecommendationRequest
from app.services.pricing import recommend_price


def test_recommended_price_uses_margin_formula() -> None:
    result = recommend_price(
        PriceRecommendationRequest(
            ingredient_cost_crc=1000,
            packaging_cost_crc=100,
            labor_cost_crc=100,
            allocated_overhead_crc=25,
            waste_percentage=0,
            target_margin=0.35,
            current_price_crc=1500,
        )
    )

    assert result.base_cost_crc == 1225
    assert result.recommended_price_crc == 1900
    assert result.warning is not None
