import { createClerkClient } from '@clerk/backend';
import { generateDailyPlan } from '../ai-engine';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export default async function handler(req: any, res: any) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Origin', 'https://myifeai-frontend.vercel.app'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 2. Prepare the URL for Clerk
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const absoluteUrl = new URL(req.url || '', `${protocol}://${host}`).toString();

    // 3. NEW CORE 2 SYNTAX: Pass req and options separately
    // We map the incoming 'req' to a Request-like object that Clerk expects
    const requestState = await clerkClient.authenticateRequest(
      // First argument: The request object with a 'url' property
      Object.assign(req, { url: absoluteUrl }), 
      // Second argument: The options
      {
        authorizedParties: ['https://myifeai-frontend.vercel.app']
      }
    );

    const auth = requestState.toAuth();

    // 4. FIX: Check for session existence to clear 'userId' red line
    if (!auth || !auth.sessionId) {
      console.error("❌ Auth Failed: No session found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // By checking for sessionId first, TS allows access to userId safely
    const userId = auth.userId as string;

    console.log(`🤖 Generating plan for user: ${userId}`);
    const plan = await generateDailyPlan(userId);
    
    return res.status(200).json(plan);

  } catch (error: any) {
    console.error("Backend Error:", error.message);
    return res.status(500).json({ error: "Internal Error", details: error.message });
  }
}