import pandas as pd

path = r'C:\Users\HP\Downloads\students_dummy_data.xlsx'
df = pd.read_excel(path)
df['Email'] = df['Email'].str.replace('@gmailcom', '@gmail.com', regex=False)
df.to_excel(path, index=False)
print('Fixed emails:')
for e in df['Email']:
    print(e)
