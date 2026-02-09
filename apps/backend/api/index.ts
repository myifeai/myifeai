import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { StrictAuthProp, ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
// Import your logic files using relative paths
import { generateDailyPlan } from '../src/ai-engine'; 

const app = express();
app.use(cors());
app.use(express.json());

// Public health check
app.get('/api/health', (req, res) => res.send('Myfe AI Backend is Live!'));

// Protected AI Route
app.get('/api/daily-actions', ClerkExpressRequireAuth(), async (req, res) => {
  const authReq = req as unknown as StrictAuthProp;
  const userId = authReq.auth.userId;

  try {
    const plan = await generateDailyPlan(userId);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: "AI Engine failed" });
  }
});

// IMPORTANT: Do NOT call app.listen() here for Vercel production.
// Vercel handles the execution.
export default app;