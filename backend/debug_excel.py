import sys
import pandas as pd
from io import BytesIO

if len(sys.argv) < 2:
    print("Usage: python debug_excel.py <path_to_excel>")
    sys.exit(1)

path = sys.argv[1]
with open(path, 'rb') as f:
    data = f.read()

df = pd.read_excel(BytesIO(data))
print("Columns found:", list(df.columns))
print("Normalized columns:", [c.strip().lower() for c in df.columns])
print("Total rows:", len(df))
print("\nFirst 5 rows:")
print(df.head())

# Check required columns
df.columns = [c.strip().lower() for c in df.columns]
required = {"name", "email", "enrollment", "route"}
missing = required - set(df.columns)
if missing:
    print("\nMISSING COLUMNS:", missing)
else:
    print("\nAll required columns present!")
    for idx, row in df.iterrows():
        name = str(row.get("name", "")).strip()
        email = str(row.get("email", "")).strip()
        enrollment = str(row.get("enrollment", "")).strip()
        route = str(row.get("route", "")).strip()
        issues = []
        if not name or name == "nan": issues.append("empty name")
        if not email or email == "nan": issues.append("empty email")
        if not enrollment or enrollment == "nan": issues.append("empty enrollment")
        if not route or route == "nan": issues.append("empty route")
        status = "FAIL: " + ", ".join(issues) if issues else "OK"
        print(f"Row {idx+2}: {name} | {email} | {status}")
