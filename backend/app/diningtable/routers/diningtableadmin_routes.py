from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.auth.services.auth_service import require_admin
from app.database import get_session

from app.diningtable.schemas.dining_table import DiningTableCreate
from app.tablesession.models.table_session import TableSession

from app.diningtable.services.diningtable_service import create_table, get_table_by_number


SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/admin/tables", tags=["tables"])

@router.post(
    "/add-table",
    response_model=DiningTableCreate,
    status_code=201,
    dependencies=[Depends(require_admin)]
)
def signup(table_in: DiningTableCreate, session: SessionDep):
    if get_table_by_number(session, table_in.number):
        raise HTTPException(
            status_code=400,
            detail="table already exists"
        )

    return create_table(
        session,
        table_in
    )