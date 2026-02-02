from sqlmodel import Field, SQLModel


class MenuSubCategory(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    category_id: int = Field(foreign_key="menucategory.id")
    description: str | None = None
    display_order: int = Field(index=True)
