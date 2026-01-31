from sqlmodel import Field, SQLModel


class MenuCategoryBase(SQLModel):
    name: str
    description: str | None = None

    class Config:
        extra = "forbid"


class MenuCategory(MenuCategoryBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class MenuCategoryCreate(MenuCategoryBase):
    pass


class MenuCategoryCreateList(SQLModel):
    items: list[MenuCategoryCreate]
