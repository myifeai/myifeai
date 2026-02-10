import { generateDailyPlan } from '../ai-engine';
import { getAuth } from '@clerk/express';

export default async function handler(req: any, res: any) {
  // 1. Setup CORS so the browser doesn't block the request
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 2. Get User ID from Clerk
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // 3. Call your AI Engine
    const plan = await generateDailyPlan(userId);
    return res.status(200).json(plan);

  } catch (error: any) {
    console.error("AI API Error:", error.message);
    return res.status(500).json({ error: "Failed to build plan" });
  }
}