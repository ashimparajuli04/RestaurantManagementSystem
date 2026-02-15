from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.database import get_session

from app.user.schemas.user import UserAdmin, UserUpdate
from app.user.services.user_service import get_users, get_user_by_id, update_user, delete_user_hard
from app.auth.services.auth_service import get_current_active_user, require_admin

router = APIRouter(prefix="/admin/users", tags=["users"])

SessionDep = Annotated[Session, Depends(get_session)]

@router.get(
    "",
    response_model=list[UserAdmin],
    dependencies=[Depends(get_current_active_user)]
)
def read_users(session: SessionDep):
    return get_users(session)

@router.patch(
    "/{user_id}",
    response_model=UserAdmin,
    dependencies=[Depends(require_admin)]
)
def patch_user(
    user_id: int,
    data: UserUpdate,
    session: SessionDep,
):
    user = get_user_by_id(session, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return update_user(session=session, user=user, data=data)
    
@router.delete(
    "/{user_id}",
    status_code=204,
    dependencies=[Depends(require_admin)]
)
def delete_user(
    user_id: int,
    session: SessionDep,
):
    user = get_user_by_id(session, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    delete_user_hard(session, user)



