from fastapi import FastAPI, Depends
from users_and_auth.routes import router as users
from users_and_auth.auth.routes import router as auth
from customer.routes import router as customers
from invoice.routes import router as invoice
from users_and_auth.helpers import get_current_active_user
from payments.routes import router as payments
from wallet.routes import router as wallets
from payouts.transfers.routes import router as transfers
from app.mail import Email
from payouts.routes import router as payouts
from models import Contact


from mangum import Mangum

app = FastAPI( title="payriz",
    description="Rizzing through invoicing for small businesses.",
    version="1.0",
    docs_url='/docs',
    openapi_url='/openapi.json',
    redoc_url="/redoc",
    root_path="/"
    )

@app.get("/",status_code=200)
async def home() -> str:
    return "Welcome to Payriz"


@app.post("/contact", status_code=200)
async def contact(contact: Contact) -> dict:
    data = {
        "name": contact,
        "email": "payriz24@gmail.com",
        "sender_email": contact.email,
        "subject": "You got a message",
        "first_name": contact.first_name,
        "last_name": contact.last_name,
        "intro": "Hello",
        "message": contact.message,
        "phone": contact.phone,
        "template": "contact.html"
    }

    mail = Email(data = data)
    await mail.sendMail()
    return {"message": "Your message has been submitted. Our team will get back to you."}


app.include_router(users, prefix="/users", tags=["Users"])
app.include_router(auth, prefix="/auth", tags=["Auth"])
app.include_router(invoice, prefix="/invoices", tags=["Invoices"], dependencies=[Depends(get_current_active_user)])
app.include_router(customers, prefix="/customers", tags=["Customers"], dependencies=[Depends(get_current_active_user)])
app.include_router(payments, prefix="/payments", tags=["Payments"])
app.include_router(wallets, prefix="/wallets", tags=["Wallets"], dependencies=[Depends(get_current_active_user)])
app.include_router(transfers, prefix="/transfers", tags=["Transfers"])
app.include_router(payouts, prefix="/payouts", tags=["Payouts"], dependencies=[Depends(get_current_active_user)])

handler = Mangum(app, lifespan="off")
