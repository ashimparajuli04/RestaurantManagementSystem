from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.menu.models.menu_item import MenuItem
from app.menu.schemas.menu_item import MenuItemCreate
from app.menu.services.menuitem_service import create_menu_item

router = APIRouter(
    prefix="/menu-items",
    tags=["menuitems"],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/", response_model=MenuItem)
def create_item(item: MenuItemCreate, session: SessionDep):
    return create_menu_item(session, item)

@router.get("/", response_model=list[MenuItem])
def read_menuitems(session: SessionDep):
    return session.exec(
        select(MenuItem).order_by(MenuItem.display_order) # type: ignore
    ).all()

