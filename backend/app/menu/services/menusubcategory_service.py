from sqlmodel import select, func
from app.menu.models.menu_subcategory import MenuSubCategory
from app.menu.schemas.menu_subcategory import MenuSubCategoryCreate


def create_subcategory(session, data: MenuSubCategoryCreate) -> MenuSubCategory:
    max_order = session.exec(
        select(func.max(MenuSubCategory.display_order))
        .where(MenuSubCategory.category_id == data.category_id)
    ).one()

    next_order = (max_order or 0) + 1

    subcategory = MenuSubCategory(
        **data.model_dump(),
        display_order=next_order
    )

    session.add(subcategory)
    session.commit()
    session.refresh(subcategory)

    return subcategory
