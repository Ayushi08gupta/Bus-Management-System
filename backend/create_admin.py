from database import SessionLocal
from models.student import Student
from utils.security import hash_password

db = SessionLocal()

admin = Student(
    name="Admin",
    email="admin@campusbus.edu",
    enrollment="ADMIN001",
    route="Admin",
    hashed_password=hash_password("password123"),
    role="admin",
)

db.add(admin)
db.commit()
print("Admin created: admin@admin.com / admin123")
db.close()
