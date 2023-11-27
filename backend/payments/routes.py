from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from app.db import invoice_collection, wallet_collection, transfer_collection
import requests, json, hashlib, hmac, json, os
from app.config import settings

from datetime import datetime

router = APIRouter()


@router.get("", response_class = RedirectResponse, status_code=301)
async def generate_payment_url(payment_id: str, request: Request):
    invoice = invoice_collection.find_one({"_id": payment_id})

    if invoice:
        paid = invoice.get("status")
        if paid == "paid":
            return f'{invoice["redirect_url"]}?paid=already-paid'

        # generate payment link
        tax = invoice["tax"]
        items = invoice["items"]
        total = 0 + tax

        for item in items:
            item_total = (item["unit_cost"] * item["quantity"])*100
            total += item_total

        payment_body = {
            "email": invoice["customer"]["email"],
            "amount": str(total),
            "reference": payment_id,
            "callback_url": str(request.url_for("verify_payment")),
            "channels": ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer", "eft"]
        }

        # print(payment_body)
        req_url = "https://api.paystack.co/transaction/initialize/"
        req = requests.post(url=req_url,
            data=json.dumps(payment_body),
            headers={
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET}",
            "Content-Type": "application/json"
        })


        if req.status_code == 200:
            res = req.json()
            url = res["data"]["authorization_url"]
            ref = res["data"]["reference"]
            code = res["data"]["access_code"]
            # print(url)
            return url
    else:
        return f'{invoice["redirect_url"]}?paid=no-invoice'



@router.get("/verify-payment", status_code=301, response_class=RedirectResponse)
async def verify_payment(reference: str, trxref: str):
    invoice = invoice_collection.find_one({"_id": reference})

    req_url = f"https://api.paystack.co/transaction/verify/{reference}" # get
    req = requests.get(url=req_url, headers={
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET}",
        "Content-Type": "application/json"
    })

    if req.status_code == 200:
        res = req.json()
        if res["data"]["status"] == "success":
            invoice_collection.update_one({"_id": reference}, {"$set": {"status": "paid", "updated": datetime.utcnow()}})
            wallet = wallet_collection.find_one({"owner": invoice["owner"]})

            balance = wallet["balance"]
            history: list = wallet["history"]
            history_object = {
                "paid_at": res["data"]["paid_at"],
                "description": invoice["customer"]["name"],
                "total": res["data"]["amount"]/100,
                "transaction_reference": invoice["_id"],
                "type": "in"
            }
            history.append(history_object)

            update = {
                "balance": balance + (res["data"]["amount"]/100),
                "history": history,
                "updated": datetime.utcnow()
            }

            print(len(history), "verify")

            if invoice.get("wallet"):
                update_key = {"_id": invoice["wallet"]}
            else:
                update_key = {"owner": invoice["owner"]}
            wallet_collection.update_one(update_key, {"$set": update})
            return f"{invoice['redirect_url']}?paid=paid"
        elif res["data"]["status"] == "failed":
            return f"{invoice['redirect_url']}?paid=failed"
        elif res["data"]["status"] == "reversed":
            return f"{invoice['redirect_url']}?paid=reversed"
        else:
            return f"{invoice['redirect_url']}?paid=pending"
    return f"{invoice['redirect_url']}?paid=pending"


@router.post("/webhook", status_code=200)
async def paystack_webhook(request: Request):
    payload = await request.body()
    # payload = payload.decode("utf-8")
    signature = request.headers["x-paystack-signature"]
    secret = settings.PAYSTACK_SECRET.encode()
    hash = hmac.new(secret, payload, hashlib.sha512).hexdigest()

    if hash != signature:
        raise HTTPException(status_code=403, detail="Authorization")

    event = payload.decode()
    event_object = json.loads(event)
    event_type = event_object["event"]
    print(event_type)
    data = event_object["data"]
    if event_type == "transfer.success":
        ref = data["reference"]
        transfer = transfer_collection.find_one({"_id": ref})

        wallet = wallet_collection.find_one({"_id": transfer["from_wallet"]})
        balance = wallet["balance"]
        wallet_history = wallet['history']
        history_object = {
            "paid_at": data["createdAt"],
            "description": data["reason"],
            "total": data["amount"] / 100,
            "transaction_reference": data["reference"],
            "type": "out"
        }
        wallet_history.append(history_object)

        update = {
            "balance": balance - (data["amount"]/100),
            "history": wallet_history,
            "updated": datetime.utcnow()
        }
        wallet_collection.update_one({"_id": transfer["from_wallet"]}, {"$set": update})
        transfer_collection.update_one({"_id": ref}, {"$set": {"status": "paid"}})

    if event_type == "transfer.failed":
        ref = data["reference"]
        transfer_collection.update_one({"_id": ref}, {"$set": {"status": "failed"}})

    # successfully paid
    if event_type == "charge.success":
        reference = data["reference"]
        invoice = invoice_collection.find_one({"_id": reference})
        if invoice["status"] == "paid":
            return
        invoice_collection.update_one({"_id": reference}, {"$set": {"status": "paid", "updated": datetime.utcnow()}})
        wallet = wallet_collection.find_one({"owner": invoice["owner"]})

        balance = wallet["balance"]
        history: list = wallet["history"]

        history_object = {
            "paid_at": data["paid_at"],
            "description": invoice["customer"]["name"],
            "total": data["amount"]/100,
            "transaction_reference": invoice["_id"],
            "type": "in"
        }
        history.append(history_object)

        update = {
            "balance": balance + (data["amount"]/100),
            "history": history,
            "updated": datetime.utcnow()
        }

        if invoice.get("wallet"):
            update_key = {"_id": invoice["wallet"]}
        else:
            update_key = {"owner": invoice["owner"]}
        wallet_collection.update_one(update_key, {"$set": update})

    return {"Yay": "Webhooks work"}

