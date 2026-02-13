"use client";
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import Dashboard from '../components/Dashboard';

export default function Page() {
  const [profile, setProfile] = useState({ xp_points: 0 });
  const { getToken } = useAuth();

  const fetchProfile = useCallback(async () => {
    const token = await getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setProfile(data);
  }, [getToken]);

  useEffect(() => {
    fetchProfile();

    // Listen for completion events from the child component
    window.addEventListener('xpUpdated', fetchProfile);
    return () => window.removeEventListener('xpUpdated', fetchProfile);
  }, [fetchProfile]);

  return <Dashboard profile={profile} />;
}