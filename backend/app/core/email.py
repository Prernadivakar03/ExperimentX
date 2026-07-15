import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY", "")
FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def send_password_reset(to_email: str, user_name: str, reset_token: str):
    reset_url = f"{FRONTEND_URL}/reset-password?token={reset_token}"

    if not resend.api_key:
        print(f"\n[DEV] Password reset link for {to_email}:\n{reset_url}\n")
        return

    resend.Emails.send({
        "from": f"ExperimentX <{FROM_EMAIL}>",
        "to": [to_email],
        "subject": "Reset your ExperimentX password",
        "html": f"""
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="color:#6C5CE7;margin-bottom:8px;">ExperimentX</h2>
          <h3 style="color:#111;margin-bottom:16px;">Reset your password</h3>
          <p style="color:#555;margin-bottom:24px;">Hi {user_name},<br><br>
          Click the button below to reset your password. This link expires in 30 minutes.</p>
          <a href="{reset_url}"
             style="display:inline-block;background:linear-gradient(135deg,#6C5CE7,#4F8CFF);
                    color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            Reset Password
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px;">
            If you didn't request this, ignore this email.<br>
            Link: {reset_url}
          </p>
        </div>
        """,
    })


def send_welcome(to_email: str, user_name: str):
    if not resend.api_key:
        print(f"[DEV] Welcome email would be sent to {to_email}")
        return

    resend.Emails.send({
        "from": f"ExperimentX <{FROM_EMAIL}>",
        "to": [to_email],
        "subject": "Welcome to ExperimentX 🎉",
        "html": f"""
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="color:#6C5CE7;">Welcome to ExperimentX, {user_name}!</h2>
          <p style="color:#555;">Your account is ready. Start running AI-powered A/B tests today.</p>
          <a href="{FRONTEND_URL}/dashboard"
             style="display:inline-block;background:linear-gradient(135deg,#6C5CE7,#4F8CFF);
                    color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px;">
            Open Dashboard
          </a>
        </div>
        """,
    })