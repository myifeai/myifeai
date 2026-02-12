"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  TrendingUp,
  ArrowRight,
  Play,
  MoreHorizontal
} from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, trend, color }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass-card-secondary p-6 flex flex-col gap-3"
  >
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-white">{value}</span>
      {trend && (
        <div className="flex items-center gap-1 text-green-400 text-sm">
          <TrendingUp size={14} />
          <span>{trend}</span>
        </div>
      )}
    </div>
    <div className="h-1 bg-white/5 rounded-full mt-2">
      <div className={`h-full ${color} rounded-full`} style={{ width: '70%' }} />
    </div>
  </motion.div>
);

interface VideoRowProps {
  thumbnail: string;
  title: string;
  category: string;
  views: string;
  duration: string;
  chartColor: string;
}

const VideoRow: React.FC<VideoRowProps> = ({ thumbnail, title, category, views, duration, chartColor }) => (
  <motion.div 
    whileHover={{ x: 4 }}
    className="glass-card-secondary p-4 flex items-center gap-4 group cursor-pointer"
  >
    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
      <div className={`w-full h-full bg-gradient-to-br ${thumbnail}`} />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <Play size={24} className="text-white" fill="white" />
      </div>
    </div>
    
    <div className="flex-1">
      <h4 className="text-white font-semibold mb-1">{title}</h4>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-orange-500" />
        <span className="text-xs text-gray-400">{category}</span>
      </div>
    </div>
    
    <div className="flex items-center gap-6">
      <div className="text-center">
        <div className="flex items-center gap-1 text-yellow-400 text-sm mb-1">
          <span>⚡</span>
          <span>{views}</span>
        </div>
        <span className="text-xs text-gray-500">Views</span>
      </div>
      
      <div className="text-center">
        <div className="flex items-center gap-1 text-green-400 text-sm mb-1">
          <span>📊</span>
          <span>{duration}</span>
        </div>
        <span className="text-xs text-gray-500">Duration</span>
      </div>
      
      {/* Mini chart */}
      <div className="w-16 h-8 relative">
        <svg className="w-full h-full" viewBox="0 0 64 32">
          <path
            d="M 0 24 Q 16 16 32 20 T 64 16"
            fill="none"
            stroke={chartColor}
            strokeWidth="2"
            className="opacity-60"
          />
        </svg>
      </div>
      
      <button className="opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal size={20} className="text-gray-400" />
      </button>
    </div>
  </motion.div>
);

