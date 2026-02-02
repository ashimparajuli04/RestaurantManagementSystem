from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.menu.models.menu_category import MenuCategory
from app.menu.schemas.menu_category import MenuCategoryCreate
from app.menu.services.menucategory_service import create_category

router = APIRouter(
    prefix="/menu-categories",
    tags=["menu-categories"],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/", response_model=MenuCategory)
def create_menu_category(
    data: MenuCategoryCreate,
    session: Session = Depends(get_session)
):
    return create_category(session, data)

@router.get("/", response_model=list[MenuCategory])
def read_menu_categories(session: SessionDep):
    return session.exec(
        select(MenuCategory)
        .order_by(MenuCategory.display_order)  # pyright: ignore
    ).all()