import requests
import openpyxl
import os

# Login
login = requests.post('http://localhost:8000/auth/login', json={'email': 'admin@campusbus.edu', 'password': 'password123'})
print('Login status:', login.status_code)
if login.status_code != 200:
    print('Login error:', login.text)
    exit()

token = login.json()['access_token']
print('Token OK')

# Create test excel
wb = openpyxl.Workbook()
ws = wb.active
ws.append(['Name', 'Email', 'Enrollment', 'Route'])
import pandas as pd
df = pd.read_excel(r'C:\Users\HP\Downloads\students_dummy_data.xlsx')
for _, row in df.iterrows():
    ws.append([row['Name'], row['Email'], str(row['Enrollment']), row['Route']])
wb.save('test_upload.xlsx')

# Upload
with open('test_upload.xlsx', 'rb') as f:
    resp = requests.post(
        'http://localhost:8000/admin/upload-students',
        headers={'Authorization': f'Bearer {token}'},
        files={'file': ('test_upload.xlsx', f, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
    )

print('Upload status:', resp.status_code)
print('Upload response:', resp.text)
os.remove('test_upload.xlsx')
