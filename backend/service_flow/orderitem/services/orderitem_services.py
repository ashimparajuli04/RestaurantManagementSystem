from sqlmodel import Session, select
from fastapi import HTTPException

from menu.models.menu_item import MenuItem
from service_flow.order.models.order import Order
from service_flow.orderitem.models.order_item import OrderItem
from service_flow.orderitem.schemas.order_item import OrderItemCreate


def get_order_item_by_id(session: Session, id: int):
    return session.exec(
        select(OrderItem).where(OrderItem.id == id)
    ).first()

def create_order_item(session: Session, data: OrderItemCreate, order_id: int) -> OrderItem:
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="order not found")
        
    menu_item = session.get(MenuItem, data.menu_item_id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="menu item not found")
    
    # Check if this menu item already exists in the order
    existing_item = session.exec(
        select(OrderItem).where(
            OrderItem.order_id == order_id,
            OrderItem.menu_item_id == data.menu_item_id,
            OrderItem.note == data.note
        )
    ).first()

    if existing_item:
        existing_item.quantity += data.quantity
        session.add(existing_item)
        session.commit()
        session.refresh(existing_item)
        return existing_item

    # No existing item — create a new row
    order_item = OrderItem(
        **data.model_dump(exclude={"price_at_time"}),
        order_id=order_id,
        price_at_time=menu_item.price
    )
    session.add(order_item)
    session.commit()
    session.refresh(order_item)
    return order_item
    
def delete_order_item_hard(session: Session, orderitem: OrderItem):
    session.delete(orderitem)
    session.commit()