from pydantic import BaseModel, Field, EmailStr

class Contact(BaseModel):
    first_name: str = Field(min_length=3)
    last_name: str = Field(min_length=3)
    phone: str = None
    email: EmailStr
    message: str

