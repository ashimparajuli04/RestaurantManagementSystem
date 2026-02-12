from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload


from app.auth.services.auth_service import get_current_active_user
from app.database import get_session

from app.service_flow.diningtable.schemas.dining_table import DiningTableRead
from app.service_flow.diningtable.models.dining_table import DiningTable



SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/tables", tags=["tables"])

@router.get(
    "/",
    response_model=list[DiningTableRead],
    dependencies=[Depends(get_current_active_user)]
)
def get_tables(session: SessionDep):
    tables = session.exec(
        select(DiningTable)
        .options(selectinload(DiningTable.sessions))  # type:ignore
        .order_by(DiningTable.number) # type:ignore
    ).all()
    result = []
    for t in tables:
        s = t.active_session
        result.append(
            DiningTableRead(
                id=t.id,  # type: ignore
                number=t.number,
                is_occupied=s is not None,
                active_session_id=s.id if s else None,
                customer_name=s.customer_name if s else None,
                customer_arrival=s.started_at if s else None,
            )
        )
    return result
