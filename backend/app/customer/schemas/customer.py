from sqlmodel import Field, SQLModel

class CustomerRead(SQLModel):
    id: int
    name: str
    
class CustomerCreate(SQLModel):
    name: str
    phone_number: str = Field(max_length=20)
    
    