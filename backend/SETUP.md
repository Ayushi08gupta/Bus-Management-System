# Backend Setup Guide

## Prerequisites
- Python 3.10+
- MySQL 8.0+
- Node.js 18+
- A Gmail account with App Password enabled

---

## Step 1 — MySQL Setup

1. Open MySQL and run:
```sql
source schema.sql
```
Or paste the contents of `schema.sql` directly into MySQL Workbench.

---

## Step 2 — Configure Environment Variables

Edit `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bus_management

JWT_SECRET_KEY=change_this_to_a_long_random_string
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

SMTP_EMAIL=your_gmail@gmail.com
SMTP_PASSWORD=your_gmail_app_password

FRONTEND_URL=http://localhost:5173
```

### Gmail App Password Setup:
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App Passwords → Generate a password for "Mail"
4. Use that 16-character password as `SMTP_PASSWORD`

---

## Step 3 — Install Python Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

---

## Step 4 — Start the Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

API will be available at: http://localhost:8000  
Swagger docs at: http://localhost:8000/docs

---

## Step 5 — Install Frontend Dependencies & Start Admin UI

```bash
cd admin
npm install
npm run dev
```

Admin UI will be available at: http://localhost:5173

---

## Step 6 — Excel File Format

Create an Excel file with these exact column headers:

| Name         | Email              | Enrollment   | Route   |
|--------------|--------------------|--------------|---------|
| Rahul Sharma | rahul@gmail.com    | 0827CS221001 | Route A |
| Priya Singh  | priya@gmail.com    | 0827CS221002 | Route B |

---

## API Endpoints

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| POST   | /auth/login               | Login (returns JWT token)    |
| POST   | /admin/upload-students    | Upload Excel/CSV of students |
| GET    | /health                   | Health check                 |
| GET    | /docs                     | Swagger UI                   |

---

## Project Structure

```
backend/
├── main.py                  # FastAPI app entry point
├── database.py              # SQLAlchemy engine + session
├── schema.sql               # MySQL schema
├── requirements.txt
├── .env                     # Environment variables
├── models/
│   └── student.py           # SQLAlchemy Student model
├── schemas/
│   └── student_schema.py    # Pydantic request/response schemas
├── routes/
│   ├── auth.py              # POST /auth/login
│   └── upload.py            # POST /admin/upload-students
├── services/
│   ├── email_service.py     # Gmail SMTP email sender
│   ├── excel_service.py     # pandas Excel/CSV parser
│   └── password_service.py  # Random password generator
├── utils/
│   ├── jwt_handler.py       # JWT create + verify
│   └── security.py          # bcrypt hash + verify
└── uploads/                 # (reserved for future file storage)
```
