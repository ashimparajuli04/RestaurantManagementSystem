from sqlmodel import SQLModel

class TableSessionCreate(SQLModel):
    table_id: int
    customer_name: str | None = None