import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

smtp_email = 'somsahu979@gmail.com'
smtp_password = 'scfegkpnxpaieolj'

msg = MIMEMultipart('alternative')
msg['Subject'] = 'Test Email from Bus Management'
msg['From'] = smtp_email
msg['To'] = smtp_email
msg.attach(MIMEText('Test email works!', 'plain'))

try:
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(smtp_email, smtp_password)
        server.sendmail(smtp_email, smtp_email, msg.as_string())
        print('SUCCESS: Email sent!')
except Exception as e:
    print(f'FAILED: {e}')
