import { Router } from 'express';
import { db } from '../../../db/src/index';
import { contactSubmissions } from '../../../db/schema';
import { contactSchema } from '../validators/contact';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const validatedData = contactSchema.parse(req.body);

    await db.insert(contactSubmissions).values(validatedData);

    res.status(201).json({ message: 'Submission successful' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to process submission' });
  }
});

export default router;
