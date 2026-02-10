from sqlmodel import select, Session

from app.diningtable.models.dining_table import DiningTable
from app.diningtable.schemas.dining_table import DiningTableCreate


def get_table_by_number(session: Session, number: int):
    return session.exec(
        select(DiningTable).where(DiningTable.number == number)
    ).first()
    
def create_table(session: Session, data: DiningTableCreate) -> DiningTable:

    # 3. create user
    table = DiningTable(
        number=data.number,
    )

    session.add(table)
    session.refresh(table)
    return table