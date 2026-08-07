import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore.js';
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
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Compass,
  KeyRound,
  Library,
  BookMarked,
  HeartHandshake,
  Video,
  Bus,
  Package,
  Bell,
  MessageCircle,
  CalendarCheck,
  Home,
  FileText,
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Counsellor', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'HR', 'Parent', 'Student'],
  },
  {
    title: 'CRM & Leads',
    path: '/crm',
    icon: <Users className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Counsellor'],
    badge: 'Live',
  },
  {
    title: 'Follow-ups',
    path: '/followups',
    icon: <Calendar className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Counsellor'],
  },
  {
    title: 'Students',
    path: '/students',
    icon: <GraduationCap className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Counsellor', 'Teacher'],
  },
  {
    title: 'Admissions',
    path: '/admissions',
    icon: <UserCheck className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Counsellor'],
  },
  {
    title: 'Courses & Curriculum',
    path: '/courses',
    icon: <BookOpen className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Counsellor', 'Teacher'],
  },
  {
    title: 'Batches & Timetable',
    path: '/batches',
    icon: <Calendar className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Teacher', 'Counsellor'],
  },
  {
    title: 'Attendance Register',
    path: '/attendance',
    icon: <ClipboardCheck className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Teacher'],
  },
  {
    title: 'Exams & Results',
    path: '/exams',
    icon: <FileText className="w-4 h-4 text-rose-400" />,
    roles: ['Owner', 'Admin', 'Teacher', 'Student', 'Parent'],
    badge: 'Module 5',
  },
  {
    title: 'Academic Calendar',
    path: '/academic-calendar',
    icon: <CalendarCheck className="w-4 h-4 text-cyan-400" />,
    roles: ['Owner', 'Admin', 'Counsellor', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'HR', 'Parent', 'Student'],
    badge: 'Module 6',
  },
  {
    title: 'Transport ERP',
    path: '/transport',
    icon: <Bus className="w-4 h-4 text-amber-400" />,
    roles: ['Owner', 'Admin', 'Transport Manager', 'Parent', 'Student'],
    badge: 'Module 7',
  },
  {
    title: 'Inventory & Assets',
    path: '/inventory',
    icon: <Package className="w-4 h-4 text-teal-400" />,
    roles: ['Owner', 'Admin', 'Librarian'],
    badge: 'Module 8',
  },
  {
    title: 'Digital Library',
    path: '/library',
    icon: <Library className="w-4 h-4 text-cyan-400" />,
    roles: ['Owner', 'Admin', 'Librarian', 'Teacher', 'Student'],
  },
  {
    title: 'Homework & Assignments',
    path: '/homework',
    icon: <BookMarked className="w-4 h-4 text-amber-400" />,
    roles: ['Owner', 'Admin', 'Teacher', 'Student', 'Parent'],
  },
  {
    title: 'Scholarships & Discounts',
    path: '/scholarships',
    icon: <HeartHandshake className="w-4 h-4 text-emerald-400" />,
    roles: ['Owner', 'Admin', 'Accountant'],
  },
  {
    title: 'Parent Teacher Meetings',
    path: '/ptm',
    icon: <Video className="w-4 h-4 text-purple-400" />,
    roles: ['Owner', 'Admin', 'Teacher', 'Parent'],
  },
  {
    title: 'Notice Board',
    path: '/notices',
    icon: <Bell className="w-4 h-4 text-amber-400" />,
    roles: ['Owner', 'Admin', 'Counsellor', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'HR', 'Parent', 'Student'],
    badge: 'Module 9',
  },
  {
    title: 'Internal Chat',
    path: '/chat',
    icon: <MessageCircle className="w-4 h-4 text-indigo-400" />,
    roles: ['Owner', 'Admin', 'Counsellor', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'HR', 'Parent', 'Student'],
    badge: 'Module 10',
  },
  {
    title: 'Leave Management',
    path: '/leaves',
    icon: <UserCog className="w-4 h-4 text-emerald-400" />,
    roles: ['Owner', 'Admin', 'HR', 'Teacher'],
    badge: 'Module 11',
  },
  {
    title: 'Fees & Invoices',
    path: '/fees',
    icon: <CircleDollarSign className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Accountant'],
  },
  {
    title: 'Expenses & P&L',
    path: '/expenses',
    icon: <Receipt className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Accountant'],
  },
  {
    title: 'WhatsApp Hub',
    path: '/whatsapp',
    icon: <MessageSquare className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Counsellor'],
  },
  {
    title: 'Aadhaar / Doc Vault',
    path: '/documents',
    icon: <FileCheck className="w-4 h-4" />,
    roles: ['Owner', 'Admin'],
  },
  {
    title: 'Certificates',
    path: '/certificates',
    icon: <Award className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Teacher', 'Student', 'Parent'],
  },
  {
    title: 'Staff & Teachers',
    path: '/staff',
    icon: <UserCog className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'HR'],
  },
  {
    title: 'System Settings & Audit',
    path: '/settings',
    icon: <KeyRound className="w-4 h-4 text-amber-400" />,
    roles: ['Owner', 'Admin'],
    badge: 'Admin',
  },
  {
    title: 'Reports & Analytics',
    path: '/reports',
    icon: <BarChart3 className="w-4 h-4" />,
    roles: ['Owner', 'Admin', 'Accountant', 'Librarian', 'Transport Manager', 'HR'],
  },
  {
    title: 'Parent Portal',
    path: '/parent-portal',
    icon: <Home className="w-4 h-4 text-teal-400" />,
    roles: ['Parent', 'Owner', 'Admin'],
    badge: 'Parent',
  },
  {
    title: 'Student Portal',
    path: '/student-portal',
    icon: <Compass className="w-4 h-4 text-amber-400" />,
    roles: ['Student', 'Owner', 'Admin'],
    badge: 'Student',
  },
];

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { activeRole } = useAppStore();

  const allowedNav = navItems.filter((item) => item.roles.includes(activeRole));

  const sidebarContent = (
    <div className="flex flex-col h-full w-full">
      {/* Brand Crest */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
        {(!collapsed || isMobileOpen) && (
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-xs">
                IIA
              </div>
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-wider text-slate-100 uppercase">Indian Academy</h1>
              <p className="text-[10px] text-amber-400 font-semibold">10-Role ERP Engine</p>
            </div>
          </div>
        )}
        {collapsed && !isMobileOpen && (
          <div className="w-8 h-8 mx-auto rounded-xl bg-gradient-to-tr from-amber-500 to-cyan-500 flex items-center justify-center font-bold text-slate-950 text-xs">
            I
          </div>
        )}

        <div className="flex items-center space-x-1">
          {isMobileOpen ? (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100"
            >
              ✕
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Role Notice Banner */}
      {(!collapsed || isMobileOpen) && (
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
            onClick={() => isMobileOpen && onCloseMobile && onCloseMobile()}
            className={({ isActive }) =>
              `group relative flex items-center rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-cyan-500/10 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`
            }
            title={collapsed && !isMobileOpen ? item.title : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {(!collapsed || isMobileOpen) && <span className="ml-3 font-semibold truncate">{item.title}</span>}

            {(!collapsed || isMobileOpen) && item.badge && (
              <span className="ml-auto text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer System Status */}
      {(!collapsed || isMobileOpen) && (
        <div className="p-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
          <span>IIA Enterprise v6.0</span>
          <span className="flex items-center space-x-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Online</span>
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex relative z-20 flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative z-50 w-72 max-w-[85vw] h-full bg-slate-950 border-r border-slate-800 shadow-2xl flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
