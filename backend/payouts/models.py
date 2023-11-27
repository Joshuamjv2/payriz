from pydantic import BaseModel
from datetime import datetime



class Payout(BaseModel):
    account_number: str
    account_name: str
    bank_code: str = None
    bank_name: str
    bank_type: str
    currency: str
    created: datetime = datetime.utcnow()


class Transfer(BaseModel):
    reason: str = "Transfer"
    amount: float
    from_wallet_id: str
    created: datetime = datetime.utcnow()
