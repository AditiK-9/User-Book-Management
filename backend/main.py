from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List

from database import get_db, engine
from models import Base, User, Book
from schemas import UserCreate, UserUpdate, UserResponse, LoginRequest, Token, BookCreate, BookUpdate, BookResponse
from auth import hash_password, verify_password, create_access_token, invalidate_token
from dependencies import get_current_user, security

Base.metadata.create_all(bind=engine)

app = FastAPI(title="User Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    user = User(
        username=user_data.username,
        password=hash_password(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        age=user_data.age,
        gender=user_data.gender,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.post("/login", response_model=Token)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/logout")
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    invalidate_token(credentials.credentials)
    return {"message": "Successfully logged out"}

@app.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/users", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(User).all()

@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for field, value in user_data.model_dump(exclude_none=True).items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user

@app.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()

@app.post("/books", response_model=BookResponse, status_code=201)
def create_book(book_data: BookCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    book = Book(**book_data.model_dump())
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@app.get("/books", response_model=List[BookResponse])
def list_books(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    search: str = None,
    genre: str = None,
):
    query = db.query(Book)
    if search:
        query = query.filter(
            Book.title.ilike(f"%{search}%") |
            Book.author.ilike(f"%{search}%")
        )
    if genre:
        query = query.filter(Book.genre.ilike(f"%{genre}%"))
    return query.all()

@app.get("/books/my-books", response_model=List[BookResponse])
def my_books(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Book).filter(Book.assigned_user_id == current_user.id).all()

@app.put("/books/{book_id}", response_model=BookResponse)
def update_book(
    book_id: int,
    book_data: BookUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    for field, value in book_data.model_dump(exclude_none=True).items():
        setattr(book, field, value)
    db.commit()
    db.refresh(book)
    return book

@app.delete("/books/{book_id}", status_code=204)
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()

@app.put("/books/{book_id}/assign", response_model=BookResponse)
def assign_book(
    book_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    book.assigned_user_id = user_id
    db.commit()
    db.refresh(book)
    return book

@app.get("/users/search", response_model=List[UserResponse])
def search_users(
    q: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(User).filter(
        User.username.ilike(f"%{q}%") |
        User.first_name.ilike(f"%{q}%") |
        User.last_name.ilike(f"%{q}%")
    ).all()
