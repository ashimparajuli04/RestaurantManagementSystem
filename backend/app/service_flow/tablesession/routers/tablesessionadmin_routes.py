from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.auth.services.auth_service import require_admin
from app.database import get_session

from app.service_flow.tablesession.services.tablesession_service import  delete_table_session_hard, get_table_session_by_id


SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/admin/table-session", tags=["table-session"])

