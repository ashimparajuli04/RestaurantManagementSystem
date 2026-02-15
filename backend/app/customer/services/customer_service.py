from fastapi import HTTPException
from sqlmodel import Session, select

from app.customer.models.customer import Customer
from app.customer.schemas.customer import CustomerCreate


def get_customer_by_number(session: Session, number: str):
    return session.exec(
        select(Customer).where(Customer.phone_number == number)
    ).first()
    
def get_customer_by_id(session: Session, id: int):
    return session.exec(
        select(Customer).where(Customer.id == id)
    ).first()
    
def create_customer(session: Session, data: CustomerCreate) -> Customer:
    if get_customer_by_number(session, data.phone_number):
        raise HTTPException(
            status_code=400,
            detail="customer already exists"
        )

    # 3. create user
    customer = Customer(
        **data.model_dump()
    )

    session.add(customer)
    session.commit()
    session.refresh(customer)
    return customer