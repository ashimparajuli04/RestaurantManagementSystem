from sqlmodel import Field, SQLModel


class MenuCategory(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None = None
    display_order: int = Field(index=True)