"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface Task {
  domain: string;
  task: string;
  xp: number;
}

export default function DailyPlan() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalXp, setTotalXp] = useState<number>(0); // Track total user XP
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  // This tells TypeScript: "Use the env variable, but if it's missing, use this string as a fallback"
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

  // 1. Fetch Plan and Profile Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      
      // Fetch both the Plan and the Profile XP in parallel
      const [planRes, profileRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/generate-plan`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${BACKEND_URL}/api/get-profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const planData = await planRes.json();
      const profileData = await profileRes.json();

      setTasks(planData.tasks || []);
      setTotalXp(profileData.xp_points || 0);
    } catch (err: any) {
      setError("The AI Coach is taking a break.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Task Completion
  const handleComplete = async (domain: string, xpPoints: number, index: number) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${BACKEND_URL}/api/complete-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ domain, xpPoints }),
      });

      if (response.ok) {
        // Optimistic UI Update: Remove task and add XP immediately
        setTasks(prev => prev.filter((_, i) => i !== index));
        setTotalXp(prev => prev + xpPoints);
      }
    } catch (err) {
      console.error("Failed to sync progress:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="p-6 text-center animate-pulse text-blue-600 font-bold">Loading Life CEO Dashboard...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      
      {/* --- PROGRESS HEADER --- */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Current Rank</p>
            <h3 className="text-3xl font-black italic">LEVEL {Math.floor(totalXp / 100) + 1}</h3>
          </div>
          <div className="text-right">
            <p className="text-blue-400 font-mono text-sm font-bold">{totalXp} XP TOTAL</p>
          </div>
        </div>
        
        {/* Progress Bar (Fills up every 100 XP) */}
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
          <div 
            className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full transition-all duration-700 ease-out" 
            style={{ width: `${totalXp % 100}%` }}
          ></div>
        </div>
      </div>

      {/* --- TASK LIST --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Today's Objectives</h2>
          <button onClick={fetchData} className="text-xs text-gray-400 hover:text-blue-600 transition">Refresh</button>
        </div>

        {tasks.length > 0 ? (
          <div className="grid gap-3">
            {tasks.map((item, index) => (
              <div key={index} className="group p-4 border border-gray-100 rounded-2xl bg-white shadow-sm flex justify-between items-center hover:border-blue-200 transition-all">
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{item.domain}</span>
                  <p className="text-gray-700 font-semibold text-lg leading-snug group-hover:text-black transition-colors">{item.task}</p>
                </div>
                
                <button 
                  onClick={() => handleComplete(item.domain, item.xp, index)}
                  className="ml-4 bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs tracking-tighter transition-all active:scale-90"
                >
                  DONE +{item.xp}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">All strategic goals met. Excellent work, CEO.</p>
            <button onClick={fetchData} className="mt-4 bg-white border border-gray-200 px-6 py-2 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition">Request New Intel</button>
          </div>
        )}
      </div>

      {error && <p className="text-center text-red-500 text-sm font-medium">{error}</p>}
    </div>
  );
}