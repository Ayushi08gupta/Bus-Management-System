from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.student import Student
from schemas.student_schema import UploadSummary, StudentResponse, StudentBase
from services.excel_service import parse_excel_file
from services.email_service import send_credentials_email
from services.password_service import generate_password
from utils.security import hash_password
from typing import List

router = APIRouter(prefix="/admin", tags=["Admin"])

ALLOWED_EXTENSIONS = {".xlsx", ".xls", ".csv"}


@router.get("/students", response_model=List[StudentResponse])
def get_students(db: Session = Depends(get_db)):
    return db.query(Student).filter(Student.role == "student").all()


@router.post("/add-student", response_model=StudentResponse)
def add_student(payload: StudentBase, db: Session = Depends(get_db)):
    if db.query(Student).filter(Student.email == payload.email.lower()).first():
        raise HTTPException(status_code=400, detail="Email already exists.")
    if db.query(Student).filter(Student.enrollment == payload.enrollment).first():
        raise HTTPException(status_code=400, detail="Enrollment already exists.")
    plain_password = generate_password()
    student = Student(
        name=payload.name,
        email=payload.email.lower(),
        enrollment=payload.enrollment,
        route=payload.route,
        hashed_password=hash_password(plain_password),
        role="student",
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    send_credentials_email(student.name, student.email, plain_password)
    return student

@router.post("/upload-students", response_model=UploadSummary)
async def upload_students(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Validate file extension
    filename = file.filename.lower()
    if not any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Only .xlsx, .xls, or .csv files are allowed.")

    file_bytes = await file.read()

    # Parse file
    try:
        valid_rows, failed_rows = parse_excel_file(file_bytes, filename)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    success_count = 0
    duplicate_count = 0
    duplicate_emails = []
    processing_failures = list(failed_rows)

    for row in valid_rows:
        # Check for duplicate email
        existing = db.query(Student).filter(Student.email == row["email"]).first()
        if existing:
            duplicate_count += 1
            duplicate_emails.append(row["email"])
            continue

        # Generate and hash password
        plain_password = generate_password()
        hashed = hash_password(plain_password)

        student = Student(
            name=row["name"],
            email=row["email"],
            enrollment=row["enrollment"],
            route=row["route"],
            hashed_password=hashed,
            role="student",
        )
        db.add(student)

        try:
            db.flush()  # Get ID without committing
            email_sent = send_credentials_email(row["name"], row["email"], plain_password)
            if not email_sent:
                processing_failures.append({
                    "row": "N/A",
                    "email": row["email"],
                    "reason": "Saved but email delivery failed",
                })
            success_count += 1
        except Exception as e:
            db.rollback()
            processing_failures.append({
                "row": "N/A",
                "email": row["email"],
                "reason": f"Database error: {str(e)}",
            })
            continue

    db.commit()

    return UploadSummary(
        total_rows=len(valid_rows) + len(failed_rows),
        success_count=success_count,
        failed_count=len(processing_failures),
        duplicate_count=duplicate_count,
        failed_rows=processing_failures,
        duplicate_emails=duplicate_emails,
    )
