from sqlmodel import SQLModel

class MenuSubCategoryCreate(SQLModel):
    name: str
    category_id: int
    description: str | None = None

    class Config:
        extra = "forbid"
