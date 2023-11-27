from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.responses import RedirectResponse
import traceback
from .models import Token, ResetPassword, ResetPasswordRequest
from app.config import settings
from app.mail import Email
from uuid import UUID
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.helpers.tokens import (
    create_access_or_refresh_token,
    create_user_encrypted_token,
    confirm_user_token,
    decode_jwt_token,
    blacklist_jwt_token
    )
from users_and_auth.helpers import (
    authenticate_user, hash_password,
    get_current_active_user,
    get_unauthenticated_user
    )

from datetime import timedelta, datetime
from app.db import user_collection, access_token_collection, refresh_token_collection

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login", scheme_name="JWT")

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(user_collection, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"Authorization": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=settings.JWT_REFRESH_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_or_refresh_token(
        data={"sub": str(user['_id'])}, token_lifespan=access_token_expires
    )
    refresh_token = create_access_or_refresh_token(
        data={"sub": str(user['_id'])}, token_lifespan=refresh_token_expires
    )
    Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")

    user_collection.update_one({"_id": user["_id"]}, {"$set": {"last_login": datetime.utcnow()}})

    tokens = {"access_token": access_token, "refresh_token": refresh_token}
    login_response = {
        "id": str(user["_id"]),
        "email": user["email"],
        "is_owner": user["is_owner"],
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"]
    }
    # return login_response
    return login_response


@router.post("/logout", dependencies=[Depends(get_current_active_user)])
async def logout(tokens: Token):
    # revoke access and refresh tokens by adding them to database
    try:
        blacklist_jwt_token(access_token_collection, decode_jwt_token(tokens.access_token))
        blacklist_jwt_token(refresh_token_collection, decode_jwt_token(tokens.refresh_token))
    except:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Server error. Could not revoke these tokens.")
    return

@router.post("/refresh-tokens", response_model=Token)
async def refresh_token(refresh_token_data: str):
    refresh_token_payload = decode_jwt_token(refresh_token_data)

    token_time = datetime.utcfromtimestamp(refresh_token_payload["exp"])
    if token_time < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Refresh token is expired.")

    token_is_blacklisted = refresh_token_collection.find_one({"jti": refresh_token_payload["jti"]})
    if token_is_blacklisted:
        raise HTTPException(status_code=401, detail="This token is not valid anymore.")

    user_exists = user_collection.find_one({"_id":refresh_token_payload["sub"]})
    if user_exists:
        access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_token_expires = timedelta(minutes=settings.JWT_REFRESH_TOKEN_EXPIRE_MINUTES)

        refresh = create_access_or_refresh_token(data={"sub": str(refresh_token_payload["sub"])}, token_lifespan=refresh_token_expires)
        access = create_access_or_refresh_token(data={"sub": str(refresh_token_payload["sub"])}, token_lifespan=access_token_expires)
    else:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token.")
    Token(access_token=access, refresh_token=refresh)
    blacklist_jwt_token(refresh_token_collection, payload=refresh_token_payload)
    return {"access_token": access, "refresh_token": refresh}

@router.post("/request-reset-password", status_code=201)
async def request_reset_password(data: ResetPasswordRequest, request: Request, redirect_url: str):
    user = get_unauthenticated_user(user_collection, email=data.username)
    if user:
        if not user["is_verified"]:
            raise HTTPException(status_code=400, detail="Please verify your email. If you don't see the email in your inbox, please check spam.")
        token = create_user_encrypted_token(data=data.username)
        base_url = request.url_for("confirm_password_reset_token")
        redirect_url = redirect_url
        url = f"{base_url}?token={token}&redirect_url={redirect_url}"
        # send email with request link to change password
        data = {
                "email": user["email"],
                "url": url,
                "intro": "Hello",
                "message": "Click the button below to reset your password. If you did not make the request, please ignore this message.",
                "alt_message": "Or copy and paste the link below into your browser.",
                "btn_message": "Reset",
                "subject": "Reset your password",
                "template": "general_template.html"
            }
        mail = Email(data=data)
        await mail.sendMail()
    else:
        raise HTTPException(status_code=400, detail="User with this email does not exist")
    return {"success": "Check your email for instructions to reset your password"}



@router.get("/confirm-encrypted-token", response_class=RedirectResponse, status_code=301)
async def confirm_password_reset_token(token: str, redirect_url: str):
    # verify token
    user = confirm_user_token(user_collection, token)
    # if user is an employee, this is where we verify them
    if user:
        if user["expired"]:
            url = f"{redirect_url}?token={token}&token_valid=False&token_expired=True&message=Token is expired."
        else:
            url = f"{redirect_url}?token={token}&token_valid=True&token_expired=False&message=You can reset your password."
        return url
    else:
        url = f"{redirect_url}?token_valid=False&message=Token is invalid. Please try again."
        return url

@router.post("/reset-password", status_code=200)
async def reset_password(token: str, password_data: ResetPassword):
    # verify token again
    message = "Your password has been reset successfully."
    user = confirm_user_token(user_collection, token)
    if user:
        hashed_password = hash_password(password_data.password)
        user_collection.update_one({"email": user["user"]["email"]}, {"$set": {"password": hashed_password}})
    else:
        traceback.print_exc
        raise HTTPException(status_code=400, detail="Token is invalid.")
    return {"success": message}
