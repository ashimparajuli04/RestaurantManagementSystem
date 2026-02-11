from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.auth.services.auth_service import get_current_active_user
from app.database import get_session
from app.service_flow.order.schemas.order import OrderCreate
from app.service_flow.order.services.order_service import create_order, delete_order_hard, get_order_by_id


SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/order", tags=["order"])

@router.post(
    "/",
    response_model=OrderCreate,
    status_code=201,
    dependencies=[Depends(get_current_active_user)]
)
def creating_order(order_in: OrderCreate, session: SessionDep):
    return create_order(
        session,
        order_in
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