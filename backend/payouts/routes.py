from fastapi import APIRouter, HTTPException
from app.config import settings
import requests, json
from app.db import payout_collection, wallet_collection, transfer_collection
from .models import Payout, Transfer
from uuid import uuid4
from datetime import datetime


router = APIRouter()

@router.post("", status_code=201)
async def create_payout_account(owner: str, payout: Payout):
    data = {
        "type": payout.bank_type, # from bank object
        "name": payout.account_name, # from user
        "account_number": payout.account_number, # from user
        "bank_code": payout.bank_code, # from bank object
        "currency": payout.currency # from bank object
    }
    url = "https://api.paystack.co/transferrecipient"
    headers = {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET}",
        "Content-Type": "application/json"
    }

    req = requests.post(url = url, data=json.dumps(data), headers=headers)

    if req.status_code == 201:
        res = req.json()["data"]
        if not res["active"] == True:
            raise HTTPException(status_code=403, detail="This account is not active.")
        recipient = {
            "_id": str(uuid4()),
            "owner": owner,
            "name": payout.account_name,
            "bank": payout.bank_name,
            "recipient_code": res["recipient_code"],
            "recipient_id": res["id"] # same ID as paystack recipient ID
        }
        payout_collection.insert_one(recipient)
    else:
        raise HTTPException(status_code=403, detail="Invalid bank information")
    recipient["id"] = recipient["_id"]
    del recipient["_id"]
    return recipient


@router.get("", status_code=200)
async def get_payouts(owner: str):
    payouts = payout_collection.find({"owner": owner})
    payouts = list(payouts)
    for payout in payouts:
        payout["id"] = payout["_id"]
        del payout["_id"]
    return payouts


@router.get("/banks", status_code=200)
async def get_paystack_banks(country: str = "nigeria"):
    url = f"https://api.paystack.co/bank?country={country}&perPage=100"
    headers = {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET}"
    }
    bank_req = requests.get(url=url, headers=headers)
    print(bank_req)

    if bank_req.status_code == 200:
        res = bank_req.json()
        return res["data"]

    return HTTPException(status_code=500, detail="Internal Server Error. Try again later")


@router.get("/{id}", status_code=200)
async def get_single_payout(id: str):
    payout = payout_collection.find_one({"_id": id})
    if payout:
        payout["id"] = payout["_id"]
        del payout["_id"]
        return payout
    raise HTTPException(status_code=400, detail="Payout not found")


@router.post("/request_payout", status_code=200)
async def request_payout(payout_account_id: str, payout_info: Transfer):
    payout_id = str(uuid4())

    payout_account = payout_collection.find_one({"_id": payout_account_id})
    if not payout_account:
        raise HTTPException(status_code=400, detail="Specified payout account does not exist. Check your ID and try again.")

    wallet = wallet_collection.find_one({"_id": payout_info.from_wallet_id})
    charges = 0
    if payout_info.amount < 50000:
        if payout_info.amount < 5001:
            charges = 10
        else:
            charges = 25
    else:
        charges = 50

    withdraw_balance = wallet["balance"]
    if not (wallet and withdraw_balance >= (payout_info.amount + charges)):
        raise HTTPException(status_code=403, detail=f"You don't have enough funds in your wallet. You need at least {str(payout_info.amount + charges)} in your account..")

    # initiate transfer
    transfer_data = {
        "source": "balance",
        "reason": payout_info.reason,
        "amount": payout_info.amount * 100,
        "reference": payout_id,
        "recipient": payout_account["recipient_code"]
    }

    initiate_transfer_req = requests.post(
        url = "https://api.paystack.co/transfer",
        headers={
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET}",
            "Content-Type": "application/json"
        },
        data = json.dumps(transfer_data)
    )
    if initiate_transfer_req.status_code == 200:
        res = initiate_transfer_req.json()
        transfer_collection.insert_one({
            "_id": payout_id,
            "account": payout_account_id,
            "reason": payout_info.reason,
            "amount": payout_info.amount,
            "status": "pending",
            "created_at": datetime.utcnow(),
            "paystack_id": res["data"]["id"],
            "from_wallet": payout_info.from_wallet_id
        })
        return {"message": f"Your transfer of {str(payout_info.amount)} was initiated successfully."}
    else:
        raise HTTPException(status_code=initiate_transfer_req.status_code, detail="Unable to initiate your payout request. Please try again later.")


@router.delete("/{id}", status_code=200)
async def delete_payout(id: str):
    # delete from paystack
    payout = payout_collection.find_one({"_id": id})
    if not payout:
        raise HTTPException(status_code=400, detail="Record not found. Please check your ID and try again.")

    req = requests.delete(
        url = f"https://api.paystack.co/transferrecipient/{payout['recipient_id']}",
        headers={
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET}"
        }
    )
    if req.status_code == 200:
        payout_collection.delete_one({"_id": id})
        return {"message": "Payout deleted successfully"}
    raise HTTPException(status_code=req.status_code, detail=req.content)


