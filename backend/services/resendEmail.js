const { Resend } = require("resend");

class ModernEmailService {
  constructor() {
    if (
      !process.env.RESEND_API_KEY ||
      process.env.RESEND_API_KEY === "your-resend-api-key"
    ) {
      console.warn(
        "Resend API key not configured. Password reset emails will not be sent."
      );
      console.warn(
        "Please get a free API key from https://resend.com and add RESEND_API_KEY to your .env file"
      );
      console.warn(
        "Resend offers 3,000 free emails per month - perfect for development!"
      );
      this.configured = false;
      return;
    }

    this.configured = true;
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationOTP(email, name, otp) {
    // Check if email service is configured
    if (!this.configured) {
      console.log(`📧 Email not configured - Development Mode`);
      console.log(`📨 Would send OTP to: ${email}`);
      console.log(`🔐 OTP Code: ${otp}`);
      console.log(`👤 Name: ${name}`);
      console.log(
        `⚠️  In production, configure Resend API key to send real emails`
      );

      // Return success for development
      return {
        success: true,
        message: "Development mode - OTP logged to console",
      };
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: process.env.EMAIL_FROM || "Just an Agent <onboarding@resend.dev>",
        to: [email],
        subject: "Verify Your Email - Just an Agent",
        html: this.generateOTPHTML(name || "User", otp, email),
      });

      if (error) {
        console.error("Resend API error:", error);

        // Handle specific Resend limitations in development
        if (
          error.statusCode === 403 &&
          error.error.includes("testing emails")
        ) {
          console.log(`📧 Development Mode - Resend Domain Restriction`);
          console.log(`📨 Would send OTP to: ${email}`);
          console.log(`🔐 OTP Code: ${otp}`);
          console.log(`👤 Name: ${name}`);
          console.log(
            `💡 To fix: Either verify a domain at resend.com/domains or use your verified email (${error.error.match(/\((.*?)\)/)?.[1]}) for testing`
          );

          // Return success for development with logged OTP
          return {
            success: true,
            message:
              "Development mode - OTP logged to console due to Resend restrictions",
          };
        }

        throw new Error("Failed to send verification OTP email");
      }

      console.log(`✅ Verification OTP email sent successfully to ${email}`);
      console.log(`📧 Email ID: ${data.id}`);
      return data;
    } catch (error) {
      console.error("Error sending verification OTP email:", error);

      // In development, log the OTP instead of failing
      if (process.env.NODE_ENV !== "production") {
        console.log(`📧 Development Fallback - Email Service Failed`);
        console.log(`📨 Target Email: ${email}`);
        console.log(`🔐 OTP Code: ${otp}`);
        console.log(`👤 Name: ${name}`);
        console.log(`💡 Check your terminal for the OTP code`);

        // Return success for development
        return {
          success: true,
          message: "Development mode - OTP logged to console",
        };
      }

      throw error;
    }
  }

  async sendPasswordResetEmail(email, name, resetToken) {
    // Check if email service is configured
    if (!this.configured) {
      console.log(`📧 Email not configured - Development Mode`);
      console.log(`📨 Would send password reset to: ${email}`);
      console.log(
        `🔗 Reset URL: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      );
      console.log(`🔐 Reset token: ${resetToken}`);
      console.log(
        `⚠️  In production, configure Resend API key to send real emails`
      );

      // Return success for development
      return {
        success: true,
        message: "Development mode - Reset link logged to console",
      };
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
      const { data, error } = await this.resend.emails.send({
        from: process.env.EMAIL_FROM || "Just an Agent <onboarding@resend.dev>",
        to: [email],
        subject: "Reset Your Just an Agent Password",
        html: this.generatePasswordResetHTML(name || "User", resetUrl, email),
      });

      if (error) {
        console.error("Resend API error:", error);

        // Handle specific Resend limitations in development
        if (
          error.statusCode === 403 &&
          error.error.includes("testing emails")
        ) {
          console.log(`📧 Development Mode - Resend Domain Restriction`);
          console.log(`📨 Would send password reset to: ${email}`);
          console.log(`🔗 Reset URL: ${resetUrl}`);
          console.log(`🔐 Reset token: ${resetToken}`);
          console.log(
            `💡 To fix: Either verify a domain at resend.com/domains or use your verified email (${error.error.match(/\((.*?)\)/)?.[1]}) for testing`
          );

          // Return success for development
          return {
            success: true,
            message:
              "Development mode - Reset link logged to console due to Resend restrictions",
          };
        }

        throw new Error("Failed to send password reset email");
      }

      console.log(`✅ Password reset email sent successfully to ${email}`);
      console.log(`📧 Email ID: ${data.id}`);
      return data;
    } catch (error) {
      console.error("Error sending password reset email:", error);

      // In development, log the reset link instead of failing
      if (process.env.NODE_ENV !== "production") {
        console.log(`📧 Development Fallback - Email Service Failed`);
        console.log(`📨 Target Email: ${email}`);
        console.log(`🔗 Reset URL: ${resetUrl}`);
        console.log(`🔐 Reset token: ${resetToken}`);
        console.log(`💡 Check your terminal for the reset link`);

        // Return success for development
        return {
          success: true,
          message: "Development mode - Reset link logged to console",
        };
      }

      throw error;
    }
  }

  generateOTPHTML(name, otp, email) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Just an Agent</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { color: #2563eb; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .title { color: #1f2937; font-size: 24px; font-weight: 600; margin: 20px 0; }
        .content { color: #4b5563; margin-bottom: 30px; }
        .otp-code { background: #f3f4f6; border: 2px solid #2563eb; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .otp-number { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; font-family: monospace; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; color: #92400e; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚀 Just an Agent</div>
          <h1 class="title">Verify Your Email</h1>
        </div>

        <div class="content">
          <p>Hi ${name},</p>
          <p>Welcome to Just an Agent! To complete your account setup, please verify your email address using the code below:</p>

          <div class="otp-code">
            <div class="otp-number">${otp}</div>
          </div>

          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This code will expire in 10 minutes</li>
              <li>Enter this code exactly as shown</li>
              <li>Never share this code with anyone</li>
            </ul>
          </div>

          <p>If you didn't create an account with Just an Agent, please ignore this email.</p>
        </div>

        <div class="footer">
          <p>Best regards,<br>The Just an Agent Team</p>
          <p><small>This email was sent to ${email}. If you have any questions, please contact our support team.</small></p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  generatePasswordResetHTML(name, resetUrl, email) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Just an Agent Password</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { color: #2563eb; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .title { color: #1f2937; font-size: 24px; font-weight: 600; margin: 20px 0; }
        .content { color: #4b5563; margin-bottom: 30px; }
        .button { display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 500; margin: 20px 0, text-decoration: none; }
        .button:hover { background: #1d4ed8; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; color: #92400e; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚀 Just an Agent</div>
          <h1 class="title">Reset Your Password</h1>
        </div>

        <div class="content">
          <p>Hi ${name},</p>
          <p>We received a request to reset the password for your Just an Agent account associated with <strong>${email}</strong>.</p>
          <p>If you made this request, click the button below to reset your password:</p>

          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>

          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This link will expire in 10 minutes</li>
              <li>Only use this link if you requested a password reset</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>

          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;">${resetUrl}</p>

          <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        </div>

        <div class="footer">
          <p>Best regards,<br>The Just an Agent Team</p>
          <p><small>This email was sent to ${email}. If you have any questions, please contact our support team.</small></p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}

module.exports = new ModernEmailService();
