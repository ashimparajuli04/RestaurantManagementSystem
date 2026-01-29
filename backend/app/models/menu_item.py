from sqlmodel import SQLModel, Field
from typing import List

class MenuItemBase(SQLModel):
    name: str
    price: float
    category: str
    sub_category: str | None = None
    class Config:
        extra = "forbid"

class MenuItem(MenuItemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    is_available: bool = True

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemCreateList(SQLModel):
    items: list[MenuItemCreate]
