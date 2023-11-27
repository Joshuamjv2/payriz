from enum import Enum
from datetime import datetime
from pydantic import BaseModel, EmailStr, constr, Field
from typing import Union, Set, List

class Login(BaseModel):
    email: EmailStr
    password: str

class TokenData(BaseModel):
    username: str

class ResetPasswordRequest(BaseModel):
    username: EmailStr

class ResetPassword(BaseModel):
    password: constr(min_length=8)
    password2: str

class Token(BaseModel):
    access_token: str
    refresh_token: str


class ExpiredToken(BaseModel):
    user: str
    added: Union[datetime, None] = Field(default=datetime.utcnow())
    exp: datetime
    jti: str
