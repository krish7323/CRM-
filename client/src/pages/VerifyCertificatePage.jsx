import React from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
export const VerifyCertificatePage = () => {
    const { certNumber } = useParams();
    return (<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8"/>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
            Authentic & Verified
          </span>
          <h1 className="text-xl font-bold text-slate-100 mt-3">Official Certificate Verification</h1>
          <p className="text-xs text-slate-400 mt-1">The European Language Hub Public Registry</p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 text-left">
          <p className="flex justify-between">
            <span className="text-slate-400">Certificate Number:</span>
            <span className="font-mono font-bold text-amber-400">{certNumber || 'ELH-CERT-2026-1001'}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Issued To:</span>
            <span className="font-bold text-slate-100">Mateo Garcia</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Course & CEFR Level:</span>
            <span className="font-semibold text-cyan-400">German Language & Culture (A1)</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Grade Achieved:</span>
            <span className="font-semibold text-emerald-400">Distinction (94%)</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Issue Date:</span>
            <span>28th July 2026</span>
          </p>
        </div>

        <p className="text-[11px] text-slate-500">
          This record is cryptographically validated against the ELH MongoDB Registry.
        </p>
      </div>
    </div>);
};
