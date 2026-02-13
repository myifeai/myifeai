import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const generateDailyPlan = async (clerkUserId: string) => {
  // 1. Fetch current scores
  const { data: scores, error } = await supabase
    .from('life_scores')
    .select('domain, score')
    .eq('user_id', clerkUserId);

  if (error) throw new Error(`Database fetch failed: ${error.message}`);
  
  // 2. Fetch last 10 task logs for memory
  const { data: history } = await supabase
    .from('task_logs')
    .select('task_text, domain')
    .eq('user_id', clerkUserId)
    .order('completed_at', { ascending: false })
    .limit(10);

  const scoreSummary = scores?.map(s => `${s.domain}: ${s.score}`).join(', ') || "No data";
  const historySummary = history?.map(h => `[${h.domain}] ${h.task_text}`).join(', ') || "No previous tasks";

  const systemPrompt = `You are MYFE AI, an elite high-performance life coach and "Life CEO" advisor.
    
    USER DATA:
    Current Scores: ${scoreSummary}
    Recent History (Do NOT repeat these): ${historySummary}

    AVAILABLE DOMAINS: Health, Wealth, Career, Relationships, Balance.

    OBJECTIVE:
    Suggest 3 ultra-specific tactical objectives for today.
    
    STRICT RULES FOR VARIETY & LEVELING:
    1. DOMAIN DIVERSITY: You MUST pick 3 DIFFERENT domains. Never suggest two tasks for the same domain in one plan.
    2. ROTATION: Prioritize domains that are NOT in the recent history to ensure a balanced life.
    3. LEVELING: The user is at LEVEL 2 (2500+ XP). Tasks should be "High-Leverage" and strategic.
    4. ACTIONABLE: Tasks must be completable in 15-45 minutes.

    STRICT OUTPUT FORMAT:
    Return ONLY a JSON object: 
    { 
      "briefing": "A 1-sentence executive summary focused on balance and high-performance.",
      "tasks": [
        { "domain": "Domain Name", "task": "The specific high-leverage action", "xp": number }
      ] 
    }`;

  try {
    // FIXED: The correct method path is .chat.completions.create
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Analyze my status and provide today's 3-domain tactical spread." }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.8, 
    });

    const content = completion.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (aiError: any) {
    console.error("AI Error:", aiError);
    throw new Error("AI Generation failed.");
  }
};