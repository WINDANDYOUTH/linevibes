/**
 * Portrait Download Email Template
 * 
 * Generates a styled HTML email for portrait download delivery.
 * Used by the portrait-download subscriber when an order is placed.
 */

type PortraitEmailData = {
  orderNumber: string | number
  portraitStyle: string
  variantType: string
  downloadUrlPng: string
  downloadUrlSvg: string
}

export function generatePortraitDownloadEmail(data: PortraitEmailData): string {
  const variantLabel =
    data.variantType === "digital"
      ? "Digital Download"
      : data.variantType === "print"
      ? "Art Print + Digital Download"
      : "Canvas Frame + Digital Download"

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Line Portrait is Ready!</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0057D9 0%,#4f46e5 100%);padding:40px 40px 30px;text-align:center;">
              <div style="width:60px;height:60px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;line-height:60px;font-size:28px;">
                📥
              </div>
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 8px;">
                Your Line Portrait is Ready!
              </h1>
              <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">
                Order #${data.orderNumber} · ${variantLabel}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Thank you for your purchase! Your custom line portrait files are ready to download.
                Click the buttons below to get your high-resolution files.
              </p>

              <!-- Download Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 12px;">
                    <a href="${data.downloadUrlPng}" 
                       style="display:block;background-color:#0057D9;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:10px;font-size:14px;font-weight:600;text-align:center;">
                      ⬇️ Download PNG (High Resolution)
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px;">
                    <a href="${data.downloadUrlSvg}" 
                       style="display:block;background-color:#111827;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:10px;font-size:14px;font-weight:600;text-align:center;">
                      ⬇️ Download SVG (Scalable Vector)
                    </a>
                  </td>
                </tr>
              </table>

              <!-- File Info -->
              <div style="background-color:#f9fafb;border-radius:10px;padding:16px 20px;margin-top:24px;">
                <p style="color:#6b7280;font-size:12px;margin:0 0 8px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                  File Details
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#374151;">
                  <tr>
                    <td style="padding:4px 0;">PNG Format</td>
                    <td style="padding:4px 0;text-align:right;color:#6b7280;">4096 × 4096 px</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">SVG Format</td>
                    <td style="padding:4px 0;text-align:right;color:#6b7280;">Infinitely scalable</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">Style</td>
                    <td style="padding:4px 0;text-align:right;color:#6b7280;">${data.portraitStyle || "Classic"}</td>
                  </tr>
                </table>
              </div>

              <!-- Notice -->
              <p style="color:#9ca3af;font-size:12px;line-height:1.5;margin:24px 0 0;text-align:center;">
                Download links expire in 30 days. If you need them re-sent,
                please contact us at support@linevibes.com
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} LineVibes · All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
