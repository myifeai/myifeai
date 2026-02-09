import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handleClerkWebhook = async (req: any, res: any) => {
  const { data, type } = req.body;

  if (type === 'user.created') {
    const { id, first_name, last_name } = data;
    
    // Create the profile in Supabase automatically
    const { error } = await supabase
      .from('profiles')
      .insert([{ id, display_name: `${first_name} ${last_name}` }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "User synced to Supabase" });
  }
  res.status(200).end();
};