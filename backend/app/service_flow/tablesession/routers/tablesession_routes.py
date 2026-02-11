from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.auth.services.auth_service import get_current_active_user, require_admin
from app.database import get_session

from app.service_flow.tablesession.models.table_session import TableSession
from app.service_flow.tablesession.schemas.table_session import TableSessionCreate, TableSessionUpdate
from app.service_flow.tablesession.services.tablesession_service import create_table_session, delete_table_session_hard, get_table_session_by_id, update_table_session


SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/table-session", tags=["table-session"])

@router.post(
    "/",
    response_model=TableSessionCreate,
    status_code=201,
    dependencies=[Depends(get_current_active_user)]
)
def creating_table_session(table_in: TableSessionCreate, session: SessionDep):
    return create_table_session(
        session,
        table_in
    )
    
@router.delete(
    "/{id}",
    status_code=204,
    dependencies=[Depends(get_current_active_user)]
)
def delete_table_session(
    id: int,
    session: SessionDep,
):
    table = get_table_session_by_id(session, id)

    if not table:
        raise HTTPException(status_code=404, detail="table not found")

    delete_table_session_hard(session, table)
    
@router.patch(
    "/{table_session_id}",
    response_model=TableSession,
    dependencies=[Depends(get_current_active_user)]
)
def patch_category(
    table_session_id: int,
    data: TableSessionUpdate,
    session: SessionDep,
):
    tablesession = get_table_session_by_id(session, table_session_id)

    return update_table_session(session=session, tablesession=tablesession, data=data) # type: ignore