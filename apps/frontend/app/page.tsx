"use client";

import DailyPlan from '../components/Dashboard';
import { motion } from 'framer-motion';
import { Crown, Zap, Activity } from 'lucide-react';

export default function Page() {
  return (
    <main className="relative min-h-screen w-full bg-[#020617] text-white">
      {/* 1. AMBIENT BACKGROUND GLOWS - Vital for the Glass Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-5xl px-6 py-12">
        {/* 2. COMMAND HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl shadow-lg shadow-purple-500/20">
              <Crown size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Life <span className="text-purple-500">CEO</span></h1>
              <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">Status: High Performance</p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
             <div className="flex-1 md:w-32 glass-card p-4 bg-white/5 border-none flex flex-col items-center">
                <Zap size={16} className="text-yellow-400 mb-1" />
                <span className="text-[10px] text-gray-400 font-bold uppercase">Focus</span>
                <span className="text-xl font-black text-white">92%</span>
             </div>
             <div className="flex-1 md:w-32 glass-card p-4 bg-white/5 border-none flex flex-col items-center">
                <Activity size={16} className="text-blue-400 mb-1" />
                <span className="text-[10px] text-gray-400 font-bold uppercase">Rank</span>
                <span className="text-xl font-black text-white">CEO</span>
             </div>
          </div>
        </motion.div>

        {/* 3. DASHBOARD */}
        <DailyPlan />

        <p className="mt-20 text-center text-gray-600 text-[10px] font-bold tracking-[0.4em] uppercase">
          Neural Interface Secured • 2026 Edition
        </p>
      </div>
    </main>
  );
}