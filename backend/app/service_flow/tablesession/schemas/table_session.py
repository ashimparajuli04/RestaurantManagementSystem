from sqlmodel import SQLModel
from app.service_flow.order.schemas.order import OrderRead

class TableSessionCreate(SQLModel):
    table_id: int
    
class TableSessionUpdate(SQLModel):
    customer_name: str | None = None
    
class TableSessionRead(SQLModel):
    id: int
    table_id: int
    customer_name: str | None
    total_bill: float
    orders: list[OrderRead] = []
    
