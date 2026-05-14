import pandas as pd
import re
from io import BytesIO


REQUIRED_COLUMNS = {"name", "email", "enrollment", "route"}


def _is_valid_email(email: str) -> bool:
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w{2,}$"
    return bool(re.match(pattern, str(email).strip()))


def parse_excel_file(file_bytes: bytes, filename: str) -> tuple[list[dict], list[dict]]:
    """
    Parse uploaded Excel or CSV file.
    Returns (valid_rows, failed_rows)
    Each valid row: { name, email, enrollment, route }
    Each failed row: { row_number, data, reason }
    """
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(BytesIO(file_bytes))
        else:
            df = pd.read_excel(BytesIO(file_bytes))
    except Exception as e:
        raise ValueError(f"Could not read file: {e}")

    # Normalize column names
    df.columns = [col.strip().lower() for col in df.columns]

    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(missing)}")

    valid_rows = []
    failed_rows = []

    for idx, row in df.iterrows():
        row_number = idx + 2  # Excel rows start at 2 (1 is header)
        name = str(row.get("name", "")).strip()
        email = str(row.get("email", "")).strip()
        enrollment = str(row.get("enrollment", "")).strip()
        route = str(row.get("route", "")).strip()

        if not name or name == "nan":
            failed_rows.append({"row": row_number, "email": email, "reason": "Name is empty"})
            continue
        if not _is_valid_email(email):
            failed_rows.append({"row": row_number, "email": email, "reason": "Invalid email format"})
            continue
        if not enrollment or enrollment == "nan":
            failed_rows.append({"row": row_number, "email": email, "reason": "Enrollment is empty"})
            continue
        if not route or route == "nan":
            failed_rows.append({"row": row_number, "email": email, "reason": "Route is empty"})
            continue

        valid_rows.append({
            "name": name,
            "email": email.lower(),
            "enrollment": enrollment,
            "route": route,
        })

    return valid_rows, failed_rows
