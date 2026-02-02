# user/models/user.py
from sqlmodel import SQLModel, Field
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    EMPLOYEE = "employee"
    USER = "user"

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    first_name: str
    middle_name: str | None = None
    last_name: str
    password_hash: str
    role: UserRole = Field(default=UserRole.EMPLOYEE)
    is_active: bool = True
