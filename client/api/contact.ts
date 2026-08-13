import type { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';
import nodemailer from 'nodemailer';

// --- 1. Zod Schema ---
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  message: z.string().optional(),
  sourcePage: z.string().optional(),
});

// --- 2. Database Schema ---
const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  country: text('country').notNull(),
  message: text('message'),
  sourcePage: text('source_page'),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- 3. Database Connection ---
const queryClient = postgres(process.env.DATABASE_URL!);
const db = drizzle(queryClient);

// --- 4. CORS Middleware ---
function runMiddleware(req: VercelRequest, res: VercelResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
const corsMiddleware = cors({ methods: ['POST', 'OPTIONS'] });

// --- 5. Main Handler ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await runMiddleware(req, res, corsMiddleware);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const validatedData = contactSchema.parse(req.body);

    // Insert into DB
    await db.insert(contactSubmissions).values(validatedData);

    // Send Email
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
      console.error('Failed to send lead email notification:', emailError.message || emailError);
    }

    return res.status(201).json({ message: 'Submission successful' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Contact submission error:', error);
    return res.status(500).json({ error: 'Failed to process submission' });
  }
}
