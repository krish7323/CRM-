import React from 'react';
import { useAppStore } from '../store/useAppStore.js';
import { Users, GraduationCap, CircleDollarSign, TrendingUp, ArrowUpRight, Library, BookMarked, HeartHandshake, Video, IndianRupee } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const revenueDataINR = [
  { month: 'Jan', revenue: 1250000, expenses: 850000, profit: 400000 },
  { month: 'Feb', revenue: 1450000, expenses: 900000, profit: 550000 },
  { month: 'Mar', revenue: 1600000, expenses: 920000, profit: 680000 },
  { month: 'Apr', revenue: 1850000, expenses: 980000, profit: 870000 },
  { month: 'May', revenue: 2100000, expenses: 1050000, profit: 1050000 },
  { month: 'Jun', revenue: 2400000, expenses: 1100000, profit: 1300000 },
  { month: 'Jul', revenue: 2750000, expenses: 1180000, profit: 1570000 },
];

const languagePopularity = [
  { name: 'German', count: 48, color: '#06b6d4' },
  { name: 'French', count: 32, color: '#0d9488' },
  { name: 'Spanish', count: 24, color: '#f59e0b' },
  { name: 'English & Speaking', count: 38, color: '#8b5cf6' },
  { name: 'Italian', count: 14, color: '#ec4899' },
  { name: 'Portuguese', count: 9, color: '#3b82f6' },
];

export const DashboardPage = () => {
  const { leads, students, fees, expenses, books, bookIssues, homeworks, scholarships, ptms, currentUser } = useAppStore();

  const totalCollected = fees.reduce((acc, f) => acc + f.paidTotal, 0);
  const totalPending = fees.reduce((acc, f) => acc + f.remainingTotal, 0);
  const totalExp = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalCollected - totalExp;
  const todayFollowups = leads.filter((l) => l.status === 'Follow-up' || l.status === 'New').length;

  const issuedToday = bookIssues.filter((i) => !i.returnDate).length;
  const pendingHw = homeworks.length;
  const upcomingPTMs = ptms.filter((p) => p.status === 'Upcoming').length;
  const totalScholarshipGranted = scholarships
    .filter((s) => s.status === 'Approved')
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
            Welcome back, <span className="text-amber-400">{currentUser.name}</span> 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            The Indian International Academy (IIA) 8-Role Real-Time ERP & CRM Dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">CBSE Academic Term 2026</span>
          </div>
        </div>
      </div>

      {/* Primary Financial & CRM Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enrolled Students</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-100">{students.length}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              Active <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Across German, French, Spanish & English batches</p>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Enquiries</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-100">{leads.length}</span>
            <span className="text-[11px] font-bold text-amber-400">
              {todayFollowups} follow-ups due
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Walk-ins, Google Ads & WhatsApp enquiries</p>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fees Collected (INR)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-100">₹{totalCollected.toLocaleString('en-IN')}</span>
            <span className="text-[11px] font-bold text-emerald-400">UPI / NetBanking</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Pending Dues: ₹{totalPending.toLocaleString('en-IN')}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Surplus / Profit</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-100">₹{netProfit.toLocaleString('en-IN')}</span>
            <span className="text-[11px] font-bold text-purple-400">Net Margin</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Income minus Facility Expenses</p>
        </div>
      </div>

      {/* New Enterprise ERP Module Live Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Books Issued</span>
            <p className="text-lg font-black text-cyan-400 mt-0.5">{issuedToday} Books Out</p>
            <p className="text-[9px] text-slate-500">Total Inventory: {books.length} Titles</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Library className="w-4 h-4" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Homework Assignments</span>
            <p className="text-lg font-black text-amber-400 mt-0.5">{pendingHw} Active</p>
            <p className="text-[9px] text-slate-500">Batch-wise PDF & Video materials</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BookMarked className="w-4 h-4" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upcoming PTMs</span>
            <p className="text-lg font-black text-purple-400 mt-0.5">{upcomingPTMs} Scheduled</p>
            <p className="text-[9px] text-slate-500">Google Meet & Classroom slots</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Video className="w-4 h-4" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scholarships Granted</span>
            <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">₹{totalScholarshipGranted.toLocaleString('en-IN')}</p>
            <p className="text-[9px] text-slate-500">Sibling, Referral & Special Concessions</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <HeartHandshake className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200">IIA Financial Collections & Growth (INR)</h3>
              <p className="text-[11px] text-slate-400">Monthly Revenue vs Operating Costs in ₹</p>
            </div>
            <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">
              Live INR Sync
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueDataINR}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Course & Program Distribution</h3>
            <p className="text-[11px] text-slate-400">Student enrollment across IIA programs</p>
          </div>

          <div className="h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={languagePopularity} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {languagePopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
            {languagePopularity.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
