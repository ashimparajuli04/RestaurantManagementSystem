from sqlmodel import SQLModel

class TableSessionCreate(SQLModel):
    table_id: int
    
class TableSessionUpdate(SQLModel):
    customer_name: str | None = None