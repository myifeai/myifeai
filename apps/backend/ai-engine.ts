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
  
  // 2. NEW: Fetch last 5 task logs to provide "Memory"
  const { data: history } = await supabase
    .from('task_logs')
    .select('task_text')
    .eq('user_id', clerkUserId)
    .order('completed_at', { ascending: false })
    .limit(5);

  const scoreSummary = scores?.map(s => `${s.domain}: ${s.score}/100`).join(', ') || "No data";
  const historySummary = history?.map(h => h.task_text).join(', ') || "No previous tasks";

  const systemPrompt = `You are MYFE AI, an elite high-performance life coach and "Life CEO" advisor.
    
    USER DATA:
    Current Scores: ${scoreSummary}
    Recent History: ${historySummary}

    OBJECTIVE:
    Suggest 3 ultra-specific, small, and actionable tasks for today.
    
    CRITICAL RULES:
    - Do NOT repeat tasks from the user's recent history.
    - If a domain score is high (>100), make the task "Optimization" focused.
    - If a domain score is low, make it "Foundational" focused.

    STRICT OUTPUT FORMAT:
    Return ONLY a JSON object: 
    { 
      "briefing": "A 1-sentence executive summary of today's focus.",
      "tasks": [
        { "domain": "Domain Name", "task": "The specific action", "xp": number }
      ] 
    }`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Analyze my history and scores to generate my tactical plan." }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (aiError: any) {
    throw new Error("AI Generation failed.");
  }
};