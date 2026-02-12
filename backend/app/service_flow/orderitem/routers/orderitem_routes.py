from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.auth.services.auth_service import get_current_active_user
from app.database import get_session
from app.service_flow.orderitem.services.orderitem_services import delete_order_item_hard, get_order_item_by_id


SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/orderitem", tags=["order-items"])
    
@router.delete(
    "/{id}",
    status_code=204,
    dependencies=[Depends(get_current_active_user)]
)
def delete_order_item(
    id: int,
    session: SessionDep,
):
    orderitem = get_order_item_by_id(session, id)

    if not orderitem:
        raise HTTPException(status_code=404, detail="order item not found")

    delete_order_item_hard(session, orderitem)