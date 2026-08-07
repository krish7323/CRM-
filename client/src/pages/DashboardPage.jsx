import React from 'react';
import { useAppStore } from '../store/useAppStore.js';
import { Users, GraduationCap, CircleDollarSign, TrendingUp, ArrowUpRight, Library, BookMarked, HeartHandshake, Video, Bus, Package, UserCog, CalendarCheck } from 'lucide-react';
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
  const { leads, students, fees, expenses, books, bookIssues, homeworks, scholarships, ptms, currentUser, batches, transportRoutes, assets, leaveRequests } = useAppStore();

  const role = currentUser.role;
  const isOwnerOrAdmin = role === 'Owner' || role === 'Admin';

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
            {isOwnerOrAdmin
              ? 'The Indian International Academy (IIA) Enterprise ERP & CRM Dashboard.'
              : `Role-Scoped ${role} Access Dashboard — Customized View`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">Role: {role}</span>
          </div>
        </div>
      </div>

      {/* STUDENT / PARENT DASHBOARD */}
      {(role === 'Student' || role === 'Parent') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">My Enrolled Course</span>
              <p className="text-xl font-bold text-amber-400 mt-2">German Language (A1)</p>
              <p className="text-[10px] text-slate-500 mt-1">Batch Code: GER-A1-B01</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Live Attendance Rate</span>
              <p className="text-xl font-bold text-emerald-400 mt-2">94.2% Present</p>
              <p className="text-[10px] text-slate-500 mt-1">16 Classes Attended</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Pending Homework</span>
              <p className="text-xl font-bold text-cyan-400 mt-2">{pendingHw} Assignment(s)</p>
              <p className="text-[10px] text-slate-500 mt-1">Submit via Homework tab</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Library Books Out</span>
              <p className="text-xl font-bold text-purple-400 mt-2">{issuedToday} Book(s)</p>
              <p className="text-[10px] text-slate-500 mt-1">DueDate: 15th August</p>
            </div>
          </div>
        </div>
      )}

      {/* TEACHER DASHBOARD */}
      {role === 'Teacher' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Active Batches</span>
              <p className="text-2xl font-black text-amber-400 mt-2">{batches.length}</p>
              <p className="text-[10px] text-slate-500 mt-1">German & French Language Classes</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Students</span>
              <p className="text-2xl font-black text-emerald-400 mt-2">{students.length}</p>
              <p className="text-[10px] text-slate-500 mt-1">Enrolled across faculty batches</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Pending Homeworks</span>
              <p className="text-2xl font-black text-cyan-400 mt-2">{pendingHw}</p>
              <p className="text-[10px] text-slate-500 mt-1">Assignments ready for evaluation</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Upcoming PTMs</span>
              <p className="text-2xl font-black text-purple-400 mt-2">{upcomingPTMs}</p>
              <p className="text-[10px] text-slate-500 mt-1">Parent meetings scheduled</p>
            </div>
          </div>
        </div>
      )}

      {/* COUNSELLOR DASHBOARD */}
      {role === 'Counsellor' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Inquiries</span>
              <p className="text-2xl font-black text-amber-400 mt-2">{leads.length}</p>
              <p className="text-[10px] text-slate-500 mt-1">Walk-ins & Online Portal leads</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Follow-ups Due</span>
              <p className="text-2xl font-black text-cyan-400 mt-2">{todayFollowups}</p>
              <p className="text-[10px] text-slate-500 mt-1">Scheduled candidate calls</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Enrolled Students</span>
              <p className="text-2xl font-black text-emerald-400 mt-2">{students.length}</p>
              <p className="text-[10px] text-slate-500 mt-1">Successfully converted leads</p>
            </div>
          </div>
        </div>
      )}

      {/* ACCOUNTANT / FINANCIAL DASHBOARD */}
      {(role === 'Accountant' || isOwnerOrAdmin) && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
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
              <p className="text-[10px] text-slate-500 mt-1">Enrolled Students</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inquiries</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-100">{leads.length}</span>
                <span className="text-[11px] font-bold text-amber-400">{todayFollowups} due</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Active CRM pipeline</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fees Collected</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CircleDollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-100">₹{totalCollected.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Pending: ₹{totalPending.toLocaleString('en-IN')}</p>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Margin</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-100">₹{netProfit.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Net Operating Profit</p>
            </div>
          </div>

          {/* Visual Charts Grid for Financial Roles */}
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
                <h3 className="text-sm font-bold text-slate-200">Course Distribution</h3>
                <p className="text-[11px] text-slate-400">Student enrollment breakdown</p>
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
        </>
      )}
    </div>
  );
};

