from sqlmodel import SQLModel
from datetime import datetime

class DiningTableCreate(SQLModel):
    number: int

class DiningTableRead(SQLModel):
    id: int
    number: int
    is_occupied: bool
    active_session_id: int | None
    customer_name: str | None  
    customer_arrival: datetime | None
