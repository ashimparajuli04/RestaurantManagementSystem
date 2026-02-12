from sqlmodel import SQLModel, Field

class OrderItemCreate(SQLModel):
    menu_item_id: int
    quantity: int = Field(default=1, gt=0)
    note: str | None = None
    
class OrderItemRead(SQLModel):
    id: int
    menu_item_id: int
    quantity: int
    price_at_time: float
    note: str | None
    line_total: float
