"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Crown, Zap, TrendingUp, CheckCircle2, RefreshCw } from "lucide-react";

interface Task {
  domain: string;
  task: string;
  xp: number;
}

// 1. Define what the Profile looks like
interface ProfileData {
  xp_points: number;
}

// 2. Accept profile as a prop
export default function Dashboard({ profile }: { profile: ProfileData }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const { getToken } = useAuth();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  // 3. Logic to calculate Rank based on XP
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
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Failed to fetch strategic plan", err);
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
        body: JSON.stringify({ 
          domain: task.domain, 
          xpPoints: task.xp 
        }),
      });

      if (response.ok) {
        setTasks(prev => prev.filter((_, i) => i !== index));
        // This triggers a refresh in the parent to update the XP counter
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
    <div className="flex items-center justify-center min-h-screen bg-[#0b0612]">
      <RefreshCw className="animate-spin text-purple-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0612] via-[#120a1f] to-[#050308] text-white px-6 py-10">
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl">
              <Crown className="text-purple-400" size={26} />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Life CEO</h1>
          </div>
          <p className="text-white/60 text-sm">High Performance Mode · Neural Interface Secured</p>
        </div>
        <button onClick={fetchData} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
          <RefreshCw size={20} />
        </button>
      </header>

      <section className="max-w-6xl mx-auto mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 4. PASS REAL DATA TO STATS */}
          <GlassStat 
            icon={<Zap />} 
            label="Total XP" 
            value={`${profile.xp_points}`} 
          />
          <GlassStat 
            icon={<TrendingUp />} 
            label="Rank" 
            value={calculateRank(profile.xp_points)} 
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 tracking-tight">Strategic Objectives</h2>
        <div className="space-y-5">
          {tasks.map((item, index) => (
            <ObjectiveCard 
              key={index} 
              category={item.domain} 
              xp={item.xp} 
              text={item.task}
              isSyncing={syncingId === index}
              onComplete={() => handleComplete(index, item)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// Helper components remain the same...
function GlassStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string; }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(140,80,255,0.12)]">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-white/10">{icon}</div>
        <div>
          <p className="text-sm text-white/50">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ObjectiveCard({ category, xp, text, isSyncing, onComplete }: any) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:bg-white/10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-300 uppercase tracking-widest">{category}</span>
            <span className="text-xs text-green-400 font-medium">+{xp} XP</span>
          </div>
          <p className="text-base leading-relaxed text-white/90">{text}</p>
        </div>
        <button 
          onClick={onComplete}
          disabled={isSyncing}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-90"
        >
          {isSyncing ? <RefreshCw className="animate-spin" /> : <CheckCircle2 className="text-green-400" />}
        </button>
      </div>
    </div>
  );
}