from sqlmodel import Field, SQLModel


class MenuSubCategoryBase(SQLModel):
    category_id: int
    name: str

    class Config:
        extra = "forbid"


class MenuSubCategory(MenuSubCategoryBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    category_id: int = Field(foreign_key="menucategory.id")


class MenuSubCategoryCreate(MenuSubCategoryBase):
    pass


class MenuSubCategoryCreateList(SQLModel):
    items: list[MenuSubCategoryCreate]
