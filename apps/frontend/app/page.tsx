"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import Dashboard from "@/components/Dashboard";

// 1. Update this interface to match what Dashboard now expects
interface ProfileData {
  xp_points: number;
  scores: { domain: string; score: number }[];
}

export default function Home() {
  // 2. Initialize with an empty scores array
  const [profile, setProfile] = useState<ProfileData>({ 
    xp_points: 0, 
    scores: [] 
  });
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const BACKEND_URL = 'https://myifeai.vercel.app';

  const fetchProfile = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Ensure data has scores or fallback to empty array
      setProfile({
        xp_points: data.xp_points || 0,
        scores: data.scores || []
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchProfile();
    // Listen for the custom event we created in handleComplete
    window.addEventListener('xpUpdated', fetchProfile);
    return () => window.removeEventListener('xpUpdated', fetchProfile);
  }, [fetchProfile]);

  if (loading) return null; // Or a loading spinner

  // This will now work because 'profile' contains 'scores'
  return <Dashboard profile={profile} />;
}