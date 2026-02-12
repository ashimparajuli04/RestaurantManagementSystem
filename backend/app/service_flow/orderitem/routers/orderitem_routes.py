from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.auth.services.auth_service import get_current_active_user
from app.database import get_session
from app.service_flow.orderitem.schemas.order_item import OrderItemCreate
from app.service_flow.orderitem.services.orderitem_services import create_order_item, delete_order_item_hard, get_order_item_by_id


SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/orders", tags=["orderitem"])

@router.post(
    "{order_id}/items",
    response_model=OrderItemCreate,
    status_code=201,
    dependencies=[Depends(get_current_active_user)]
)
def creating_order_item(order_item_in: OrderItemCreate, session: SessionDep, order_id: int):
    return create_order_item(
        session,
        order_item_in,
        order_id
    )
    
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