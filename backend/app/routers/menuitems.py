from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models.menu_item import MenuItemCreate, MenuItem

router = APIRouter(
    prefix = "/menu-items",
    tags = ["menuitems"],
)

SessionDep = Annotated[Session, Depends(get_session)]

@router.post("/", response_model=MenuItem)
def create_item(item: MenuItemCreate, session: SessionDep):
    db_item = MenuItem.model_validate(item)

    session.add(db_item)
    session.commit()
    session.refresh(db_item)

    return db_item 



@router.get("/")
def read_menuitems(session: SessionDep) -> list[MenuItem]:
    return session.exec(select(MenuItem)).all()

@router.post("/bulk", response_model=list[MenuItem])
def create_items_bulk(items: list[MenuItemCreate], session: SessionDep):
    db_items = [MenuItem.model_validate(item) for item in items]
    
    session.add_all(db_items)  # add all at once
    session.commit()
    
    for item in db_items:
        session.refresh(item)
    
    return db_items
