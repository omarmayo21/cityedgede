import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../db/.env') });

import projectsRouter from './routes/projects';
import pagesRouter from './routes/pages';
import contactRouter from './routes/contact';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectsRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/contact', contactRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
