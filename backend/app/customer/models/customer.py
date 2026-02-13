from sqlmodel import Field, Relationship, SQLModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.service_flow.tablesession.models.table_session import TableSession


class Customer(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)
    phone_number: str = Field(max_length=20, unique=True, index=True)
    
    # sessions: list["TableSession"] = Relationship(
    #     back_populates="customer"
    # )