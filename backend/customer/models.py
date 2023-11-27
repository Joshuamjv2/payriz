from pydantic import BaseModel, EmailStr
from datetime import datetime


class Customer(BaseModel):
    name: str
    email: EmailStr
    phone: str
    address: str = None
    created: datetime = datetime.utcnow()


class UpdateCustomer(BaseModel):
    name: str = None
    phone: str = None
    address: str = None
    updated: datetime = datetime.utcnow()

