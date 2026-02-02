# menu/schemas/menu_category.py
from sqlmodel import SQLModel

class MenuCategoryCreate(SQLModel):
    name: str
    description: str | None = None

    class Config:
        extra = "forbid"


class MenuCategoryPublic(SQLModel):
    id: int
    name: str
    description: str | None = None
    display_order: int
