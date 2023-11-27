from fastapi import APIRouter, Depends, HTTPException
from .models import Customer, UpdateCustomer
from users_and_auth.helpers import has_owner_permission
from uuid import uuid4
from app.db import customer_collection


router = APIRouter()


@router.post("", dependencies=[Depends(has_owner_permission)], status_code=201, summary="Create customer")
async def create_customer(owner_id: str, customer: Customer) -> dict:
    customer = customer.dict()
    customer_id = str(uuid4())
    customer["_id"] = customer_id
    customer["owner"] = owner_id
    try:
        customer_collection.insert_one(customer)
    except:
        raise HTTPException(status_code=500, detail="Internal serer error.")

    customer["id"] = customer_id
    del customer["_id"]
    return customer


@router.get("", status_code=200, summary="Get customers")
async def get_customers(owner_id: str) -> list:
    try:
        customers = customer_collection.find({"owner": owner_id})
    except:
        raise HTTPException(status_code=500, detail="Internal serer error.")
    customers = list(customers)

    # if len(customers) < 1:
    #     raise HTTPException(status_code=400, detail="No customers found.")

    for customer in customers:
        customer["id"] = customer["_id"]
        del customer["_id"]
    return customers



@router.get("/{customer_id}", summary="Get single customer", status_code=200)
async def get_single_customer(customer_id: str) -> dict:
    customer = customer_collection.find_one({"_id": customer_id})
    if customer:
        customer["id"] = customer["_id"]
        del customer["_id"]
        return customer
    else:
        raise HTTPException(status_code=400, detail="Customer with this ID does not exist.")


@router.patch("/{customer_id}", summary="Update customer information", status_code=200)
async def update_customer_info(customer_id: str, customer: UpdateCustomer) -> dict:
    customer = customer.dict(exclude_none=True)
    try:
        customer_collection.update_one({"_id": customer_id}, {"$set": customer})
        return customer
    except:
        raise HTTPException(status_code=500, detail="Internal serer error.")



@router.delete("/{customer_id}", status_code=200, summary="Delete user")
async def delete_customer(customer_id: str):
    try:
        customer_collection.delete_one({"_id": customer_id})
    except:
        raise HTTPException(status_code=500, detail="Internal serer error.")
    return {"success": "Customer deleted successfully."}
