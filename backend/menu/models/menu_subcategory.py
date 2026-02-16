from sqlmodel import Field, SQLModel, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .menu_category import MenuCategory
    from .menu_item import MenuItem

class MenuSubCategory(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    category_id: int = Field(foreign_key="menucategory.id")
    description: str | None = None
    display_order: int = Field(index=True)
    
    # Relationships
    category: "MenuCategory" = Relationship(
        back_populates="subcategories"
    )
    
    items: list["MenuItem"] = Relationship(
        back_populates="subcategory",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )