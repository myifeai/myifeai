import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const generateDailyPlan = async (clerkUserId: string) => {
  // 1. Fetch scores from Supabase
  const { data: scores, error } = await supabase
    .from('life_scores')
    .select('domain, score')
    .eq('user_id', clerkUserId);

  if (error) throw new Error(`Database fetch failed: ${error.message}`);
  
  // 2. Format the Prompt for the Life CEO
  const scoreSummary = scores?.map(s => `${s.domain}: ${s.score}/100`).join(', ') || "No data";

  const systemPrompt = `You are MYFE AI, an elite high-performance life coach and "Life CEO" advisor.
    
    USER DATA:
    Current Scores: ${scoreSummary}
    Target Domains: Health, Wealth, Career, Relationships, Balance.

    OBJECTIVE:
    Suggest 3 ultra-specific, small, and actionable tasks for today.
    
    STRICT OUTPUT FORMAT:
    Return ONLY a JSON object: 
    { 
      "briefing": "A 1-sentence executive summary of today's focus based on the lowest scores.",
      "tasks": [
        { "domain": "Domain Name", "task": "The specific action", "xp": number }
      ] 
    }
    Note: 'xp' should be between 10 and 50.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Analyze my life scores and generate my strategic plan for today." }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '{}';
    return JSON.parse(content);

  } catch (aiError: any) {
    console.error("Groq AI Error:", aiError.message);
    throw new Error("AI Generation failed.");
  }
};