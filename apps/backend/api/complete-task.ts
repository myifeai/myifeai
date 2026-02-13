import { createClient } from '@supabase/supabase-js';
import { createClerkClient } from '@clerk/backend';

// 1. Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 2. Initialize Clerk Backend Client
const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY 
});

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', 'https://myifeai-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    // 3. Prepare the Absolute URL for Clerk validation
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const absoluteUrl = new URL(req.url || '', `${protocol}://${host}`).toString();

    // 4. Authenticate the Request manually
    const requestState = await clerkClient.authenticateRequest(
      Object.assign(req, { url: absoluteUrl }),
      { 
        authorizedParties: ['https://myifeai-frontend.vercel.app'],
        secretKey: process.env.CLERK_SECRET_KEY,
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY
      }
    );

    const auth = requestState.toAuth();

    if (!auth || !auth.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = auth.userId;
    const { domain, xpPoints } = req.body;

    if (!domain) return res.status(400).json({ error: "Missing domain data" });

    // 5. Update Profile XP
    const { error: xpError } = await supabase.rpc('increment_xp', { 
      user_id_input: userId, 
      xp_to_add: xpPoints 
    });

    // 6. Update Domain Score
    const { error: scoreError } = await supabase.rpc('increment_domain_score', { 
      user_id_input: userId, 
      domain_input: domain,
      score_to_add: 5
    });

    if (xpError || scoreError) {
        console.error("DB Error:", xpError || scoreError);
        throw new Error("Update failed in Supabase");
    }

    return res.status(200).json({ success: true });

  } catch (error: any) {
    console.error("Task Completion Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}