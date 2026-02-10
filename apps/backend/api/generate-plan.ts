import { createClerkClient } from '@clerk/backend';
import { generateDailyPlan } from '../ai-engine';

// Initialize the Clerk Client with your Secret Key
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export default async function handler(req: any, res: any) {
  // 1. CORS Headers - Match your frontend Vercel URL
  res.setHeader('Access-Control-Allow-Origin', 'https://myifeai-frontend.vercel.app'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle Preflight request
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 2. Authenticate the request
    // Clerk automatically looks for the 'Authorization: Bearer ...' header here
    const requestState = await clerkClient.authenticateRequest(req, {
      authorizedParties: ['https://myifeai-frontend.vercel.app']
    });

    const auth = requestState.toAuth();

    // 3. Type Guard: This fixes the red "userId" error
    // We check if userId exists to satisfy TypeScript's SignedInAuthObject requirement
    if (!auth || !auth.userId) {
      console.error("❌ Authentication failed: No valid userId found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // TypeScript now knows userId is a string
    const userId: string = auth.userId;

    // 4. Call your AI Engine
    console.log(`🤖 Generating plan for user: ${userId}`);
    const plan = await generateDailyPlan(userId);
    
    return res.status(200).json(plan);

  } catch (error: any) {
    console.error("AI API Error:", error.message);
    return res.status(500).json({ 
      error: "Failed to build plan", 
      details: error.message 
    });
  }
}