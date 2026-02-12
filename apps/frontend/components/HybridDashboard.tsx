"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  BarChart3,
  FileText,
  CheckSquare,
  Image,
  HelpCircle,
  ShoppingBag,
  Settings,
  Mail,
  Search,
  User,
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  PenLine, 
  Sparkles, 
  TrendingUp,
  Crown,
  Activity
} from 'lucide-react';

interface Task {
  domain: string;
  task: string;
  xp: number;
}

export default function HybridDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalXp, setTotalXp] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [writingInputs, setWritingInputs] = useState<{ [key: number]: string }>({});
  const [activeNav, setActiveNav] = useState('tasks');
  const { getToken } = useAuth();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

  const navItems = [
    { id: 'home', icon: Home },
    { id: 'analytics', icon: BarChart3 },
    { id: 'tasks', icon: CheckSquare },
    { id: 'documents', icon: FileText },
    { id: 'media', icon: Image },
    { id: 'help', icon: HelpCircle },
    { id: 'shop', icon: ShoppingBag },
  ];

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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#1a1625] via-[#2d1b2e] to-[#1a1625]">
      {/* LEFT SIDEBAR */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed left-0 top-0 h-screen w-20 glass-sidebar flex flex-col items-center py-8 gap-6 z-50"
      >
        {/* Logo */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
          <Crown size={24} className="text-white" />
        </div>

        {/* Nav Items */}
        <div className="flex-1 flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all
                ${activeNav === item.id 
                  ? 'bg-white/10 text-white shadow-lg shadow-purple-500/20' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <item.icon size={20} />
            </button>
          ))}
        </div>

        {/* Bottom Icons */}
        <div className="flex flex-col gap-4">
          <button className="w-12 h-12 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center">
            <Settings size={20} />
          </button>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-20 p-8">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Life <span className="text-purple-400">CEO</span></h1>
            <p className="text-gray-500 text-sm uppercase tracking-wider">High Performance Mode Active</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Stats Cards */}
            <div className="glass-card-secondary px-6 py-3 flex items-center gap-3">
              <Zap size={20} className="text-yellow-400" />
              <div>
                <div className="text-xs text-gray-400 uppercase">Focus</div>
                <div className="text-xl font-bold text-white">92%</div>
              </div>
            </div>
            
            <div className="glass-card-secondary px-6 py-3 flex items-center gap-3">
              <Activity size={20} className="text-blue-400" />
              <div>
                <div className="text-xs text-gray-400 uppercase">XP</div>
                <div className="text-xl font-bold text-white">{totalXp}</div>
              </div>
            </div>

            <button className="glass-card-secondary p-3 hover:bg-white/10 transition-all">
              <Mail size={20} className="text-gray-400" />
            </button>
            <button className="glass-card-secondary p-3 hover:bg-white/10 transition-all">
              <Search size={20} className="text-gray-400" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* TASKS SECTION */}
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Sparkles className="text-purple-400" size={24} /> 
                Strategic Objectives
              </h2>
              <p className="text-gray-500 text-sm mt-1 uppercase tracking-wider">
                {tasks.length} Active Operations
              </p>
            </div>
            <button 
              onClick={fetchData} 
              className="glass-card-secondary p-3 hover:bg-white/10 transition-all active:scale-90"
            >
              <RefreshCw size={20} className={loading ? "animate-spin text-purple-400" : "text-gray-400"} />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="glass-card p-12 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
              <p className="text-purple-400 font-semibold animate-pulse uppercase tracking-wider">
                Syncing Strategic Intel...
              </p>
            </div>
          )}

          {/* Tasks Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <AnimatePresence mode='popLayout'>
                {tasks.length > 0 ? (
                  tasks.map((item, index) => {
                    const isWritingTask = item.task.toLowerCase().match(/write|track|list|note|plan|identify|describe/);

                    return (
                      <motion.div
                        key={item.task + index}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } }}
                        className="glass-card p-8 flex flex-col justify-between group h-full relative overflow-hidden"
                      >
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-all duration-500" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all duration-500" />

                        <div className="relative z-10">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-bold text-purple-400 tracking-wider uppercase bg-purple-500/10 px-4 py-2 rounded-xl border border-purple-500/20">
                              {item.domain}
                            </span>
                            <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                              <Zap size={16} className="fill-yellow-400" />
                              <span>+{item.xp} XP</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-semibold text-white/90 leading-relaxed mb-6">
                            {item.task}
                          </h3>

                          {isWritingTask && (
                            <div className="mb-6 relative">
                              <PenLine className="absolute left-4 top-4 text-gray-500 z-10" size={16} />
                              <textarea 
                                className="glass-input pl-12 h-32 text-sm resize-none"
                                placeholder="Log execution details here..."
                                value={writingInputs[index] || ""}
                                onChange={(e) => setWritingInputs({...writingInputs, [index]: e.target.value})}
                              />
                            </div>
                          )}
                        </div>

                        <button 
                          onClick={() => handleComplete(item.domain, item.xp, index)}
                          className="relative z-10 bg-white/95 text-black font-bold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white active:scale-95 uppercase tracking-wider text-sm"
                        >
                          Mark Complete <CheckCircle2 size={18} />
                        </button>
                      </motion.div>
                    );
                  })
                ) : (
                  /* Empty State */
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-16 text-center border-dashed col-span-full flex flex-col items-center justify-center"
                  >
                    <div className="p-6 bg-green-500/10 rounded-full mb-6">
                      <CheckCircle2 className="text-green-400" size={48} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">Mission Accomplished</h3>
                    <p className="text-gray-400 text-base max-w-md mb-8">
                      All daily objectives secured. High-performance state maintained.
                    </p>
                    <button 
                      onClick={fetchData} 
                      className="glass-button px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-transform"
                    >
                      Request Fresh Intel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 bg-red-500/10 border-red-500/20 text-red-400 text-center font-semibold uppercase tracking-wider"
            >
              {error}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-20 text-center text-gray-600 text-xs font-medium tracking-widest uppercase">
          Neural Interface Secured • 2026 Edition
        </p>
      </div>
    </div>
  );
}
