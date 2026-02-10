import Groq from 'groq-sdk'; // Use Groq instead of OpenAI
import { createClient } from '@supabase/supabase-js';

// Initialize Groq with your key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const generateDailyPlan = async (clerkUserId: string) => {
  // 1. Fetch scores from Supabase
  const { data: scores, error } = await supabase
    .from('life_scores')
    .select('*')
    .eq('user_id', clerkUserId);

  if (error) throw new Error("Database fetch failed");

  // 2. Format the Prompt for the Life CEO
  const systemPrompt = `You are MYFE AI, a high-performance life coach. 
    Current user scores: ${JSON.stringify(scores)}. 
    Suggest 3 ultra-specific, small actionable tasks for today.
    Return ONLY a JSON object: { "tasks": [{ "domain": string, "task": string, "xp": number }] }`;

  // 3. Call Groq (Llama 3.3 is free and very fast)
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Generate my plan based on my scores." }
    ],
    model: "llama-3.3-70b-versatile", // This model is currently leading for free-tier speed/logic
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content || '{}');
};