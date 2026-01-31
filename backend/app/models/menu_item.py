from sqlmodel import Field, SQLModel


class MenuItemBase(SQLModel):
    name: str
    price: float
    category_id: int = Field(foreign_key="menucategory.id")
    sub_category_id: int | None = Field(foreign_key="menusubcategory.id")

    class Config:
        extra = "forbid"


class MenuItem(MenuItemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    is_available: bool = True


class MenuItemCreate(MenuItemBase):
    pass


class MenuItemCreateList(SQLModel):
    items: list[MenuItemCreate]
