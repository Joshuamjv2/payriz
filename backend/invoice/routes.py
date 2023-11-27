from fastapi import APIRouter, HTTPException, Request
from uuid import uuid4
from app.db import invoice_collection
from .models import Invoice
from .helpers import create_invoice_pdf
import requests
from app.mail import Email

router = APIRouter()


@router.post("", status_code=201, summary="Create invoice")
async def create_invoice(invoice: Invoice, request: Request):
    invoice_id = str(uuid4())
    invoice = invoice.dict()

    invoice_pdf_url = create_invoice_pdf(data={
        "due_date": invoice["due_date"],
        "date": invoice["invoice_date"],
        "items": list(invoice["items"]),
        "to": invoice["customer"]["name"],
        "from": invoice["owner"]["name"],
        "currency": invoice["currency"] or "USD",
        "tax": invoice["tax"],
        "invoice_number": invoice["invoice_number"]
    }, customer_id=invoice["customer"]["customer_id"])

    # send out email with invoice and payment link
    invoice["_id"] = invoice_id
    invoice["url"] = invoice_pdf_url

    # create url for payment
    url = request.url_for("generate_payment_url")
    email_pay_url = f"{url}?payment_id={invoice_id}"

    email_data = {
        "email": invoice["customer"]["email"],
        "url": email_pay_url,
        "invoice_url": invoice["url"],
        "intro": f"Hello {invoice['customer']['name']}",
        "message": f"Here is your invoice from {invoice['owner']['name']}. Click the button below to clear it.",
        "alt_message": "Or copy and paste the link below into your browser.",
        "btn_message": "Pay Invoice",
        "subject": "Your invoice.",
        "template": "invoice.html"
    }

    mail = Email(data=email_data)
    await mail.sendMail()

    owner_id = invoice["owner"]["owner_id"]
    invoice["owner"] = owner_id

    customer_id = invoice["customer"]["customer_id"]
    invoice["customer_id"] = customer_id

    invoice_collection.insert_one(invoice)
    invoice["id"] = invoice["_id"]
    del invoice["_id"]
    return invoice



@router.get("", status_code=200, summary="Get all invoices")
async def get_all_invoices(owner_id: str):
    try:
        invoices = invoice_collection.find({"owner": owner_id})
    except:
        raise HTTPException(status_code=500, detail="Internal server error")
    invoices = list(invoices)
    for invoice in invoices:
        invoice["id"] = invoice["_id"]
        del invoice["_id"]
    return invoices


@router.get("/{invoice_id}", status_code=200, summary="Get single invoice")
async def get_single_invoice(invoice_id: str):
    try:
        invoice = invoice_collection.find_one({"_id": invoice_id})
    except:
        raise HTTPException(status_code=500, detail="Internal server error")

    if invoice:
        invoice["id"] = invoice["_id"]
        del invoice["_id"]
        return invoice
    raise HTTPException(status_code=400, detail="Invoice not found.")



@router.get("/customer/{customer_id}", summary="Get invoices for a specific customer")
async def get_customer_invoices(customer_id: str):
    try:
        invoices = invoice_collection.find({"customer_id": customer_id})
    except:
        raise HTTPException(status_code=500, detail="Internal server error")

    invoices = list(invoices)
    # if len(invoices) < 1:
    #     raise HTTPException(status_code=400, detail="No invoices found for this customer.")

    for invoice in invoices:
        invoice["id"] = invoice["_id"]
        del invoice["_id"]
    return invoices



@router.delete("/{invoice_id}", status_code=200, summary="Delete invoice")
async def delete_invoice(invoice_id: str):
    try:
        invoice_collection.delete_one({"_id": invoice_id})
    except:
        raise HTTPException(status_code=500, detail="Internal server error.")
    return {"success": "Invoice deleted successfully!"}

