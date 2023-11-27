from fastapi import APIRouter, HTTPException
from app.db import wallet_collection


router = APIRouter()

@router.get("", status_code=200)
async def get_owner_wallets(owner: str):
    wallets = wallet_collection.find({"owner": owner})
    wallets = list(wallets)
    for wallet in wallets:
        wallet["id"] = wallet["_id"]
        del wallet["_id"]
    return wallets


@router.get("/{id}", status_code=200)
async def get_single_wallet(id: str):
    wallet = wallet_collection.find_one({"_id": id})
    if wallet_collection:
        wallet["id"] = wallet["_id"]
        del wallet["_id"]
        return wallet
    raise HTTPException(status_code=400, detail="Wallet not found.")
