import { Router } from 'express';
import { contactSchema } from '../validators/contact';
import nodemailer from 'nodemailer';
import { processContactSubmission } from '../services/contact.service';
const router = Router();

router.post('/', async (req, res) => {
  try {
    const result = await processContactSubmission(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to process submission' });
  }
});

export default router;
