from pymongo import MongoClient
from pydantic_settings import BaseSettings
from fastapi import HTTPException

class Settings(BaseSettings):
    DATABASE_URL: str
    MONGO_INITDB_DATABASE: str

    JWT_REFRESH_SECRET_KEY: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int
    JWT_REFRESH_TOKEN_EXPIRE_MINUTES: int
    RESET_PASS_SECRET_KEY: str

    EMAIL_HOST_USER:str
    EMAIL_HOST_PASSWORD:str
    DEFAULT_FROM_EMAIL:str
    EMAIL_HOST:str
    EMAIL_PORT:int

    PAYSTACK_PUBLIC_KEY: str
    PAYSTACK_SECRET: str


    class Config:
        env_file = './.env'


settings = Settings()



client = MongoClient(settings.DATABASE_URL, uuidRepresentation='standard')


def connect_to_db():
    try:
        conn = client.server_info()
        print(f'Connected to MongoDB {conn.get("version")}')
        db = client[settings.MONGO_INITDB_DATABASE]
        return db
    except Exception:
        print("Unable to connect to the MongoDB server.")
        raise HTTPException(status_code=500, detail="Server error. Unable to connect to database.")
