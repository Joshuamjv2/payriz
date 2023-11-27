from fastapi import HTTPException
from datetime import datetime, timedelta
from ..config import settings
import secrets
from pydantic import EmailStr
from jose import jwt, jwe
from users_and_auth.auth.models import ExpiredToken
from uuid import UUID, uuid4

def create_access_or_refresh_token(data: dict, token_lifespan: int):
    data_to_encode = data.copy()
    if token_lifespan:
        expire = datetime.utcnow() + token_lifespan
    else:
        expire = datetime.utcnow() + timedelta(minutes=20)
    data_to_encode.update({"exp": expire, "jti": secrets.token_hex(16), "iat": datetime.now()})
    encoded_jwt = jwt.encode(data_to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_jwt_token(token: str):
    payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    return payload


def blacklist_jwt_token(db_collection, payload):
    token_time = datetime.utcfromtimestamp(payload["exp"])
    token_data = ExpiredToken(user=payload["sub"], jti=payload["jti"], exp=token_time, added=datetime.utcnow())
    token_data = token_data.dict()
    token_data["_id"] = UUID(str(uuid4()))
    db_collection.insert_one(token_data)
    return

def check_token_blacklist(db_collection, jti: str):
    check_saved_token = db_collection.find_one({"jti": jti})
    if check_saved_token:
        raise HTTPException(status_code=401, detail="Invalid token")


def create_user_encrypted_token(data: EmailStr):
    token = jwe.encrypt(f"{data} {datetime.now() + timedelta(minutes=60)}",settings.RESET_PASS_SECRET_KEY, algorithm='dir', encryption='A128GCM')
    return token.decode("utf-8")


def confirm_user_token(db_collection, token: str):
    token = token.encode("utf-8")

    hidden_payload = jwe.decrypt(token, settings.RESET_PASS_SECRET_KEY)

    hidden_payload = hidden_payload.decode("utf-8").split(" ")
    hidden_user_email = hidden_payload[0]
    hidden_date = f"{hidden_payload[1]} {hidden_payload[-1]}"
    user = db_collection.find_one({"email": hidden_user_email})

    if user:
        if hidden_date < str(datetime.now()):
            return {"expired": True, "user": user}
        if not user["is_owner"] and not user["is_verified"]:
            db_collection.update_one({"email": hidden_user_email}, {"$set": {"is_verified": True, "is_active": True}})
        return {"expired": False, "user": user}
    else:
        return False
