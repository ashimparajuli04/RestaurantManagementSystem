from sqlmodel import select, func
from fastapi import HTTPException

from app.menu.models.menu_item import MenuItem
from app.menu.schemas.menu_item import MenuItemCreate
from app.menu.models.menu_subcategory import MenuSubCategory


def create_menu_item(session, data: MenuItemCreate) -> MenuItem:
    # 1️⃣ Validate subcategory exists
    subcategory = session.get(MenuSubCategory, data.sub_category_id)
    if not subcategory:
        raise HTTPException(status_code=400, detail="Invalid subcategory")

    # 2️⃣ Ensure category ↔ subcategory match
    if subcategory.category_id != data.category_id:
        raise HTTPException(
            status_code=400,
            detail="Subcategory does not belong to category"
        )

    # 3️⃣ Get max display_order INSIDE this subcategory
    max_order = session.exec(
        select(func.max(MenuItem.display_order))
        .where(MenuItem.sub_category_id == data.sub_category_id)
    ).one()

    next_order = (max_order or 0) + 1

    # 4️⃣ Create item
    menu_item = MenuItem(
        **data.model_dump(),
        display_order=next_order
    )

    session.add(menu_item)
    session.commit()
    session.refresh(menu_item)

    return menu_item
