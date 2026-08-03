import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { FileCheck, ShieldCheck, Upload, Eye, CheckCircle2 } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { students } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          Document Vault & Verification Status
        </h1>
        <p className="text-xs text-slate-400">Manage Aadhaar/Passport ID proof, student photos, visa docs & verification badges</p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Document Type</th>
              <th className="p-4">File Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {students.flatMap((s) =>
              s.documents.map((doc, idx) => (
                <tr key={`${s._id}-${idx}`} className="hover:bg-slate-900/50 transition">
                  <td className="p-4 font-bold text-slate-100">{s.name} ({s.studentId})</td>
                  <td className="p-4 text-slate-300">{doc.type}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800/40">
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => alert(`Viewing document ${doc.type} for ${s.name}`)}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-cyan-400 font-semibold hover:bg-slate-700"
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
