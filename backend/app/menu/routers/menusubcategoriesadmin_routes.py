from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.database import get_session
from app.menu.models.menu_subcategory import MenuSubCategory
from app.menu.schemas.menu_subcategory import MenuSubCategoryCreate, MenuSubCategoryUpdate
from app.menu.services.menusubcategory_service import create_subcategory, update_subcategory, get_subcategory_by_id
from app.auth.services.auth_service import require_admin

router = APIRouter(
    prefix="/admin/menu-subcategories",
    tags=["menu-subcategories"],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/", response_model=MenuSubCategory)
def create_menu_subcategory(
    data: MenuSubCategoryCreate,
    session: Session = Depends(get_session)
):
    return create_subcategory(session, data)
    
@router.patch(
    "/{subcategory_id}",
    response_model=MenuSubCategory,
    dependencies=[Depends(require_admin)]
)
def patch_category(
    subcategory_id: int,
    data: MenuSubCategoryUpdate,
    session: SessionDep,
):
    subcategory = get_subcategory_by_id(session, subcategory_id)

    return update_subcategory(session=session, subcategory=subcategory, data=data)