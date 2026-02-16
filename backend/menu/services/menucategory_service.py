from sqlmodel import select, func, Session
from fastapi import HTTPException

from menu.models.menu_category import MenuCategory
from menu.schemas.menu_category import MenuCategoryCreate, MenuCategoryUpdate

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
    
def get_category_by_id(session: Session, category_id: int) -> MenuCategory:
    category = session.get(MenuCategory, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

def update_category(
    *,
    session: Session,
    category: MenuCategory,
    data: MenuCategoryUpdate
) -> MenuCategory:
    data_dict = data.model_dump(exclude_unset=True)

    for key, value in data_dict.items():
        setattr(category, key, value)

    session.add(category)
    session.commit()
    session.refresh(category)
    return category
    
def delete_menu_category_hard(session: Session, category: MenuCategory):
    session.delete(category)
    session.commit()