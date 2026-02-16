from datetime import datetime
from sqlmodel import Field, SQLModel

class CustomerRead(SQLModel):
    id: int
    name: str
    phone_number: str
    customer_since: datetime
    visit_count: int
    
class CustomerCreate(SQLModel):
    name: str
    phone_number: str = Field(max_length=20)

class CustomerInfo(CustomerRead):
    total_spent: float
    