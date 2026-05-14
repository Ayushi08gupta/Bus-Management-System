from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class StudentBase(BaseModel):
    name: str
    email: EmailStr
    enrollment: str
    route: str


class StudentCreate(StudentBase):
    password: str


class StudentResponse(StudentBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: StudentResponse


class UploadSummary(BaseModel):
    total_rows: int
    success_count: int
    failed_count: int
    duplicate_count: int
    failed_rows: list
    duplicate_emails: list
