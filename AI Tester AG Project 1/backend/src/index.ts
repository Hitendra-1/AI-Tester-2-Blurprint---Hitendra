import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateTestCases } from './services/llmService';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/chat', async (req: Request, res: Response): Promise<any> => {
  try {
    const { prompt, config } = req.body;
    if (!prompt || !config) {
      return res.status(400).json({ error: 'Prompt and config are required' });
    }
    const result = await generateTestCases(prompt, config);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
