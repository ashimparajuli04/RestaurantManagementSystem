from sqlmodel import SQLModel
from pydantic import EmailStr
from app.user.models.user import UserRole

class UserCreate(SQLModel):
    email: EmailStr
    first_name: str
    middle_name: str | None = None
    last_name: str
    password: str

class UserPublic(SQLModel):
    id: int
    email: str
    first_name: str
    middle_name: str | None = None
    last_name: str
    role: UserRole

class UserAdmin(UserPublic):
    is_active: bool
    
class UserUpdate(SQLModel):
    first_name: str | None = None
    middle_name: str | None = None
    last_name: str | None = None
    role: UserRole | None = None
    is_active: bool | None = None