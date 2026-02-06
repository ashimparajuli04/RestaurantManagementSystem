from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database import get_session
from app.menu.models.menu_category import MenuCategory
from app.menu.schemas.menu_category import MenuCategoryCreate, MenuCategoryUpdate
from app.menu.services.menucategory_service import create_category, get_category_by_id, update_category
from app.auth.services.auth_service import require_admin

router = APIRouter(
    prefix="/admin/menu-categories",
    tags=["menu-categories"],
)

SessionDep = Annotated[Session, Depends(get_session)]

@router.post("/",
    response_model=MenuCategory,
    dependencies=[Depends(require_admin)]
)
def create_menu_category(
    data: MenuCategoryCreate,
    session: Session = Depends(get_session)
):
    return create_category(session, data)

@router.patch(
    "/{category_id}",
    response_model=MenuCategory,
    dependencies=[Depends(require_admin)]
)
def patch_category(
    category_id: int,
    data: MenuCategoryUpdate,
    session: SessionDep,
):
    category = get_category_by_id(session, category_id)

    return update_category(session=session, category=category, data=data)