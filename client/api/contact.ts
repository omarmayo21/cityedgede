import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processContactSubmission } from '../../server/src/services/contact.service';
import cors from 'cors';

// Helper to run cors middleware
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

// Allow CORS for the API
const corsMiddleware = cors({ methods: ['POST', 'OPTIONS'] });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await runMiddleware(req, res, corsMiddleware);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const result = await processContactSubmission(req.body);
    return res.status(201).json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: 'Failed to process submission' });
  }
}
