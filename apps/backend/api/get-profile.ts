import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/express';

const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 2. Identify the User
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // 3. Fetch XP from the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('xp_points')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return res.status(200).json(data || { xp_points: 0 });

  } catch (error: any) {
    console.error("Fetch Profile Error:", error.message);
    return res.status(500).json({ error: "Could not load profile" });
  }
}