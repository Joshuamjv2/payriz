from pydantic import BaseModel, EmailStr, constr
from datetime import datetime


class User(BaseModel):
    first_name: str
    last_name: str
    password: constr(min_length=8)
    phone_number: str = None
    is_owner: bool = True
    is_active: bool = False
    is_verified: bool = False
    position: str = None
    email: EmailStr
    created: datetime = datetime.utcnow()

class UpdateUser(BaseModel):
    first_name: str = None
    last_name: str = None
    position: str = None
    confirm_password: str = None
    updated: datetime = datetime.utcnow()

class Invite(BaseModel):
    email: EmailStr
    first_name: str = None
    last_name: str = None
    position: str = None



class ChangePassword(BaseModel):
    old_password: str
    password: constr(min_length=8)
    password2: str