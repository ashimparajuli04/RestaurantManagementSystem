from sqlmodel import SQLModel

class MenuSubCategoryCreate(SQLModel):
    name: str
    category_id: int
    description: str | None = None

    class Config:
        extra = "forbid"

class MenuSubCategoryUpdate(SQLModel):
    name: str | None = None
    category_id: int | None = None
    description: str | None = None