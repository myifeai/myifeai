"use client";

import DailyPlan from '../components/Dashboard';
import { motion } from 'framer-motion';
import { Crown, Target } from 'lucide-react';

export default function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#050510] text-white font-sans">
      {/* 1. THE GLOW BEHIND THE GLASS */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[0%] h-[400px] w-[400px] rounded-full bg-blue-600/15 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* 2. TOP COMMAND HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-lg opacity-40 animate-pulse" />
              <div className="relative p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl border border-white/20">
                <Crown size={28} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">
                Life <span className="text-purple-500">CEO</span> Intel
              </h1>
              <p className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase">Status: Operational</p>
            </div>
          </div>

          <div className="flex gap-4">
             <div className="flex flex-col items-center px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] text-gray-500 font-bold uppercase">System Rank</span>
                <span className="text-lg font-black text-blue-400">EXECUTIVE</span>
             </div>
             <div className="flex flex-col items-center px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Focus Score</span>
                <span className="text-lg font-black text-purple-400">92%</span>
             </div>
          </div>
        </motion.div>

        {/* 3. MAIN DASHBOARD CONTENT */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DailyPlan />
        </motion.div>

        {/* 4. SUBTLE FOOTER */}
        <p className="mt-12 text-center text-gray-600 text-[10px] font-bold tracking-widest uppercase">
          Neural Interface Secured • 2026 Edition
        </p>
      </div>
    </main>
  );
}