"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Crown, Zap, TrendingUp, CheckCircle2, RefreshCw, BarChart3, MessageSquareQuote } from "lucide-react";

interface Task {
  domain: string;
  task: string;
  xp: number;
}

interface ProfileData {
  xp_points: number;
  scores: { domain: string; score: number }[];
}

export default function Dashboard({ profile }: { profile: ProfileData }) {
  const [plan, setPlan] = useState<{briefing?: string, tasks: Task[]}>({ tasks: [] });
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const { getToken } = useAuth();

  const BACKEND_URL = 'https://myifeai.vercel.app';

  const calculateRank = (xp: number) => {
    if (xp < 100) return "Intern";
    if (xp < 500) return "Manager";
    return "CEO";
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${BACKEND_URL}/api/generate-plan`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPlan(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (index: number, task: Task) => {
    setSyncingId(index);
    try {
      const token = await getToken();
      const response = await fetch(`${BACKEND_URL}/api/complete-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ domain: task.domain, xpPoints: task.xp }),
      });

      if (response.ok) {
        setPlan(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== index) }));
        window.dispatchEvent(new Event('xpUpdated')); 
      }
    } catch (err) {
      console.error("Sync failed", err);
    } finally {
      setSyncingId(null);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0612] gap-4">
      <RefreshCw className="animate-spin text-purple-500" size={40} />
      <p className="text-purple-400 font-bold tracking-widest animate-pulse uppercase">Syncing Intelligence...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0612] via-[#120a1f] to-[#050308] text-white px-6 py-10">
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Crown className="text-purple-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight uppercase italic">Life CEO</h1>
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em]">Neural Link: Active</p>
        </div>
        <button onClick={fetchData} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition active:scale-90">
          <RefreshCw size={18} />
        </button>
      </header>

      {/* STATS & BRIEFING */}
      <section className="max-w-6xl mx-auto mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
             <GlassStat icon={<Zap className="text-yellow-400" />} label="Total Score" value={`${profile.xp_points} XP`} />
             <GlassStat icon={<TrendingUp className="text-blue-400" />} label="Current Rank" value={calculateRank(profile.xp_points)} />
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
            <MessageSquareQuote className="absolute -right-2 -bottom-2 text-white/5" size={100} />
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3">Strategic Briefing</p>
            <p className="text-sm leading-relaxed text-white/80 italic font-medium">"{plan.briefing || "Analyzing data for optimal performance..."}"</p>
          </div>
        </div>
      </section>

      {/* DOMAIN PROGRESS BARS */}
      <section className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={16} className="text-white/40" />
          <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Domain Calibration</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {profile.scores?.map((s) => (
            <div key={s.domain} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{s.domain}</span>
                <span className="text-[10px] font-mono text-purple-400">{s.score}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-400 transition-all duration-1000 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                  style={{ width: `${Math.min(s.score, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TASKS */}
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] px-4">Tactical Objectives</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        
        <div className="space-y-4">
          {plan.tasks.length > 0 ? plan.tasks.map((item, index) => (
            <ObjectiveCard 
              key={index} 
              category={item.domain} 
              xp={item.xp} 
              text={item.task}
              isSyncing={syncingId === index}
              onComplete={() => handleComplete(index, item)}
            />
          )) : (
            <div className="text-center p-16 rounded-3xl border border-dashed border-white/5 bg-white/[0.02]">
              <CheckCircle2 className="mx-auto text-white/10 mb-4" size={40} />
              <p className="text-white/30 text-xs font-medium tracking-widest uppercase">All Objectives Secured</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function GlassStat({ icon, label, value }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex items-center gap-5">
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function ObjectiveCard({ category, xp, text, isSyncing, onComplete }: any) {
  return (
    <div className="group bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300">
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 text-[9px] font-black rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
              {category}
            </span>
            <span className="text-[10px] text-green-400/80 font-mono font-bold">+{xp} XP</span>
          </div>
          <p className="text-sm text-white/80 font-medium leading-snug">{text}</p>
        </div>
        <button 
          onClick={onComplete}
          disabled={isSyncing}
          className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all active:scale-90"
        >
          {isSyncing ? <RefreshCw className="animate-spin text-purple-400" size={20} /> : <CheckCircle2 className="text-white/20 group-hover:text-green-400" size={22} />}
        </button>
      </div>
    </div>
  );
}