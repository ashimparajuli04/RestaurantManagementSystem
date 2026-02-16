# menu/schemas/menu_category.py
from sqlmodel import SQLModel

class MenuCategoryCreate(SQLModel):
    name: str
    description: str | None = None

    class Config:
        extra = "forbid"


class MenuCategoryUpdate(SQLModel):
    name: str | None = None
    description: str | None = None
    

