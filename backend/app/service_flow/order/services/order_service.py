from fastapi import HTTPException
from sqlmodel import Session, select

from app.service_flow.order.models.order import Order
from app.service_flow.tablesession.models.table_session import TableSession
from app.service_flow.order.schemas.order import OrderCreate

def get_order_by_id(session: Session, id: int):
    return session.exec(
        select(Order).where(Order.id == id)
    ).first()

def create_order(session: Session, data: OrderCreate) -> Order:
    tablesession = session.get(TableSession, data.session_id)
    if not tablesession:
            raise HTTPException(status_code=404, detail="table session not found")
    
    # 3. create user
    order = Order(
        session_id=data.session_id,
    )

    session.add(order)
    session.commit()
    session.refresh(order)
    return order
    
def delete_order_hard(session: Session, order: Order):
    session.delete(order)
    session.commit()