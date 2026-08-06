import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import { Lock, Mail, Shield, ArrowRight, Eye, EyeOff, AlertTriangle, Crown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const LoginPage = () => {
  const { users, loginUser } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [emailOrPhone, setEmailOrPhone] = useState('owner@elh.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = loginUser(emailOrPhone, password);
      setIsLoading(false);

      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMsg(res.message || 'Invalid credentials');
      }
    }, 400);
  };

  const fillQuickCredentials = (emailVal) => {
    setEmailOrPhone(emailVal);
    setPassword('password123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl glass-panel border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 relative z-10">
        
        {/* Left Side: Indian International Academy Branding */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-teal-500 to-cyan-500 p-0.5 shadow-xl shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-400 text-base">
                  IIA
                </div>
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-wider text-slate-100 uppercase">The Indian International Academy</h1>
                <p className="text-xs text-amber-400 font-semibold">10-Role Enterprise ERP Suite</p>
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-100 leading-tight">
              Enterprise Access & Operations Sign In
            </h2>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Role-based access enforced across 10 enterprise roles: <strong>Owner</strong>, <strong>Admin</strong>, <strong>Counsellor</strong>, <strong>Teacher</strong>, <strong>Accountant</strong>, <strong>Librarian</strong>, <strong>Transport Manager</strong>, <strong>HR</strong>, <strong>Parent</strong>, and <strong>Student</strong>.
            </p>
          </div>

          {/* Quick Roster Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> IIA 10-Role Quick Test Accounts
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => fillQuickCredentials(u.email)}
                  className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left transition flex items-center justify-between group"
                >
                  <div className="truncate">
                    <p className="text-[9px] font-bold text-slate-200 group-hover:text-amber-300 truncate">{u.name.split(' ')[0]}</p>
                    <p className="text-[8px] text-amber-400 font-semibold truncate">{u.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 flex flex-col justify-center bg-slate-950/60">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-100">Sign In</h3>
            <p className="text-xs text-slate-400">Enter your assigned Email/ID and Password</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-400">Login ID / Email Address</label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  placeholder="owner@elh.edu"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Password</label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Authenticate Credentials</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
