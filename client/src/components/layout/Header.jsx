import React from 'react';
import { useAppStore } from '../../store/useAppStore.js';
import { ALL_ROLES } from '../../types/index.js';
import { Sun, Moon, Sparkles, Bell, Globe, Shield, LogOut, Lock, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { theme, setTheme, activeRole, setActiveRole, toggleAiDrawer, currentUser, logoutUser } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isOwnerOrAdmin = currentUser.role === 'Owner' || currentUser.role === 'Admin';

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between transition-colors font-sans">
      {/* Brand Indicator */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-full px-3 py-1 text-xs">
          <Globe className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-slate-300 font-medium hidden sm:inline">The Indian International Academy</span>
          <span className="text-amber-400 font-bold">• IIA 10-Role ERP</span>
        </div>
      </div>

      {/* Right Control Panel */}
      <div className="flex items-center space-x-3">
        {/* Role Switcher */}
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800/90 rounded-xl px-2.5 py-1">
          {isOwnerOrAdmin ? (
            <>
              {currentUser.role === 'Owner' ? (
                <Crown className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="text-xs text-slate-400 font-medium hidden md:inline">Test View:</span>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
                className="bg-transparent text-xs font-semibold text-amber-400 focus:outline-none cursor-pointer"
              >
                {ALL_ROLES.map((role) => (
                  <option key={role} value={role} className="bg-slate-900 text-slate-200">
                    {role}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-slate-400 font-medium hidden md:inline">Role:</span>
              <span className="text-xs font-bold text-amber-400">{currentUser.role}</span>
            </>
          )}
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={toggleAiDrawer}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">IIA AI</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
          </button>
        </div>

        {/* Active User Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full border border-amber-500/40 object-cover"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-none">{currentUser.name}</p>
            <p className="text-[10px] text-amber-400 font-medium leading-tight mt-0.5">{currentUser.role}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-400 hover:bg-rose-900 hover:text-rose-200 transition ml-1"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
