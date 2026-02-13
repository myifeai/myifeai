import { createClient } from '@supabase/supabase-js';
import { createClerkClient } from '@clerk/backend';

const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY 
});

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', 'https://myifeai-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const absoluteUrl = new URL(req.url || '', `${protocol}://${host}`).toString();

    const requestState = await clerkClient.authenticateRequest(
      Object.assign(req, { url: absoluteUrl }),
      { authorizedParties: ['https://myifeai-frontend.vercel.app'] }
    );

    const auth = requestState.toAuth();
    if (!auth || !auth.userId) return res.status(401).json({ error: "Unauthorized" });

    const userId = auth.userId!;

    // 1. Fetch XP from profiles
    const { data: profile } = await supabase.from('profiles').select('xp_points').eq('id', userId).single();

    // 2. Fetch scores from life_scores
    const { data: scores } = await supabase.from('life_scores').select('domain, score').eq('user_id', userId);

    return res.status(200).json({
      xp_points: profile?.xp_points || 0,
      scores: scores || [] 
    });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}