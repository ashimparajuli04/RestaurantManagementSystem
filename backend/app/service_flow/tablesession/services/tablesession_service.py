from fastapi import HTTPException
from sqlmodel import Session, select

from app.service_flow.diningtable.models.dining_table import DiningTable
from app.service_flow.tablesession.models.table_session import TableSession
from app.service_flow.tablesession.schemas.table_session import TableSessionCreate

def get_table_session_by_id(session: Session, id: int):
    return session.exec(
        select(TableSession).where(TableSession.id == id)
    ).first()

def create_table_session(session: Session, data: TableSessionCreate) -> TableSession:
    diningtable = session.get(DiningTable, data.table_id)
    if not diningtable:
            raise HTTPException(status_code=404, detail="Dining table not found")
    
    # 2. Enforce business rule
    if diningtable.is_occupied:
        raise HTTPException(
            status_code=400,
            detail="Dining table is already occupied"
        )
    # 3. create user
    tablesession = TableSession(
        table_id=data.table_id,
        customer_name=data.customer_name,
    )

    session.add(tablesession)
    session.commit()
    session.refresh(tablesession)
    return tablesession
    
def delete_table_session_hard(session: Session, table: TableSession):
    session.delete(table)
    session.commit()