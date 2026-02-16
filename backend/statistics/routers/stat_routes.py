from datetime import datetime, timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlmodel import Session, select, col
from auth.services.auth_service import get_current_active_user
from database import get_session
from service_flow.tablesession.models.table_session import TableSession

SessionDep = Annotated[Session, Depends(get_session)]
router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get(
    "/revenue/weekly",
    dependencies=[Depends(get_current_active_user)]
)
def get_weekly_revenue(
    session: SessionDep,
    start_date: str = Query(..., description="Start date in YYYY-MM-DD format"),
    end_date: str = Query(..., description="End date in YYYY-MM-DD format")
):
    """
    Get daily revenue for a date range (typically a week).
    Returns total revenue for each day.
    """
    # Parse dates
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        # Include the entire end date
        end = end + timedelta(days=1)
    except ValueError:
        return {"error": "Invalid date format. Use YYYY-MM-DD"}
    
    # Query for closed sessions within date range, grouped by day
    statement = (
        select(
            func.date(TableSession.ended_at).label('date'),
            func.sum(TableSession.final_bill).label('revenue')
        )
        .where(
            col(TableSession.ended_at).is_not(None),  # Only closed sessions
            TableSession.ended_at >= start,
            TableSession.ended_at < end
        )
        .group_by(func.date(TableSession.ended_at))
        .order_by(func.date(TableSession.ended_at))
    )
    
    results = session.exec(statement).all()
    
    # Format response
    daily_revenue = [
        {
            "date": str(result.date),
            "revenue": float(result.revenue) if result.revenue else 0.0
        }
        for result in results
    ]
    
    # Calculate total for the period
    total_revenue = sum(item["revenue"] for item in daily_revenue)
    
    return {
        "start_date": start_date,
        "end_date": end_date,
        "daily_revenue": daily_revenue,
        "total_revenue": total_revenue,
        "days_count": len(daily_revenue)
    }