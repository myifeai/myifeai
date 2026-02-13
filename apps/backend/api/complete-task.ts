import { createClient } from '@supabase/supabase-js';
import { createClerkClient } from '@clerk/backend';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY 
});

export default async function handler(req: any, res: any) {
  // Update this to your actual frontend URL if it changes
  res.setHeader('Access-Control-Allow-Origin', 'https://myifeai-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
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

    const userId = auth.userId;
    const { domain, xpPoints, taskText } = req.body;

    // 1. LOG THE TASK (Persistence for AI Memory)
    const { error: logError } = await supabase
      .from('task_logs')
      .insert([{ 
        user_id: userId, 
        domain, 
        task_text: taskText || "Completed tactical objective", 
        xp_earned: xpPoints 
      }]);

    if (logError) console.error("Logging error:", logError);

    // 2. Update Global Profile XP
    const { error: xpError } = await supabase.rpc('increment_xp', { 
      user_id_input: userId, 
      xp_to_add: xpPoints 
    });

    if (xpError) throw new Error(`XP Update Failed: ${xpError.message}`);

    // 3. Update Domain Score (Fixed for Level 2+)
    // We increment the domain score by 10 per task to ensure visible bar movement
    const { error: domainError } = await supabase.rpc('increment_domain_score', { 
      user_id_input: userId, 
      domain_input: domain,
      score_to_add: 10 
    });

    if (domainError) throw new Error(`Domain Score Update Failed: ${domainError.message}`);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Backend Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}