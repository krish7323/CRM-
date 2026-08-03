import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  CircleDollarSign,
  Receipt,
  MessageSquare,
  FileCheck,
  Award,
  UserCog,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Compass,
  KeyRound,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard className="w-4 h-4" />,
    roles: ['Admin', 'Counsellor', 'Teacher'],
  },
  {
    title: 'CRM & Leads',
    path: '/crm',
    icon: <Users className="w-4 h-4" />,
    roles: ['Admin', 'Counsellor'],
    badge: 'Live',
  },
  {
    title: 'Follow-ups',
    path: '/followups',
    icon: <Calendar className="w-4 h-4" />,
    roles: ['Admin', 'Counsellor'],
  },
  {
    title: 'Students',
    path: '/students',
    icon: <GraduationCap className="w-4 h-4" />,
    roles: ['Admin', 'Counsellor', 'Teacher'],
  },
  {
    title: 'Admissions',
    path: '/admissions',
    icon: <UserCheck className="w-4 h-4" />,
    roles: ['Admin', 'Counsellor'],
  },
  {
    title: 'Courses & Curriculum',
    path: '/courses',
    icon: <BookOpen className="w-4 h-4" />,
    roles: ['Admin', 'Counsellor', 'Teacher'],
  },
  {
    title: 'Batches & Timetable',
    path: '/batches',
    icon: <Calendar className="w-4 h-4" />,
    roles: ['Admin', 'Teacher'],
  },
  {
    title: 'Attendance Register',
    path: '/attendance',
    icon: <ClipboardCheck className="w-4 h-4" />,
    roles: ['Admin', 'Teacher'],
  },
  {
    title: 'Fees & UPI Receipts',
    path: '/fees',
    icon: <CircleDollarSign className="w-4 h-4" />,
    roles: ['Admin'],
  },
  {
    title: 'Expenses & P&L',
    path: '/expenses',
    icon: <Receipt className="w-4 h-4" />,
    roles: ['Admin'],
  },
  {
    title: 'WhatsApp Hub',
    path: '/whatsapp',
    icon: <MessageSquare className="w-4 h-4" />,
    roles: ['Admin', 'Counsellor'],
  },
  {
    title: 'Aadhaar / Doc Vault',
    path: '/documents',
    icon: <FileCheck className="w-4 h-4" />,
    roles: ['Admin'],
  },
  {
    title: 'Certificates',
    path: '/certificates',
    icon: <Award className="w-4 h-4" />,
    roles: ['Admin', 'Teacher'],
  },
  {
    title: 'Staff Management',
    path: '/staff',
    icon: <UserCog className="w-4 h-4" />,
    roles: ['Admin'],
  },
  {
    title: 'User Setup & Access',
    path: '/settings',
    icon: <KeyRound className="w-4 h-4 text-amber-400" />,
    roles: ['Admin'],
    badge: 'Admin',
  },
  {
    title: 'Reports & Analytics',
    path: '/reports',
    icon: <BarChart3 className="w-4 h-4" />,
    roles: ['Admin'],
  },
  {
    title: 'Student Portal',
    path: '/student-portal',
    icon: <Compass className="w-4 h-4" />,
    roles: ['Student', 'Admin'],
    badge: 'Portal',
  },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { activeRole } = useAppStore();

  const allowedNav = navItems.filter((item) => item.roles.includes(activeRole));

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header Brand Crest */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
        {!collapsed && (
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-xs">
                IIA
              </div>
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-wider text-slate-100 uppercase">Indian Academy</h1>
              <p className="text-[10px] text-amber-400 font-semibold">School System</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 mx-auto rounded-xl bg-gradient-to-tr from-amber-500 to-cyan-500 flex items-center justify-center font-bold text-slate-950 text-xs">
            I
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Notice Banner */}
      {!collapsed && (
        <div className="mx-3 mt-3 p-2 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center space-x-2 text-[11px] text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span className="truncate">Active Role: <strong>{activeRole}</strong></span>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {allowedNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-cyan-500/10 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`
            }
            title={collapsed ? item.title : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="ml-3 font-semibold truncate">{item.title}</span>}

            {!collapsed && item.badge && (
              <span className="ml-auto text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer System Status */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
          <span>IIA School v3.0</span>
          <span className="flex items-center space-x-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Online</span>
          </span>
        </div>
      )}
    </aside>
  );
};
