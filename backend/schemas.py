from pydantic import BaseModel
from typing import Optional
from models import GenderEnum

class UserCreate(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    age: int
    gender: GenderEnum

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[GenderEnum] = None

class UserResponse(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    age: int
    gender: GenderEnum

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class BookCreate(BaseModel):
    title: str
    author: str
    published_date: Optional[str] = None
    isbn: Optional[str] = None
    genre: Optional[str] = None
    description: Optional[str] = None

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    published_date: Optional[str] = None
    isbn: Optional[str] = None
    genre: Optional[str] = None
    description: Optional[str] = None

class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    published_date: Optional[str] = None
    isbn: Optional[str] = None
    genre: Optional[str] = None
    description: Optional[str] = None
    assigned_user_id: Optional[int] = None
    assigned_user: Optional[UserResponse] = None

    class Config:
        from_attributes = True
