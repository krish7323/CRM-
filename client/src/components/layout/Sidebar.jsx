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
  CalendarCheck,
  Home,
  FileText,
} from 'lucide-react';

const navSections = [
  {
    category: 'DASHBOARD',
    items: [
      {
        title: 'Overview',
        path: '/',
        icon: <LayoutDashboard className="w-4 h-4 text-amber-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Counsellor', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'HR'],
      },
    ],
  },
  {
    category: 'CRM',
    items: [
      {
        title: 'Enquiries & Pipeline',
        path: '/crm',
        icon: <Users className="w-4 h-4 text-cyan-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Counsellor'],
        badge: 'Live',
      },
      {
        title: 'Follow-ups',
        path: '/followups',
        icon: <Calendar className="w-4 h-4 text-emerald-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Counsellor'],
      },
    ],
  },
  {
    category: 'STUDENTS',
    items: [
      {
        title: 'All Students',
        path: '/students',
        icon: <GraduationCap className="w-4 h-4 text-amber-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Counsellor', 'Teacher'],
      },
      {
        title: 'Document Vault',
        path: '/documents',
        icon: <FileCheck className="w-4 h-4 text-purple-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Counsellor'],
      },
    ],
  },
  {
    category: 'ADMISSIONS',
    items: [
      {
        title: 'New Admission & History',
        path: '/admissions',
        icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Counsellor'],
      },
    ],
  },
  {
    category: 'ACADEMICS',
    items: [
      {
        title: 'Programs & Courses',
        path: '/courses',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Counsellor', 'Teacher'],
      },
      {
        title: 'Batches & Timetable',
        path: '/batches',
        icon: <Calendar className="w-4 h-4 text-amber-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Teacher', 'Counsellor'],
      },
      {
        title: 'Attendance Register',
        path: '/attendance',
        icon: <ClipboardCheck className="w-4 h-4 text-emerald-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Teacher'],
      },
      {
        title: 'Exams & Results',
        path: '/exams',
        icon: <FileText className="w-4 h-4 text-rose-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Teacher', 'Counsellor', 'Student', 'Parent'],
      },
      {
        title: 'Academic Calendar',
        path: '/academic-calendar',
        icon: <CalendarCheck className="w-4 h-4 text-cyan-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Counsellor', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'HR', 'Parent', 'Student'],
      },
    ],
  },
  {
    category: 'FINANCE & REPORTS',
    items: [
      {
        title: 'Fee Invoices & Dues',
        path: '/fees',
        icon: <CircleDollarSign className="w-4 h-4 text-emerald-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Accountant', 'Counsellor'],
      },
      {
        title: 'Expenses & P&L',
        path: '/expenses',
        icon: <Receipt className="w-4 h-4 text-rose-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Accountant'],
      },
      {
        title: 'Certificates & QR',
        path: '/certificates',
        icon: <Award className="w-4 h-4 text-amber-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Teacher', 'Counsellor'],
      },
      {
        title: 'Reports & Analytics',
        path: '/reports',
        icon: <BarChart3 className="w-4 h-4 text-teal-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Accountant', 'Counsellor', 'Librarian', 'Transport Manager', 'HR'],
      },
    ],
  },
  {
    category: 'ADMINISTRATION',
    items: [
      {
        title: 'WhatsApp Automation',
        path: '/whatsapp',
        icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'Counsellor'],
      },
      {
        title: 'Staff & Teachers',
        path: '/staff',
        icon: <UserCog className="w-4 h-4 text-cyan-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin', 'HR'],
      },
      {
        title: 'Settings & Security Audit',
        path: '/settings',
        icon: <KeyRound className="w-4 h-4 text-rose-400" />,
        roles: ['Owner', 'Admin', 'Owner/Admin'],
      },
    ],
  },
  {
    category: 'PORTALS',
    items: [
      {
        title: 'Parent Self-Service',
        path: '/parent-portal',
        icon: <Home className="w-4 h-4 text-teal-400" />,
        roles: ['Parent', 'Owner', 'Admin', 'Owner/Admin'],
      },
      {
        title: 'Student Self-Service',
        path: '/student-portal',
        icon: <Compass className="w-4 h-4 text-amber-400" />,
        roles: ['Student', 'Owner', 'Admin', 'Owner/Admin'],
      },
    ],
  },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { activeRole, currentUser } = useAppStore();

  const userRole = currentUser.role || activeRole;
  const isAdminOrOwner = userRole === 'Owner' || userRole === 'Admin' || userRole === 'Owner/Admin';

  const filterItem = (item) => {
    if (isAdminOrOwner) return true;
    return item.roles.includes(userRole);
  };

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Crest */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
        {!collapsed && (
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-xs">
                TELA
              </div>
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-wider text-slate-100 uppercase">TELA ACADEMY</h1>
              <p className="text-[10px] text-amber-400 font-semibold">The European Language Academy • Kaithal</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 mx-auto rounded-xl bg-gradient-to-tr from-amber-500 to-cyan-500 flex items-center justify-center font-bold text-slate-950 text-xs">
            T
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Active Role Banner */}
      {!collapsed && (
        <div className="mx-3 mt-3 p-2 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center space-x-2 text-[11px] text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span className="truncate">Active Role: <strong>{userRole}</strong></span>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {navSections.map((section) => {
          const visibleItems = section.items.filter(filterItem);
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.category} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {section.category}
                </div>
              )}
              {visibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-cyan-500/10 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/10 font-bold'
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
            </div>
          );
        })}
      </nav>

      {/* Footer System Status */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
          <span>TELA Enterprise v6.0</span>
          <span className="flex items-center space-x-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Online</span>
          </span>
        </div>
      )}
    </aside>
  );
};
