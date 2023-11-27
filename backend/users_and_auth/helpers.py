from fastapi import HTTPException, Depends
from starlette.status import HTTP_401_UNAUTHORIZED
from passlib.context import CryptContext
from pydantic import EmailStr
from fastapi.security import OAuth2PasswordBearer
from app.db import access_token_collection, user_collection
from jose import JWTError
from app.helpers.tokens import decode_jwt_token, check_token_blacklist
from .models import User
from .auth.models import TokenData
import traceback

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def verify_password(plain_password, hashed_password):
    return password_context.verify(plain_password, hashed_password)


def hash_password(password):
    return password_context.hash(password)


def get_authenticated_user(db_collection, id: str):
    user = db_collection.find_one({"_id": id})
    # print(user, "Returned user")
    if user:
        return user
    else:
        # print(user)
        return False

def get_unauthenticated_user(db_collection, email: EmailStr):
    user = db_collection.find_one({"email": email})
    if user:
        if not user["is_verified"]:
            raise HTTPException(status_code=401, detail="Please verify your email address. If you don't see the email in your inbox, please check spam.")
        return user
    else:
        # print(user)
        return False


def authenticate_user(db_collection, username: str, password: str):
    user = get_unauthenticated_user(db_collection, username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found. Please register.")
    if not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return user


def get_current_user(token: str = Depends(oauth2_scheme)):
    # print(token, "token")
    credentials_exception = HTTPException(
        status_code=HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_jwt_token(token)
        username: str = payload.get("sub")

        if not username:
            raise credentials_exception
        check_token_blacklist(access_token_collection, payload.get("jti"))

        token_data = TokenData(username=username)
    except JWTError:
        traceback.print_exc
        raise credentials_exception
    user = get_authenticated_user(user_collection, token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user = Depends(get_current_user)):
    print(type(current_user))
    if not current_user["is_active"]:
        raise HTTPException(status_code=401, detail="Inactive user")
    return current_user

async def has_owner_permission(current_user: User= Depends(get_current_user)):
    if not current_user["is_owner"]:
        raise HTTPException(status_code=401, detail="Unauthorized to access this resource.")
    return




