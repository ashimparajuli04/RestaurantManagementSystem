from sqlmodel import SQLModel

class OrderCreate(SQLModel):
    session_id: int