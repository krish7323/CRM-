import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const RoleGuard = ({ allowedRoles, children }) => {
    const { currentUser } = useAppStore();
    const navigate = useNavigate();
    const isAllowed = allowedRoles.includes(currentUser.role);
    if (!isAllowed) {
        return (<div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-panel border border-rose-800/60 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center">
            <Lock className="w-7 h-7"/>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-800/60">
              Access Restricted
            </span>
            <h2 className="text-lg font-bold text-slate-100 mt-3">Unauthorized Role Access</h2>
            <p className="text-xs text-slate-400 mt-1">
              Your account <strong>{currentUser.name}</strong> is assigned the role <strong>{currentUser.role}</strong> by the Institute Owner.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            This module requires one of the following Owner-assigned roles:
            <div className="flex flex-wrap justify-center gap-1 mt-1.5 font-semibold text-cyan-400">
              {allowedRoles.map((r) => (<span key={r} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {r}
                </span>))}
            </div>
          </div>

          <button onClick={() => navigate('/')} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4"/> Return to My Dashboard
          </button>
        </div>
      </div>);
    }
    return <>{children}</>;
};
