import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handleClerkWebhook = async (req: any, res: any) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!WEBHOOK_SECRET) return res.status(500).json({ error: "Missing secret" });

  // 1. Convert Buffer to String for Svix
  const payload = req.body.toString(); 
  const headers = req.headers;
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    // 2. Verify Signature
    evt = wh.verify(payload, {
      "svix-id": headers["svix-id"] as string,
      "svix-timestamp": headers["svix-timestamp"] as string,
      "svix-signature": headers["svix-signature"] as string,
    });
  } catch (err) {
    console.error("❌ Invalid Signature");
    return res.status(400).json({ error: "Invalid signature" });
  }

  // 3. Parse the verified payload
  const { data, type } = evt; // 'evt' is the parsed JSON object returned by wh.verify

  if (type === 'user.created') {
    const { id, first_name, last_name } = data;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim();

    try {
      // Sync Profile
      await supabase
        .from('profiles')
        .upsert([{ id, display_name: fullName || 'New User' }]);

      // Initialize Scores
      const domains = ['Health', 'Wealth', 'Social', 'Mindset'];
      const initialScores = domains.map(domain => ({
        user_id: id,
        domain,
        score: 0
      }));

      await supabase.from('life_scores').upsert(initialScores);

      console.log(`✅ User ${id} initialized.`);
      return res.status(200).json({ message: "Success" });
    } catch (dbError: any) {
      console.error("Database Error:", dbError.message);
      return res.status(500).json({ error: dbError.message });
    }
  }

  res.status(200).json({ received: true });
};