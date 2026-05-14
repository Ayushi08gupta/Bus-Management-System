import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def _build_email_html(name: str, email: str, password: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {{ font-family: 'Segoe UI', sans-serif; background: #0F172A; color: #E2E8F0; margin: 0; padding: 0; }}
        .container {{ max-width: 560px; margin: 40px auto; background: rgba(255,255,255,0.05);
                      border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; }}
        .header {{ background: linear-gradient(to right, #7C3AED, #A78BFA); padding: 32px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; color: #fff; }}
        .body {{ padding: 32px; }}
        .body p {{ line-height: 1.7; color: #CBD5E1; }}
        .cred-box {{ background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3);
                     border-radius: 12px; padding: 20px; margin: 24px 0; }}
        .cred-row {{ display: flex; justify-content: space-between; padding: 8px 0;
                     border-bottom: 1px solid rgba(255,255,255,0.05); }}
        .cred-row:last-child {{ border-bottom: none; }}
        .label {{ color: #94A3B8; font-size: 13px; }}
        .value {{ color: #fff; font-weight: 600; font-size: 14px; }}
        .btn {{ display: inline-block; margin-top: 24px; padding: 14px 32px;
                background: linear-gradient(to right, #7C3AED, #A78BFA);
                color: #fff; text-decoration: none; border-radius: 10px; font-weight: 700; }}
        .footer {{ padding: 20px 32px; text-align: center; font-size: 12px; color: #475569; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚌 Campus Bus Management</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Your account is ready</p>
        </div>
        <div class="body">
          <p>Hi <strong style="color:#fff">{name}</strong>,</p>
          <p>Your student account has been created for the Campus Bus Management System.
             Use the credentials below to log in.</p>
          <div class="cred-box">
            <div class="cred-row">
              <span class="label">Login Email</span>
              <span class="value">{email}</span>
            </div>
            <div class="cred-row">
              <span class="label">Password</span>
              <span class="value">{password}</span>
            </div>
          </div>
          <p style="color:#F59E0B;font-size:13px;">⚠️ Please change your password after first login.</p>
          <a href="{FRONTEND_URL}" class="btn">Login Now →</a>
        </div>
        <div class="footer">
          This is an automated message. Do not reply to this email.
        </div>
      </div>
    </body>
    </html>
    """


def send_credentials_email(name: str, email: str, password: str) -> bool:
    try:
        smtp_email = os.getenv("SMTP_EMAIL", "").strip()
        smtp_password = os.getenv("SMTP_PASSWORD", "").strip().replace(" ", "")

        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Your Campus Bus Management Login Credentials"
        msg["From"] = smtp_email
        msg["To"] = email

        html_part = MIMEText(_build_email_html(name, email, password), "html")
        msg.attach(html_part)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, email, msg.as_string())

        print(f"[EmailService] Email sent to {email}")
        return True
    except Exception as e:
        print(f"[EmailService] Failed to send email to {email}: {e}")
        return False
