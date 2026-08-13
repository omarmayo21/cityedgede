import { db } from '../../../db/src/index';
import { contactSubmissions } from '../../../db/schema';
import { contactSchema } from '../validators/contact';
import nodemailer from 'nodemailer';

export async function processContactSubmission(body: any) {
  const validatedData = contactSchema.parse(body);

  await db.insert(contactSubmissions).values(validatedData);

  try {
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
  } catch (emailError: any) {
    // Log failure but DO NOT rollback database or fail the API request
    console.error('Failed to send lead email notification:', emailError.message || emailError);
  }

  return { message: 'Submission successful' };
}
