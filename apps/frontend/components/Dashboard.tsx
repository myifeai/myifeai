"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Crown, Zap, TrendingUp, CheckCircle2, RefreshCw } from "lucide-react";

interface Task {
  domain: string;
  task: string;
  xp: number;
}

interface ProfileData {
  xp_points: number;
}

export default function Dashboard({ profile }: { profile: ProfileData }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const { getToken } = useAuth();

  const BACKEND_URL = 'https://myifeai.vercel.app'; // Use your actual production URL

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
      if (!response.ok) throw new Error("Failed to fetch plan");
      const data = await response.json();
      setTasks(data.tasks || []);
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
        body: JSON.stringify({ 
          domain: task.domain, 
          xpPoints: task.xp 
        }),
      });

      if (response.ok) {
        // UI FEEDBACK: Remove the task from the local list instantly
        setTasks(prev => prev.filter((_, i) => i !== index));
        // Update the header XP by notifying the parent component
        window.dispatchEvent(new Event('xpUpdated')); 
      } else {
        const errorData = await response.json();
        console.error("Backend rejection:", errorData);
        alert("Sync failed: " + (errorData.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Network/CORS error:", err);
      alert("Connectivity lost. Check your console for CORS errors.");
    } finally {
      setSyncingId(null);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0612] gap-4">
      <RefreshCw className="animate-spin text-purple-500" size={40} />
      <p className="text-purple-400 font-bold tracking-widest animate-pulse">SYNCING NEURAL INTERFACE...</p>
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
        <button onClick={fetchData} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition active:scale-95">
          <RefreshCw size={20} />
        </button>
      </header>

      <section className="max-w-6xl mx-auto mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassStat icon={<Zap />} label="Total XP" value={`${profile.xp_points}`} />
          <GlassStat icon={<TrendingUp />} label="Rank" value={calculateRank(profile.xp_points)} />
        </div>
      </section>

      <section className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 tracking-tight">Strategic Objectives</h2>
        <div className="space-y-5">
          {tasks.length > 0 ? (
            tasks.map((item, index) => (
              <ObjectiveCard 
                key={index} 
                category={item.domain} 
                xp={item.xp} 
                text={item.task}
                isSyncing={syncingId === index}
                onComplete={() => handleComplete(index, item)}
              />
            ))
          ) : (
            <div className="text-center p-12 rounded-2xl border-2 border-dashed border-white/5 text-white/40 italic">
              All objectives cleared. Stand by for fresh intel.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function GlassStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string; }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(140,80,255,0.12)] transition-transform hover:scale-[1.02]">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-white/10">{icon}</div>
        <div>
          <p className="text-sm text-white/50">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ObjectiveCard({ category, xp, text, isSyncing, onComplete }: any) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_50px_rgba(140,80,255,0.15)]">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-300 uppercase tracking-widest border border-purple-500/20">{category}</span>
            <span className="text-xs text-green-400 font-bold tracking-tight">+{xp} XP</span>
          </div>
          <p className="text-base leading-relaxed text-white/90">{text}</p>
        </div>
        <button 
          onClick={onComplete}
          disabled={isSyncing}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-90 flex-shrink-0"
        >
          {isSyncing ? <RefreshCw className="animate-spin text-purple-400" size={24} /> : <CheckCircle2 className="text-green-400" size={24} />}
        </button>
      </div>
    </div>
  );
}