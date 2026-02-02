from sqlmodel import select, func
from app.menu.models.menu_category import MenuCategory
from app.menu.schemas.menu_category import MenuCategoryCreate

def create_category(session, data: MenuCategoryCreate):
    max_order = session.exec(
        select(func.max(MenuCategory.display_order))
    ).one()

    next_order = (max_order or 0) + 1

    category = MenuCategory(
        **data.model_dump(),
        display_order=next_order
    )

    session.add(category)
    session.commit()
    session.refresh(category)

    return category
