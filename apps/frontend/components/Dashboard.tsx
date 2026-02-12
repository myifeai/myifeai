"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  PenLine, 
  Sparkles, 
  TrendingUp 
} from 'lucide-react';

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

  useEffect(() => { 
    fetchData(); 
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      <p className="text-purple-400 font-bold tracking-widest animate-pulse uppercase">Syncing Strategic Intel...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* --- SECTION HEADER --- */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
            <Sparkles className="text-purple-400" size={24} /> 
            STRATEGIC OBJECTIVES
          </h2>
          <p className="text-gray-500 text-xs font-medium mt-1 uppercase tracking-widest">Active Operations</p>
        </div>
        <button 
          onClick={fetchData} 
          className="p-3 glass-card bg-white/5 border-none hover:bg-white/10 transition-all active:scale-90"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* --- OBJECTIVES GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode='popLayout'>
          {tasks.length > 0 ? (
            tasks.map((item, index) => {
              // Contextual Check for writing tasks
              const isWritingTask = item.task.toLowerCase().match(/write|track|list|note|plan|identify|describe/);

              return (
                <motion.div
                  key={item.task + index}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="glass-card p-8 flex flex-col justify-between group h-full relative overflow-hidden"
                >
                  {/* Visual Flavor: Subtle Interior Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -z-10 group-hover:bg-purple-500/10 transition-all" />

                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black text-purple-400 tracking-[0.2em] uppercase bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20">
                        {item.domain}
                      </span>
                      <div className="flex items-center gap-1 text-blue-400 font-bold text-xs italic">
                        <TrendingUp size={14} /> +{item.xp} XP
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white/90 leading-snug mb-6">
                      {item.task}
                    </h3>

                    {isWritingTask && (
                      <div className="mb-6 relative">
                        <PenLine className="absolute left-4 top-4 text-gray-500" size={16} />
                        <textarea 
                          className="glass-input pl-12 h-28 text-sm resize-none"
                          placeholder="Log execution details here..."
                          value={writingInputs[index] || ""}
                          onChange={(e) => setWritingInputs({...writingInputs, [index]: e.target.value})}
                        />
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => handleComplete(item.domain, item.xp, index)}
                    className="btn-action w-full"
                  >
                    MARK COMPLETE <CheckCircle2 size={16} />
                  </button>
                </motion.div>
              );
            })
          ) : (
            /* --- EMPTY STATE --- */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center border-dashed col-span-full flex flex-col items-center justify-center"
            >
              <div className="p-5 bg-green-500/10 rounded-full mb-6">
                <CheckCircle2 className="text-green-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 italic uppercase">Mission Accomplished</h3>
              <p className="text-gray-400 text-sm max-w-xs">All daily objectives secured. High-performance state maintained.</p>
              <button 
                onClick={fetchData} 
                className="mt-8 text-purple-400 hover:text-white font-bold text-xs uppercase tracking-[0.3em] transition-all"
              >
                Request Fresh Intel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- ERROR FEEDBACK --- */}
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-xs font-bold uppercase tracking-widest"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}