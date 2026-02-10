import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handleClerkWebhook = async (req: any, res: any) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!WEBHOOK_SECRET) return res.status(500).json({ error: "Missing secret" });

  const payload = req.body.toString(); 
  const headers = req.headers;
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;
  try {
    evt = wh.verify(payload, {
      "svix-id": headers["svix-id"] as string,
      "svix-timestamp": headers["svix-timestamp"] as string,
      "svix-signature": headers["svix-signature"] as string,
    });
  } catch (err) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const { data, type } = evt;

  if (type === 'user.created') {
    const { id, first_name, last_name } = data;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim();

    try {
      console.log(`Attempting to sync user: ${id}`);

      // 1. Sync Profile with Error Check
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([{ id, display_name: fullName || 'New User' }], { onConflict: 'id' });

      if (profileError) {
        console.error("❌ PROFILE INSERT ERROR:", profileError.message);
        return res.status(500).json({ error: profileError.message });
      }

      // 2. Initialize Scores with Error Check
      const domains = ['Health', 'Wealth', 'Social', 'Mindset'];
      const initialScores = domains.map(domain => ({
        user_id: id,
        domain,
        score: 0
      }));

      const { error: scoreError } = await supabase
        .from('life_scores')
        .upsert(initialScores, { onConflict: 'user_id, domain' });

      if (scoreError) {
        console.error("❌ SCORES INSERT ERROR:", scoreError.message);
        return res.status(500).json({ error: scoreError.message });
      }

      console.log(`✅ User ${id} successfully committed to DB.`);
      return res.status(200).json({ message: "Success" });

    } catch (err: any) {
      console.error("🔥 CRITICAL WEBHOOK CRASH:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(200).json({ received: true });
};