from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.auth.services.auth_service import get_current_active_user
from app.customer.models.customer import Customer
from app.customer.schemas.customer import CustomerCreate, CustomerRead
from app.customer.services.customer_service import create_customer, get_customer_by_number
from app.database import get_session


SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(
    prefix="/customer",
    tags=["customer"],
)

@router.get(
    "/{number}",
    response_model=CustomerRead,
    dependencies=[Depends(get_current_active_user)]
)
def read_customer(
    number:str,
    session: SessionDep
):
    customer = get_customer_by_number(session, number)
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    return customer

@router.post(
    "/",
    response_model=Customer,
    dependencies=[Depends(get_current_active_user)]
)
def create_customer_route(
    customer: CustomerCreate,
    session: SessionDep
):
    return create_customer(session, customer)
    


