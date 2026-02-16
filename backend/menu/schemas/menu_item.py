# schemas/menu_item.py
from sqlmodel import SQLModel

class MenuItemCreate(SQLModel):
    name: str
    price: float
    category_id: int
    sub_category_id: int | None = None
    description: str | None = None

    class Config:
        extra = "forbid"

class MenuItemUpdate(SQLModel):
    name: str | None = None
    price: float | None = None
    category_id: int | None = None
    sub_category_id: int | None = None
    description: str | None = None