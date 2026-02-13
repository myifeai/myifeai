"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  CheckCircle2,
  PenLine,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface Task {
  domain: string;
  task: string;
  xp: number;
}

export default function DailyPlan() {
  const { getToken } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [writingInputs, setWritingInputs] = useState<Record<number, string>>(
    {}
  );

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();

    try {
      const token = await getToken();

      if (!token) throw new Error("Auth token unavailable");

      const [planRes, profileRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/generate-plan`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }),
        fetch(`${BACKEND_URL}/api/get-profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }),
      ]);

      if (!planRes.ok || !profileRes.ok) {
        throw new Error("Backend unavailable");
      }

      const planData = await planRes.json();
      const profileData = await profileRes.json();

      setTasks(planData.tasks ?? []);
      setTotalXp(profileData.xp_points ?? 0);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError("AI Engine offline. Tactical pause initiated.");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [BACKEND_URL, getToken]);

  const handleComplete = async (
    domain: string,
    xpPoints: number,
    index: number
  ) => {
    try {
      const token = await getToken();
      if (!token) return;

      const note = writingInputs[index] || "";

      const res = await fetch(`${BACKEND_URL}/api/complete-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ domain, xpPoints, note }),
      });

      if (!res.ok) return;

      setTasks((prev) => prev.filter((_, i) => i !== index));
      setTotalXp((prev) => prev + xpPoints);

      setWritingInputs((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } catch (err) {
      console.error("Failed to sync progress:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-14 h-14 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-purple-400 font-bold tracking-widest uppercase animate-pulse">
          Syncing Strategic Intel...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Sparkles className="text-purple-400" size={22} />
            Strategic Objectives
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            Active Operations
          </p>
        </div>

        <button
          onClick={fetchData}
          className="glass-card-secondary p-3 hover:bg-white/10 active:scale-90 transition-all"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {tasks.length > 0 ? (
            tasks.map((item, index) => {
              const isWritingTask = /write|track|list|note|plan|identify|describe/i.test(
                item.task
              );

              return (
                <motion.div
                  key={`${item.domain}-${item.task}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card p-8 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -z-10" />

                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black tracking-widest uppercase text-purple-400 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20">
                        {item.domain}
                      </span>
                      <div className="flex items-center gap-1 text-blue-400 text-xs font-bold">
                        <TrendingUp size={14} /> +{item.xp} XP
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white/90 leading-relaxed mb-6">
                      {item.task}
                    </h3>

                    {isWritingTask && (
                      <div className="relative mb-6">
                        <PenLine
                          size={16}
                          className="absolute left-4 top-4 text-gray-500"
                        />
                        <textarea
                          className="glass-input pl-12 h-28 text-sm resize-none"
                          placeholder="Log execution details..."
                          value={writingInputs[index] || ""}
                          onChange={(e) =>
                            setWritingInputs((prev) => ({
                              ...prev,
                              [index]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handleComplete(item.domain, item.xp, index)
                    }
                    className="btn-action w-full"
                  >
                    Mark Complete <CheckCircle2 size={16} />
                  </button>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card col-span-full p-16 text-center"
            >
              <CheckCircle2
                size={42}
                className="mx-auto mb-4 text-green-400"
              />
              <h3 className="text-2xl font-black uppercase mb-2">
                Mission Accomplished
              </h3>
              <p className="text-gray-400 text-sm mb-8">
                All objectives completed. High-performance state maintained.
              </p>
              <button
                onClick={fetchData}
                className="text-purple-400 hover:text-white font-bold text-xs uppercase tracking-widest"
              >
                Request Fresh Intel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="glass-card p-4 text-center text-red-400 text-xs font-bold uppercase tracking-widest">
          {error}
        </div>
      )}
    </div>
  );
}
