from datetime import datetime
from sqlmodel import SQLModel
from service_flow.order.models.order import OrderStatus
from service_flow.orderitem.schemas.order_item import OrderItemRead

class OrderCreate(SQLModel):
    session_id: int
    
class OrderRead(SQLModel):
    id: int
    session_id: int
    items: list[OrderItemRead] = []
    total_amount: float
    created_at: datetime
    status: OrderStatus
    served_at: datetime | None
    
class OrderUpdate(SQLModel):
    status: OrderStatus
