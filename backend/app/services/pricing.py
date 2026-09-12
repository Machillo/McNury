from math import ceil

from app.schemas.pricing import PriceRecommendation, PriceRecommendationRequest


def _round_up(value: float, step: int = 100) -> int:
    return int(ceil(value / step) * step)


def recommend_price(data: PriceRecommendationRequest) -> PriceRecommendation:
    base_cost = (
        data.ingredient_cost_crc
        + data.packaging_cost_crc
        + data.labor_cost_crc
        + data.allocated_overhead_crc
    )
    cost_with_waste = base_cost * (1 + data.waste_percentage)
    recommended = cost_with_waste / (1 - data.target_margin)

    current_margin = None
    warning = None
    if data.current_price_crc:
        current_margin = (data.current_price_crc - cost_with_waste) / data.current_price_crc
        if data.current_price_crc < cost_with_waste:
            warning = "El precio actual está por debajo del costo estimado."
        elif current_margin < data.target_margin:
            warning = "El margen actual es menor al objetivo configurado."

    return PriceRecommendation(
        base_cost_crc=round(base_cost),
        cost_with_waste_crc=round(cost_with_waste),
        break_even_price_crc=_round_up(cost_with_waste),
        recommended_price_crc=_round_up(recommended),
        current_margin=current_margin,
        warning=warning,
    )
