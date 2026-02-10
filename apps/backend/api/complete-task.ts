import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/express';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const { userId } = getAuth(req);
  const { domain, xpPoints } = req.body;

  if (!userId || !domain) return res.status(400).json({ error: "Missing data" });

  try {
    // 1. Update Profile XP
    const { error: xpError } = await supabase.rpc('increment_xp', { 
      user_id_input: userId, 
      xp_to_add: xpPoints 
    });

    // 2. Update Domain Score (Increment by 5 points per task)
    const { error: scoreError } = await supabase.rpc('increment_domain_score', { 
      user_id_input: userId, 
      domain_input: domain,
      score_to_add: 5
    });

    if (xpError || scoreError) throw new Error("Update failed");

    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}