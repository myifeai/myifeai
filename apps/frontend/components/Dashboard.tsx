"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, RefreshCw, CheckCircle2, PenLine, Sparkles } from 'lucide-react';

interface Task {
  domain: string;
  task: string;
  xp: number;
}

export default function DailyPlan() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalXp, setTotalXp] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [writingInputs, setWritingInputs] = useState<{ [key: number]: string }>({});
  const { getToken } = useAuth();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
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
      setError("AI Engine offline. Tactical pause initiated.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (domain: string, xpPoints: number, index: number) => {
    try {
      const token = await getToken();
      const note = writingInputs[index] || "";
      
      const response = await fetch(`${BACKEND_URL}/api/complete-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ domain, xpPoints, note }),
      });

      if (response.ok) {
        setTasks(prev => prev.filter((_, i) => i !== index));
        setTotalXp(prev => prev + xpPoints);
      }
    } catch (err) {
      console.error("Failed to sync progress:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      <p className="text-purple-400 font-bold tracking-widest animate-pulse">SYNCING STRATEGIC INTEL...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      
      {/* --- TASK LIST HEADER --- */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-400" size={20} />
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">Strategic Objectives</h2>
        </div>
        <button 
          onClick={fetchData} 
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* --- TASK CARDS --- */}
      <div className="grid gap-6">
        <AnimatePresence mode='popLayout'>
          {tasks.length > 0 ? (
            tasks.map((item, index) => {
              // Logic to decide if a writing block is needed
              const isWritingTask = item.task.toLowerCase().match(/write|track|list|note|plan/);

              return (
                <motion.div
                  key={item.task + index}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="glass-card overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-widest">
                        {item.domain}
                      </span>
                      <div className="flex items-center gap-1 text-blue-400 font-bold text-xs">
                        <Zap size={14} /> +{item.xp} XP
                      </div>
                    </div>

                    <p className="text-white text-lg font-medium leading-relaxed mb-4">
                      {item.task}
                    </p>

                    {/* DYNAMIC WRITING BLOCK */}
                    {isWritingTask && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                      >
                        <div className="relative">
                          <PenLine className="absolute left-3 top-3 text-gray-500" size={16} />
                          <textarea 
                            value={writingInputs[index] || ""}
                            onChange={(e) => setWritingInputs({...writingInputs, [index]: e.target.value})}
                            placeholder="Execute and log details here..."
                            className="glass-input pl-10 h-24 text-sm resize-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    <button 
                      onClick={() => handleComplete(item.domain, item.xp, index)}
                      className="btn-action w-full justify-center group"
                    >
                      <span>MARK AS COMPLETE</span>
                      <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center border-dashed"
            >
              <div className="inline-block p-4 bg-green-500/10 rounded-full mb-4">
                <CheckCircle2 className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tactical Sweep Complete</h3>
              <p className="text-gray-400 text-sm">All daily objectives secured. Resume high-performance mode.</p>
              <button onClick={fetchData} className="mt-6 text-purple-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
                Request Fresh intel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-xs font-bold">
          {error}
        </div>
      )}
    </div>
  );
}