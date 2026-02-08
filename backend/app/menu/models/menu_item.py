from sqlmodel import Field, SQLModel, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .menu_category import MenuCategory
    from .menu_subcategory import MenuSubCategory

class MenuItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    price: float
    category_id: int = Field(foreign_key="menucategory.id")
    description: str | None = None
    sub_category_id: int | None = Field(
        default=None,
        foreign_key="menusubcategory.id"
    )
    is_available: bool = True
    display_order: int = Field(index=True)
    
    # Relationships
    category: "MenuCategory" = Relationship(
        back_populates="items"
    )
    subcategory: "MenuSubCategory" = Relationship(
        back_populates="items"
    )