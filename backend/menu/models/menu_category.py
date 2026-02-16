from sqlmodel import Field, SQLModel, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from menu.models.menu_item import MenuItem
    from menu.models.menu_subcategory import MenuSubCategory

class MenuCategory(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None = None
    display_order: int = Field(index=True)
    
    # Relationships with cascade delete
    subcategories: list["MenuSubCategory"] = Relationship(
        back_populates="category",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    items: list["MenuItem"] = Relationship(
        back_populates="category",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )