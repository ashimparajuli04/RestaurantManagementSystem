from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database import get_session
from app.menu.models.menu_item import MenuItem
from app.menu.schemas.menu_item import MenuItemCreate, MenuItemUpdate
from app.menu.services.menuitem_service import create_menu_item, get_menuitem_by_id, update_menuitem
from app.auth.services.auth_service import require_admin

router = APIRouter(
    prefix="/admin/menu-items",
    tags=["menuitems"],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/", response_model=MenuItem)
def create_item(item: MenuItemCreate, session: SessionDep):
    return create_menu_item(session, item)
    
@router.patch(
    "/{item_id}",
    response_model=MenuItem,
    dependencies=[Depends(require_admin)]
)
def patch_item(
    item_id: int,
    data: MenuItemUpdate,
    session: SessionDep,
):
    item = get_menuitem_by_id(session, item_id)

    return update_menuitem(session=session, item=item, data=data)