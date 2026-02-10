import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handleClerkWebhook = async (req: any, res: any) => {
  // 1. Verify the Signature (Security)
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Missing webhook secret" });
  }

  const payload = JSON.stringify(req.body);
  const headers = req.headers;
  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    wh.verify(payload, {
      "svix-id": headers["svix-id"] as string,
      "svix-timestamp": headers["svix-timestamp"] as string,
      "svix-signature": headers["svix-signature"] as string,
    });
  } catch (err) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  // 2. Handle the Event
  const { data, type } = req.body;

  if (type === 'user.created') {
    const { id, first_name, last_name } = data;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim();

    try {
      // Create Profile
      await supabase
        .from('profiles')
        .insert([{ id, display_name: fullName || 'New User' }]);

      // Initialize Scores so AI has data to read
      const domains = ['Health', 'Wealth', 'Social', 'Mindset'];
      const initialScores = domains.map(domain => ({
        user_id: id,
        domain,
        score: 0
      }));

      await supabase.from('life_scores').insert(initialScores);

      return res.status(200).json({ message: "User & Scores Initialized" });
    } catch (dbError: any) {
      return res.status(500).json({ error: dbError.message });
    }
  }

  res.status(200).json({ received: true });
};