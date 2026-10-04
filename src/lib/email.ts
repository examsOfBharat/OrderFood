import nodemailer from "nodemailer";

// Create a reusable Gmail transporter using env credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // This must be a Gmail "App Password", not your regular password
  },
});

export async function sendVerificationEmail(to: string, otp: string) {
  const mailOptions = {
    from: `"LocalBites 🍔" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your LocalBites Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body style="margin:0; padding:0; background-color:#f4f4f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #ea580c, #dc2626); padding: 36px 40px; text-align:center;">
                      <div style="display:inline-block; background:rgba(255,255,255,0.15); border-radius:16px; padding: 14px 20px;">
                        <span style="font-size:32px;">🍔</span>
                      </div>
                      <h1 style="margin:16px 0 0; color:#ffffff; font-size:28px; font-weight:900; letter-spacing:-1px;">LocalBites</h1>
                      <p style="margin:6px 0 0; color:rgba(255,255,255,0.8); font-size:14px;">Email Verification</p>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 40px 32px;">
                      <h2 style="margin:0 0 12px; color:#18181b; font-size:22px; font-weight:800;">Verify your email address</h2>
                      <p style="margin:0 0 32px; color:#71717a; font-size:15px; line-height:1.6;">
                        Welcome to LocalBites! Use the verification code below to complete your registration. This code is valid for <strong style="color:#18181b;">10 minutes</strong>.
                      </p>
                      
                      <!-- OTP Box -->
                      <div style="background:#fef3c7; border: 2px dashed #f59e0b; border-radius:16px; padding:28px; text-align:center; margin-bottom:32px;">
                        <p style="margin:0 0 8px; color:#92400e; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px;">Your verification code</p>
                        <p style="margin:0; color:#ea580c; font-size:48px; font-weight:900; letter-spacing:12px; font-family: 'Courier New', monospace;">${otp}</p>
                      </div>
                      
                      <p style="margin:0; color:#a1a1aa; font-size:13px; line-height:1.6;">
                        If you didn't create a LocalBites account, you can safely ignore this email. Someone may have entered your email address by mistake.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background:#fafafa; border-top:1px solid #f0f0f0; padding:24px 40px; text-align:center;">
                      <p style="margin:0; color:#a1a1aa; font-size:12px;">
                        © 2024 LocalBites · Your local food delivery platform
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}
