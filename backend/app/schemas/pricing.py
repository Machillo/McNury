from pydantic import BaseModel, Field


class PriceRecommendationRequest(BaseModel):
    ingredient_cost_crc: float = Field(ge=0)
    packaging_cost_crc: float = Field(default=0, ge=0)
    labor_cost_crc: float = Field(default=0, ge=0)
    allocated_overhead_crc: float = Field(default=0, ge=0)
    waste_percentage: float = Field(default=0.05, ge=0, le=0.5)
    target_margin: float = Field(default=0.35, gt=0, lt=1)
    current_price_crc: float | None = Field(default=None, ge=0)


class PriceRecommendation(BaseModel):
    base_cost_crc: int
    cost_with_waste_crc: int
    break_even_price_crc: int
    recommended_price_crc: int
    current_margin: float | None
    warning: str | None
