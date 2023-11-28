from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List
from enum import Enum

class Status(str, Enum):
    paid = "paid"
    pending = "pending"
    failed = "failed"
    overdue = "overdue"


class InvoiceItem(BaseModel):
    name: str
    unit_cost: float
    quantity: int
    description: str = None


class To(BaseModel):
    customer_id: str
    name: str
    email: EmailStr


class From(BaseModel):
    owner_id: str
    name: str
    business_name: str

class Invoice(BaseModel):
    status: Status
    customer: To
    invoice_number: str
    owner: From
    due_date: str
    invoice_date: str
    items: List[InvoiceItem]
    currency: str = "NGN"
    tax: int = 0
    redirect_url: str
    wallet: str = None
    created: datetime = datetime.utcnow()



class UpdateInvoice(BaseModel):
    paid: Status
    paid_at: datetime = None
