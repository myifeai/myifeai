"use client";

import DailyPlan from "@/components/Dashboard";
import { motion } from "framer-motion";
import { Crown, Zap, Activity } from "lucide-react";

export default function Page() {
  return (
    <main className="relative min-h-screen text-white">
      {/* Ambient glows */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-12 flex flex-col md:flex-row justify-between gap-6"
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl">
              <Crown />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">
                Life <span className="text-purple-400">CEO</span>
              </h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">
                High Performance Mode
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="glass-card-secondary p-5 text-center">
              <Zap className="mx-auto text-yellow-400 mb-1" size={18} />
              <div className="text-xl font-black">92%</div>
              <div className="text-xs text-gray-400 uppercase">Focus</div>
            </div>
            <div className="glass-card-secondary p-5 text-center">
              <Activity className="mx-auto text-blue-400 mb-1" size={18} />
              <div className="text-xl font-black">CEO</div>
              <div className="text-xs text-gray-400 uppercase">Rank</div>
            </div>
          </div>
        </motion.div>

        <DailyPlan />

        <p className="mt-20 text-center text-gray-600 text-xs tracking-widest uppercase">
          Neural Interface Secured • 2026 Edition
        </p>
      </div>
    </main>
  );
}