export default function GlassmorphismDashboard() {
  const [activeNav, setActiveNav] = useState('analytics');

  const navItems = [
    { id: 'home', icon: Home },
    { id: 'analytics', icon: BarChart3 },
    { id: 'documents', icon: FileText },
    { id: 'tasks', icon: CheckSquare },
    { id: 'media', icon: Image },
    { id: 'help', icon: HelpCircle },
    { id: 'shop', icon: ShoppingBag },
  ];

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
          <div className="w-6 h-6 border-2 border-white rounded-lg" />
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
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center relative">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full" />
            <span className="text-lg">🔔</span>
          </div>
          <button className="w-12 h-12 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center">
            <Settings size={20} />
          </button>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-20 p-8">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Channel Analytics</h1>
          
          <div className="flex items-center gap-4">
            <button className="glass-card-secondary p-3 hover:bg-white/10 transition-all">
              <Mail size={20} className="text-gray-400" />
            </button>
            <button className="glass-card-secondary p-3 hover:bg-white/10 transition-all">
              <Search size={20} className="text-gray-400" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <User size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* HERO CARD - Large Featured */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-12 lg:col-span-8 glass-card-hero p-8 relative overflow-hidden"
          >
            {/* Background Image Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-orange-500/20" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400/30 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="text-xs text-purple-300 uppercase tracking-widest mb-4">Popular Solution</div>
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Optimize<br />Your Metrics
              </h2>
              
              <button className="self-start glass-button px-8 py-4 rounded-2xl font-semibold text-sm hover:scale-105 transition-transform">
                Start Now
              </button>

              {/* Metrics Row */}
              <div className="grid grid-cols-4 gap-4 mt-auto">
                <MetricCard 
                  icon={<User />}
                  label="Users"
                  value="76k"
                  color="bg-blue-400"
                />
                <MetricCard 
                  icon={<BarChart3 />}
                  label="Clicks"
                  value="1.5m"
                  color="bg-pink-400"
                />
                <MetricCard 
                  icon={<TrendingUp />}
                  label="Sales"
                  value="$3.6k"
                  trend="6%"
                  color="bg-green-400"
                />
                <MetricCard 
                  icon={<ShoppingBag />}
                  label="Items"
                  value="47"
                  color="bg-purple-400"
                />
              </div>
            </div>

            {/* Carousel Arrow */}
            <button className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all z-20">
              <ArrowRight size={20} className="text-white" />
            </button>
          </motion.div>

          {/* ACTIVE USERS CHART */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-4 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                Active Users right now 
                <span className="text-green-400">💡</span>
              </h3>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-bold">50</span>
            </div>
            
            {/* Chart Area */}
            <div className="relative h-48 mt-6">
              <svg className="w-full h-full" viewBox="0 0 300 150">
                {/* Grid Lines */}
                <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="90" x2="300" y2="90" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="120" x2="300" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                
                {/* White Line */}
                <path
                  d="M 0 80 Q 30 60 60 70 T 120 50 T 180 60 T 240 40 T 300 50"
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="2"
                />
                
                {/* Yellow Line (Main) */}
                <path
                  d="M 0 100 Q 30 80 60 90 T 120 70 T 180 80 T 240 30 T 300 40"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                />
                
                {/* Highlight Dot */}
                <circle cx="240" cy="30" r="4" fill="#fbbf24">
                  <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
              
              {/* X-axis labels */}
              <div className="flex justify-between mt-4 text-xs text-gray-500">
                <span>Oct</span>
                <span>Mar</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
            </div>
          </motion.div>

          {/* LATEST SALES CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-4 glass-card p-6"
          >
            <h3 className="text-white font-semibold mb-4">Latest Sales</h3>
            
            <div className="flex items-center gap-2 text-sm mb-6">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <span className="text-gray-400">6%</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-bold text-white mb-1">$ 586</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-sm text-gray-400">Your total earnings</span>
              </div>
            </div>

            {/* Mini Chart */}
            <div className="relative h-16">
              <svg className="w-full h-full" viewBox="0 0 200 60">
                <path
                  d="M 0 40 Q 25 30 50 35 T 100 25 T 150 30 T 200 20"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </motion.div>

          {/* PRODUCT SHOWCASE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="col-span-12 lg:col-span-4 glass-card p-6 flex flex-col items-center justify-center"
          >
            <div className="w-40 h-40 mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center">
                <div className="w-20 h-24 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg" />
              </div>
            </div>
            <h4 className="text-white font-semibold text-center">Synthetics backpack</h4>
          </motion.div>

          {/* VIDEO LIST SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-12 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Your top videos in this period</h3>
              
              <select className="glass-card-secondary px-4 py-2 rounded-xl text-sm text-gray-300 bg-transparent border-none outline-none cursor-pointer">
                <option>Popularity</option>
                <option>Recent</option>
                <option>Views</option>
              </select>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 mb-4 text-xs text-gray-500 uppercase tracking-wider">
              <div className="col-span-5">Video</div>
              <div className="col-span-2 text-center">Views</div>
              <div className="col-span-3 text-center">Average view duration</div>
              <div className="col-span-2"></div>
            </div>

            {/* Video Rows */}
            <div className="space-y-3">
              <VideoRow 
                thumbnail="from-orange-400 to-pink-500"
                title="Build An Amazing Back Workout"
                category="Sport Series"
                views="16.3k views"
                duration="13:21 (17.54%)"
                chartColor="#fbbf24"
              />
              <VideoRow 
                thumbnail="from-blue-400 to-purple-500"
                title="How to Train the Muscles at Home"
                category="Sport Series"
                views="16.3k views"
                duration="17:34 (38.64%)"
                chartColor="#22c55e"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
