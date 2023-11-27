from .config import connect_to_db
from pymongo import ASCENDING

db = connect_to_db()


user_collection = db.Users
access_token_collection = db.AccessTokens
refresh_token_collection = db.RefreshTokens

invoice_collection = db.invoices
customer_collection = db.customers
invoice_number_collection = db.invoice_number

wallet_collection = db.wallet
transfer_collection = db.transfers
payout_collection = db.payouts


access_token_collection.create_index("jti")
refresh_token_collection.create_index("jti")
access_token_collection.create_index("exp", expireAfterSeconds=10)
refresh_token_collection.create_index("exp", expireAfterSeconds=10)


def delete_all_by_index(collection, key: str, index: str):
    collection.delete_many({key: index})
