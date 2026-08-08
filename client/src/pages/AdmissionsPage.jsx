import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { UserCheck } from 'lucide-react';
export const AdmissionsPage = () => {
    const { leads, convertLeadToStudent, students } = useAppStore();
    const eligibleLeads = leads.filter((l) => l.status !== 'Admission');
    return (<div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Admission & Conversion Hub
          </h1>
          <p className="text-xs text-slate-400">One-click lead-to-student conversion and formal enrollment log</p>
        </div>
      </div>

      {/* Eligible Candidates for Quick Admission */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Candidate Leads Ready for Admission</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eligibleLeads.map((lead) => (<div key={lead._id} className="glass-card p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{lead.name}</h4>
                  <p className="text-xs text-slate-400">{lead.phone}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  {lead.language} {lead.level}
                </span>
              </div>

              <div className="text-xs text-slate-300 flex justify-between">
                <span>Quoted Fee: ₹{(lead.quotedFee || 0).toLocaleString('en-IN')}</span>
                <span className="text-cyan-400">{lead.status} Stage</span>
              </div>

              <button onClick={() => convertLeadToStudent(lead._id)} className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs hover:scale-105 transition flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20">
                <UserCheck className="w-4 h-4"/> Convert to Enrolled Student
              </button>
            </div>))}
        </div>
      </div>
    </div>);
};
