"use client";

import DailyPlan from '../components/Dashboard';
import { motion } from 'framer-motion';
import { Crown, Zap, Activity } from 'lucide-react';

export default function Page() {
  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-[#1a1625] via-[#2d1b2e] to-[#1a1625] text-white">
      {/* Enhanced Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-orange-500/15 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-12">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl shadow-lg shadow-purple-500/30">
              <Crown size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">
                Life <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">CEO</span>
              </h1>
              <p className="text-gray-400 text-xs font-bold tracking-[0.3em] uppercase mt-2">
                Status: High Performance Mode
              </p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-36 glass-card-secondary p-5 flex flex-col items-center">
              <Zap size={20} className="text-yellow-400 mb-2" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Focus</span>
              <span className="text-2xl font-black text-white mt-1">92%</span>
            </div>
            <div className="flex-1 md:w-36 glass-card-secondary p-5 flex flex-col items-center">
              <Activity size={20} className="text-blue-400 mb-2" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Rank</span>
              <span className="text-2xl font-black text-white mt-1">CEO</span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard */}
        <DailyPlan />

        <p className="mt-20 text-center text-gray-600 text-xs font-bold tracking-[0.4em] uppercase">
          Neural Interface Secured • 2026 Edition
        </p>
      </div>
    </main>
  );
}
