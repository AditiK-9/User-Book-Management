# User & Book Management App

A full-stack web application where users can register, log in, manage user accounts, and manage a library of books (create, edit, delete, and assign books to users).

## Features

**User management**
- Register a new account (unique username, hashed password)
- Log in and receive a JWT token
- Log out (token is invalidated)
- View your own profile
- View, edit, and delete users (login required)

**Book management**
- Add new books with form validation
- List all books with search (title/author) and genre filtering
- Edit and delete books
- Assign a book to a user through a searchable popup
- "My Books" page showing books assigned to the logged-in user

## Tech Stack

| Layer          | Technology                                  |
|----------------|---------------------------------------------|
| Backend        | FastAPI (Python)                            |
| Database       | PostgreSQL                                  |
| ORM            | SQLAlchemy                                  |
| Migrations     | Alembic                                     |
| Authentication | JWT (python-jose), bcrypt (passlib)         |
| Frontend       | React (Vite)                                |

## Project Structure

```
User_Management_FastAPI/
├── backend/
│   ├── main.py            # API endpoints
│   ├── models.py          # SQLAlchemy models (User, Book)
│   ├── schemas.py         # Pydantic validation schemas
│   ├── auth.py            # Password hashing and JWT helpers
│   ├── dependencies.py    # get_current_user (route protection)
│   ├── database.py        # Database engine and session
│   ├── config.py          # Settings loaded from .env
│   ├── requirements.txt
│   ├── alembic.ini
│   └── alembic/
│       ├── env.py
│       └── versions/      # 001_initial.py, 002_add_books.py
└── frontend/
    └── src/
        ├── components/    # Sidebar, BookForm, BookTable, BookFilters, AssignModal
        ├── pages/         # NewBook, ListBooks, MyBooks
        ├── services/      # api.js (all API calls in one place)
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

## Getting Started

### Prerequisites
- Python 3.12+
- PostgreSQL 16+
- Node.js 20+

### 1. Create the database

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE userdb;
ALTER USER postgres WITH PASSWORD 'password';
\q
```

### 2. Run the backend

```bash
cd backend
pip3 install -r requirements.txt
```

Create a `.env` file in `backend/`:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/userdb
SECRET_KEY=change-this-to-a-long-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Apply the database migrations and start the server:

```bash
python3 -m alembic upgrade head
uvicorn main:app --reload --port 8000
```

The API runs at `http://localhost:8000`. Interactive documentation is at `http://localhost:8000/docs`.

### 3. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## API Endpoints

### Authentication and users

| Method | Endpoint          | Auth | Description                          |
|--------|-------------------|------|--------------------------------------|
| POST   | `/register`       | No   | Create a new account                 |
| POST   | `/login`          | No   | Log in and receive a JWT token       |
| POST   | `/logout`         | Yes  | Invalidate the current token         |
| GET    | `/me`             | Yes  | Get the logged-in user               |
| GET    | `/users`          | Yes  | List all users                       |
| GET    | `/users/search`   | Yes  | Search users by name or username     |
| PUT    | `/users/{id}`     | Yes  | Update a user                        |
| DELETE | `/users/{id}`     | Yes  | Delete a user                        |

### Books

| Method | Endpoint                      | Auth | Description                                  |
|--------|-------------------------------|------|----------------------------------------------|
| POST   | `/books`                      | Yes  | Create a book                                |
| GET    | `/books`                      | Yes  | List books (optional `search`, `genre`)      |
| GET    | `/books/my-books`             | Yes  | Books assigned to the logged-in user         |
| PUT    | `/books/{id}`                 | Yes  | Edit a book                                  |
| DELETE | `/books/{id}`                 | Yes  | Delete a book                                |
| PUT    | `/books/{id}/assign?user_id=` | Yes  | Assign a book to a user                      |

Protected endpoints expect the token in the request header:

```
Authorization: Bearer <token>
```

## Known Limitations

- The logout blacklist is stored in memory, so it is cleared when the server restarts. A production version would store blacklisted tokens in the database.
- CORS currently allows all origins (`*`). In production, restrict this to the frontend URL.
- Any logged-in user can edit or delete any user. A production version would add role-based permissions.
- The default database password and secret key are for local development only. Never use them in production.
