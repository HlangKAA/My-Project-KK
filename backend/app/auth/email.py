"""Verification and password-reset email templates."""
from html import escape
from flask import current_app, url_for
from flask_mail import Message
from app import mail

def send_verification_email(email, token, username):
    """Send verification email to user"""
    try:
        verification_url = url_for('auth.verify_email', token=token, _external=True)

        msg = Message(
            'Verify Your Email - Lost Spectrum',
            recipients=[email]
        )

        safe_username = escape(username)
        msg.html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Georgia, serif; background-color: #15130f; margin: 0; padding: 0;">
            <div style="width: 100%; padding: 40px 0; background-color: #15130f;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #1e1d18; border: 1px solid rgba(184,137,73,0.4); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);">

                    <!-- Header -->
                    <div style="background: linear-gradient(90deg, #1e1d18, #30291e); padding: 30px; text-align: center; border-bottom: 1px solid rgba(184,137,73,0.2);">
                        <h1 style="margin: 0; font-size: 24px; color: #f3e7d0; text-transform: uppercase; letter-spacing: 2px;">
                            The Lost <span style="color: #b88949;">Spectrum</span>
                        </h1>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px 30px; text-align: center;">
                        <h2 style="color: #f3e7d0; margin-top: 0; font-size: 20px;">Verify Your Arcane Mail</h2>
                        <p style="color: #c2b49e; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Welcome, Explorer <strong>{safe_username}</strong>.<br>
                            Confirm your address to enter the realm.
                        </p>

                        <a href="{verification_url}" style="background-color: #b88949; border: 1px solid #d0a55f; color: #1e1d18; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                            Verify Email
                        </a>

                        <p style="color: #a89080; font-size: 14px; margin-top: 30px;">
                            Or paste this link into your browser:<br>
                            <a href="{verification_url}" style="color: #d0a55f; text-decoration: none; word-break: break-all;">{verification_url}</a>
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #15130f; padding: 20px; text-align: center; font-size: 12px; color: #8f806c;">
                        <p style="margin: 0;">Link expires in 24 hours.</p>
                        <p style="margin: 5px 0 0;">&copy; The Lost Spectrum</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_password_reset_email(email, token, username):
    """Send password reset email to user"""
    try:
        reset_url = f"{current_app.config['FRONTEND_URL']}/reset-password/{token}"
        safe_username = escape(username)

        msg = Message(
            'Reset Your Password - Lost Spectrum',
            recipients=[email]
        )

        msg.html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Georgia, serif; background-color: #15130f; margin: 0; padding: 0;">
            <div style="width: 100%; padding: 40px 0; background-color: #15130f;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #1e1d18; border: 1px solid rgba(184,137,73,0.4); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);">

                    <!-- Header -->
                    <div style="background: linear-gradient(90deg, #1e1d18, #30291e); padding: 30px; text-align: center; border-bottom: 1px solid rgba(184,137,73,0.2);">
                        <h1 style="margin: 0; font-size: 24px; color: #f3e7d0; text-transform: uppercase; letter-spacing: 2px;">
                            The Lost <span style="color: #b88949;">Spectrum</span>
                        </h1>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px 30px; text-align: center;">
                        <h2 style="color: #f3e7d0; margin-top: 0; font-size: 20px;">Forge a New Incantation</h2>
                        <p style="color: #c2b49e; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Hello, Explorer <strong>{safe_username}</strong>.<br>
                            A request to reset your access key has been received.
                        </p>

                        <a href="{reset_url}" style="background-color: #b88949; border: 1px solid #d0a55f; color: #1e1d18; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                            Reset Password
                        </a>

                        <p style="color: #a89080; font-size: 14px; margin-top: 30px;">
                            Or paste this link into your browser:<br>
                            <a href="{reset_url}" style="color: #d0a55f; text-decoration: none; word-break: break-all;">{reset_url}</a>
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #15130f; padding: 20px; text-align: center; font-size: 12px; color: #8f806c;">
                        <p style="margin: 0;">Link expires in 1 hour.</p>
                        <p style="margin: 5px 0 0;">If you didn't request this, ignore this message.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
