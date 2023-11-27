from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from .models import User, UpdateUser, ChangePassword
from uuid import uuid4
from datetime import datetime
from app.db import user_collection,wallet_collection
from .helpers import get_current_active_user, has_owner_permission, hash_password, verify_password
from app.helpers.database import check_if_key_exists
from app.helpers.tokens import confirm_user_token, create_user_encrypted_token
from datetime import timedelta
from app.mail import Email

router = APIRouter()


@router.post("", status_code=201, summary="Create user")
async def signup(user: User, redirect_url: str, request: Request):
    user_exists = user_collection.find_one({"email": user.email})
    if user_exists:
        raise HTTPException(status_code=403, detail="User with this email address already exists.")

    id = str(uuid4())
    hashed_password = hash_password(user.password)
    user = user.dict(exclude_none=True)
    user["_id"] = id
    user["password"] = hashed_password

    base_url = request.url_for("confirm_verification_token")
    token = create_user_encrypted_token(user["email"].lower())
    verification_url = f"{base_url}?token={token}&redirect_url={redirect_url}"

    # send email verification
    data = {
        "email": user["email"],
        "url": verification_url,
        "intro": "Hello",
        "message": "Please click this button to verify your email.",
        "alt_message": "Or copy and paste the link below into your browser.",
        "btn_message": "Verify",
        "subject": "Verify your email",
        "template": "general_template.html"
    }
    mail = Email(data=data)
    await mail.sendMail()
    try:
        user_collection.insert_one(user)
        wallet_collection.insert_one({"_id": str(uuid4()), "owner": id, "balance": 0, "history": [], "created": datetime.utcnow()})
    except:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    return {"success": "User created successfully. Please verify your account to start."}



# @router.post("/invite", status_code=201, summary="Invite User", dependencies=[Depends(has_owner_permission)])
# async def invite_user(email: str, user = Depends(get_current_active_user)):
#     user_exists = user_collection.find_one({"email": email})
#     if user_exists:
#         raise HTTPException(status_code=403, detail="User with this email address already exists.")
#     """
#     -owner
#     -verified
#     -active
#     -names/not
#     -phone/not
#     """
#     return

@router.patch("/{id}", status_code=200, summary="Update user info")
async def update_user_info(id: str, user: UpdateUser):
    user = user.dict(exclude_none=True)
    user_collection.update_one({"_id": id}, {"$set": user})
    return user


@router.get("/me")
async def read_users_me(current_user = Depends(get_current_active_user)):
    return current_user



@router.get(
    "/confirm-verification-token", response_class=RedirectResponse, status_code=301
)
async def confirm_verification_token(token: str, redirect_url: str, request: Request):
    user = confirm_user_token(user_collection, token)
    if user:
        if user["user"]["is_verified"]:
            url = f"{redirect_url}?token_valid=True&message=Your email has already been verified."
            return url
        if user["expired"]:
            response_url = f"{redirect_url}?token_valid=False&token_expired=True&message=Your token has expired. A new verification email has been sent to your email. If you don't see it, please check spam."
            base_url = request.url_for("confirm_verification_token")
            token = create_user_encrypted_token(user["user"]["email"].lower())
            verification_url = f"{base_url}?token={token}&redirect_url={redirect_url}"
            # send email again
            data = {
                "email": user["email"],
                "url": verification_url,
                "intro": "Hello",
                "message": "Please click this button to verify your email.",
                "alt_message": "Or copy and paste the link below into your browser.",
                "btn_message": "Verify",
                "subject": "Verify your email",
                "template": "general_template.html"
            }
            mail = Email(data=data)
            await mail.sendMail()
            return response_url

        url = f"{redirect_url}?token_valid=True&message=Your email has been verified."

        user_collection.update_one(
            {"email": user["user"]["email"].lower()},
            {
                "$set": {
                    "is_verified": True,
                    "is_active": True,
                    "updated_at": datetime.utcnow(),
                }
            },
        )

        return url
    else:
        url = f"{redirect_url}?token_valid=False&message=Token is invalid. Please try again."
        return url


# create route to change password
@router.post("/change-password", status_code=200)
async def change_password(
    password_data: ChangePassword,
    current_user = Depends(get_current_active_user),
):
    if password_data.password == password_data.password2:
        old_password_matches = verify_password(
            password_data.old_password, current_user["password"]
        )
        if old_password_matches:
            new_hashed_password = hash_password(password_data.password)
            user_collection.update_one(
                {"_id": current_user["_id"]},
                {
                    "$set": {
                        "password": new_hashed_password,
                        "updated_at": datetime.utcnow(),
                    }
                },
            )
        else:
            raise HTTPException(
                status_code=400,
                detail="The current password you provided is incorrect.",
            )
    else:
        raise HTTPException(status_code=400, detail="The two passwords do not match.")
    return {"success": "Password has been changed successfully."}


# delete user
@router.delete(
    "/{id}",
    status_code=200,
    dependencies=[Depends(get_current_active_user), Depends(has_owner_permission)],
)
async def delete_user(id: str, deactivate: bool = False) -> dict:
    use = check_if_key_exists("_id", id, "Users", user_collection)
    if deactivate:
        user_collection.update_one({"_id": id}, {"$set": {"is_active": False}})
        return {"Success": "Your account has been deactivated."}
    user = user_collection.find_one({"_id": id})
    if user["is_owner"]:
        """
        Delete all data the belongs to this user
        """
    user_collection.delete_one({"_id": id})
    return {"Success": "Your account has been deleted."}
