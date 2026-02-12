from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.auth.services.auth_service import get_current_active_user
from app.database import get_session
from app.service_flow.order.services.order_service import delete_order_hard, get_order_by_id
from app.service_flow.orderitem.schemas.order_item import OrderItemCreate
from app.service_flow.orderitem.services.orderitem_services import create_order_item


SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/order", tags=["order"])

@router.post(
    "/{order_id}/items",
    status_code=201,
    dependencies=[Depends(get_current_active_user)]
)
def create_order_item_route(
    order_id: int,
    order_item_in: OrderItemCreate,
    session: SessionDep,
):
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
def delete_order(
    id: int,
    session: SessionDep,
):
    order = get_order_by_id(session, id)

    if not order:
        raise HTTPException(status_code=404, detail="order not found")

    delete_order_hard(session, order)