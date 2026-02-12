from sqlmodel import Session, select
from fastapi import HTTPException

from app.menu.models.menu_item import MenuItem
from app.service_flow.order.models.order import Order
from app.service_flow.orderitem.models.order_item import OrderItem
from app.service_flow.orderitem.schemas.order_item import OrderItemCreate


def get_order_item_by_id(session: Session, id: int):
    return session.exec(
        select(OrderItem).where(OrderItem.id == id)
    ).first()

def create_order_item(session: Session, data: OrderItemCreate, order_id: int) -> OrderItem:
    order = session.get(Order, order_id)
    if not order:
            raise HTTPException(status_code=404, detail="order  not found")
            
    menu_item = session.get(MenuItem, data.menu_item_id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="menu item not found")
    
    # 3. create user
    orderitem = OrderItem(
        **data.model_dump(exclude={"price_at_time"}),
        order_id=order_id,
        price_at_time = menu_item.price
    )

    session.add(orderitem)
    session.commit()
    session.refresh(orderitem)
    return orderitem
    
def delete_order_item_hard(session: Session, orderitem: OrderItem):
    session.delete(orderitem)
    session.commit()