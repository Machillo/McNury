from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class OrderStatus(StrEnum):
    NEW = "new"
    PREPARING = "preparing"
    READY = "ready"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PaymentMethod(StrEnum):
    CASH_AT_PICKUP = "cash_at_pickup"
    SINPE_AT_PICKUP = "sinpe_at_pickup"
    CARD_IN_APP = "card_in_app"


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, le=20)
    selected_options: list[str] = Field(default_factory=list)
    notes: str = Field(default="", max_length=180)


class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=8, max_length=20)
    pickup_time: str = Field(max_length=40)
    payment_method: PaymentMethod
    source: str = Field(default="app", pattern="^(app|local|whatsapp|phone)$")
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderRead(OrderCreate):
    id: int
    status: OrderStatus
    payment_status: str
    total_crc: int
    created_at: datetime


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
