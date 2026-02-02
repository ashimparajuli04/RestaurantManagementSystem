from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.menu.models.menu_subcategory import MenuSubCategory
from app.menu.schemas.menu_subcategory import MenuSubCategoryCreate
from app.menu.services.menusubcategory_service import create_subcategory

router = APIRouter(
    prefix="/menu-subcategories",
    tags=["menu-subcategories"],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/", response_model=MenuSubCategory)
def create_menu_subcategory(
    data: MenuSubCategoryCreate,
    session: Session = Depends(get_session)
):
    return create_subcategory(session, data)
    
@router.get("/", response_model=list[MenuSubCategory])
def read_menu_subcategories(session: SessionDep):
    return session.exec(
        select(MenuSubCategory)
        .order_by(
            MenuSubCategory.category_id,       # type: ignore lolol
            MenuSubCategory.display_order,     # type: ignore 
        )  # pyright: ignore
    ).all()