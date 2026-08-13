import { contactSchema } from '../validators/contact';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export async function processContactSubmission(body: any) {
  const validatedData = contactSchema.parse(body);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Format email content securely
  const htmlContent = `
    <h2>New Lead Submission - cityedgede</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      ${Object.entries(validatedData)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px; text-transform: capitalize;">
              ${key.replace(/([A-Z])/g, ' $1').trim()}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
              ${String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </td>
          </tr>
        `).join('')}
    </table>
    <p style="margin-top: 20px; color: #666; font-size: 12px;">Submission received from the City Edge website.</p>
  `;

  const plainTextContent = `
New Lead Submission - cityedgede

Lead Details:
----------------
${Object.entries(validatedData)
.filter(([_, value]) => value !== undefined && value !== null && value !== '')
.map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`)
.join('\n')}

Submission received from the City Edge website.
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: process.env.EMAIL_TO || process.env.SMTP_USER,
    subject: 'New Lead Submission - cityedgede',
    text: plainTextContent.trim(),
    html: htmlContent,
  });

  // 2. Append to Google Sheets
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID) {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Define row format exactly as requested:
    // name | email | phone | country | Inquiry Type | Destination | Project | Source Page | Timestamp | message
    const timestamp = new Date().toISOString();
    const row = [
      validatedData.name || '',
      validatedData.email || '',
      validatedData.phone || '',
      validatedData.country || '',
      validatedData.inquiryType || '',
      validatedData.destination || '',
      validatedData.project || '',
      validatedData.sourcePage || '',
      timestamp,
      validatedData.message || ''
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:J',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });
  } else {
    console.warn('Google Sheets environment variables missing. Skipping sheets integration.');
  }

  return { message: 'Submission successful' };
}
