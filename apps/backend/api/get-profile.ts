import { createClient } from '@supabase/supabase-js';
import { createClerkClient } from '@clerk/backend';

// 1. Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 2. Initialize Clerk with BOTH keys (Required for 2026 SDK)
const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY 
});

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', 'https://myifeai-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 3. Prepare the Absolute URL for Clerk validation
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const absoluteUrl = new URL(req.url || '', `${protocol}://${host}`).toString();

    // 4. Manual Authentication (Replacing getAuth)
    const requestState = await clerkClient.authenticateRequest(
      Object.assign(req, { url: absoluteUrl }),
      { authorizedParties: ['https://myifeai-frontend.vercel.app'] }
    );

    const auth = requestState.toAuth();

    // 5. Type-safe check for the User ID
    if (!auth || !auth.userId) {
      console.error("❌ Profile Fetch: Unauthorized access attempt");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = auth.userId!;

    // 6. Fetch XP from Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('xp_points')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Supabase Error:", error.message);
      // If profile doesn't exist yet, return 0 XP instead of crashing
      return res.status(200).json({ xp_points: 0 });
    }

    return res.status(200).json(data);

  } catch (error: any) {
    console.error("Fetch Profile Error:", error.message);
    return res.status(500).json({ error: "Could not load profile", details: error.message });
  }
}