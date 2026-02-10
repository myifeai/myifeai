import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';
import { generateDailyPlan } from './ai-engine';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Clerk Middleware
app.use(clerkMiddleware());

// Public Health Check
app.get('/api/health', (req, res) => res.status(200).send('Myfe AI Backend is Live!'));

// Protected AI Route: Mobile app calls this to get suggestions
app.get('/api/daily-actions', requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const plan = await generateDailyPlan(userId);
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI Engine or DB failed" });
  }
});

export default app; // Vercel requirement for serverless functions