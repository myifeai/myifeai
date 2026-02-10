"use client";

import DailyPlan from '../components/Dashboard';

// Check this line! It MUST have "default"
export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto">
        <h1 className="text-4xl font-black text-center mb-10 text-gray-900">
          LIFE <span className="text-blue-600">CEO</span>
        </h1>
        
        <DailyPlan />
      </div>
    </main>
  );
}