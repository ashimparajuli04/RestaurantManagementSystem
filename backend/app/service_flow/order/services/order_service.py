from fastapi import HTTPException
from sqlalchemy.util import OrderedDict
from sqlmodel import Session, select

from app.service_flow.order.models.order import Order
from app.service_flow.order.schemas.order import OrderUpdate
from app.service_flow.tablesession.models.table_session import TableSession

def get_order_by_id(session: Session, id: int):
    return session.exec(
        select(Order).where(Order.id == id)
    ).first()

def create_order(table_session_id: int, session: Session) -> Order:
    tablesession = session.get(TableSession, table_session_id)
    if not tablesession:
            raise HTTPException(status_code=404, detail="table session not found")
    
    # 3. create user
    order = Order(
        session_id=table_session_id
    )

    session.add(order)
    session.commit()
    session.refresh(order)
    return order
    
def delete_order_hard(session: Session, order: Order):
    session.delete(order)
    session.commit()
    
def update_order(
    *,
    session: Session,
    order: Order,
    data: OrderUpdate
) -> Order:
    data_dict = data.model_dump(exclude_unset=True)

    for key, value in data_dict.items():
        setattr(order, key, value)

    session.add(order)
    session.commit()
    session.refresh(order)
    return order