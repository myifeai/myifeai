import { createClerkClient } from '@clerk/backend';
import { generateDailyPlan } from '../ai-engine';

// 1. Explicitly pull keys from process.env
const secretKey = process.env.CLERK_SECRET_KEY;
const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;

// 2. Initialize the client
const clerkClient = createClerkClient({ secretKey, publishableKey });

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', 'https://myifeai-frontend.vercel.app'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 3. Construct absolute URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const absoluteUrl = new URL(req.url || '', `${protocol}://${host}`).toString();

    // 4. Manual Authentication - Passing keys explicitly in options
    const requestState = await clerkClient.authenticateRequest(
      Object.assign(req, { url: absoluteUrl }), 
      {
        publishableKey, // Passing here ensures the "missing key" error is resolved
        secretKey,
        authorizedParties: ['https://myifeai-frontend.vercel.app']
      }
    );

    const auth = requestState.toAuth();

    // 5. Check session
    if (!auth || !auth.sessionId) {
      console.error("❌ Auth Failed: No session found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = auth.userId as string;

    console.log(`🤖 Generating plan for user: ${userId}`);
    const plan = await generateDailyPlan(userId);
    
    return res.status(200).json(plan);

  } catch (error: any) {
    console.error("Backend Error:", error.message);
    // Include details in response to see if it's STILL complaining about the key
    return res.status(500).json({ error: "Internal Error", details: error.message });
  }
}