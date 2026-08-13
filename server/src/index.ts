import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import fs from 'fs';

// Load env vars if file exists
const envPath = path.resolve(__dirname, '../../client/.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

import contactRouter from './routes/contact';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contact', contactRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
