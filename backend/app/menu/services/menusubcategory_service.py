from sqlmodel import select, func, Session
from fastapi import HTTPException
from app.menu.models.menu_subcategory import MenuSubCategory
from app.menu.schemas.menu_subcategory import MenuSubCategoryCreate, MenuSubCategoryUpdate


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

def get_subcategory_by_id(session: Session, subcategory_id: int) -> MenuSubCategory:
    subcategory = session.get(MenuSubCategory, subcategory_id)
    if not subcategory:
        raise HTTPException(status_code=404, detail="Sub Category not found")
    return subcategory
    
def update_subcategory(
    *,
    session: Session,
    subcategory: MenuSubCategory,
    data: MenuSubCategoryUpdate
) -> MenuSubCategory:
    data_dict = data.model_dump(exclude_unset=True)

    for key, value in data_dict.items():
        setattr(subcategory, key, value)

    session.add(subcategory)
    session.commit()
    session.refresh(subcategory)
    return subcategory