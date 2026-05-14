from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.student import Student
from schemas.student_schema import LoginRequest, LoginResponse, StudentResponse
from utils.security import verify_password
from utils.jwt_handler import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == payload.email.lower()).first()

    if not student or not verify_password(payload.password, student.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token_data = {
        "sub": str(student.id),
        "email": student.email,
        "role": student.role,
    }
    token = create_access_token(token_data)

    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=StudentResponse.model_validate(student),
    )
