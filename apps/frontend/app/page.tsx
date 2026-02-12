"use client";

import DailyPlan from '../components/Dashboard';
import { motion } from 'framer-motion';
import { Zap, Trophy, Crown } from 'lucide-react';

export default function Page() {
  // We can track this from your database later, for now let's set a visual goal
  const currentXP = 60; 
  const nextLevelXP = 100;
  const progressPercent = (currentXP / nextLevelXP) * 100;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 md:py-12">
      {/* 1. ANIMATED AMBIENT BACKGROUND (The "Stage 1" Glow) */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a1a]">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-4xl">
        {/* 2. DYNAMIC HEADER SECTION */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-8 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg shadow-orange-500/20">
              <Crown className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                LIFE <span className="text-blue-500">CEO</span>
              </h1>
              <p className="text-gray-400 text-sm font-medium">Lvl 1 • Executive Strategist</p>
            </div>
          </div>

          {/* 3. XP PROGRESS BAR (The Interactive Element) */}
          <div className="w-full md:w-64">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Growth Progress</span>
              <span className="text-xs font-bold text-purple-400">{currentXP}/{nextLevelXP} XP</span>
            </div>
            <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-600 to-blue-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              />
            </div>
          </div>
        </motion.header>

        {/* 4. MAIN CONTENT AREA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DailyPlan />
        </motion.section>

        {/* 5. FOOTER STATS (Quick Wins) */}
        <footer className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 flex items-center gap-3">
            <Zap className="text-yellow-400" size={20} />
            <span className="text-sm font-semibold">3 Streak</span>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <Trophy className="text-blue-400" size={20} />
            <span className="text-sm font-semibold">12 Tasks</span>
          </div>
        </footer>
      </div>
    </main>
  );
}