import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const generateDailyPlan = async (clerkUserId: string) => {
  // 1. Get user's current scores from your DB
  const { data: scores } = await supabase
    .from('life_scores')
    .select('*')
    .eq('user_id', clerkUserId);

  // 2. Format the Prompt
  const systemPrompt = `You are MYFE AI, a life coach. Based on these scores: ${JSON.stringify(scores)}, provide 3 tasks in JSON format: { "tasks": [{ "domain": string, "action": string }] }`;

  // 3. Call AI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: systemPrompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content!);
};