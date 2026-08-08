import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Award, QrCode, Printer } from 'lucide-react';
export const CertificatesPage = () => {
    const { certificates, students, generateCertificate, currentUser } = useAppStore();
    const [selectedCert, setSelectedCert] = useState(certificates[0] || null);

    const canGenerate = currentUser?.role === 'Owner' || currentUser?.role === 'Admin' || currentUser?.role === 'Teacher';

    const handleGenerateNew = () => {
        if (students.length === 0)
            return;
        generateCertificate(students[0], 'Distinction', 94);
    };

    return (<div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            TELA Certificate Generation & Verification
          </h1>
          <p className="text-xs text-slate-400">Official CEFR affiliated gold-embossed merit certificate generator with live QR registry • The European Language Academy (Kaithal)</p>
        </div>

        {canGenerate && (
          <button onClick={handleGenerateNew} className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition">
            <Award className="w-4 h-4"/>
            <span>Generate Certificate</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certificate List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Issued Merit Certificates</h3>
          {certificates.map((cert) => (<div key={cert._id} onClick={() => setSelectedCert(cert)} className={`p-4 rounded-xl border cursor-pointer transition ${selectedCert?._id === cert._id
                ? 'bg-slate-900 border-amber-500 shadow-md shadow-amber-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}>
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-bold text-slate-100">{cert.studentName}</h4>
                <span className="text-[10px] font-mono text-amber-400">{cert.certNumber}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{cert.courseName} Level {cert.level} • {cert.grade}</p>
            </div>))}
        </div>

        {/* Certificate HTML Preview Frame */}
        {selectedCert && (<div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Live Certificate Preview</span>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition">
                <Printer className="w-4 h-4"/> Print / Export PDF
              </button>
            </div>

            {/* Visual Gold Certificate Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-4 border-amber-500/50 p-8 rounded-2xl text-center space-y-4 shadow-2xl relative">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white p-2 flex items-center justify-center text-slate-950 font-black text-xl shadow-xl border border-amber-500/50">
                <img src="/logo.png" alt="TELA Logo" className="w-full h-full object-contain" />
              </div>

              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-amber-400">The European Language Academy</h2>
                <p className="text-[11px] text-slate-300 font-semibold mt-0.5">TELA — Kaithal • Reg. No: TELA-CEFR-2026/881</p>
                <h1 className="text-xl font-serif font-bold text-slate-100 mt-2">Certificate of Language & Academic Merit</h1>
                <p className="text-[11px] text-slate-400 italic">This is to certify that</p>
              </div>

              <h3 className="text-2xl font-bold text-amber-400 underline decoration-cyan-500 decoration-2 underline-offset-4">
                {selectedCert.studentName}
              </h3>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                has successfully completed the curriculum requirements for <strong>{selectedCert.courseName} (Level {selectedCert.level})</strong> with a grade of <strong>{selectedCert.grade} ({selectedCert.scorePercentage}%)</strong>.
              </p>

              <div className="pt-6 flex items-center justify-between border-t border-slate-800 text-[10px] text-slate-400">
                <div className="text-left">
                  <p>Issue Date: {selectedCert.issueDate}</p>
                  <p className="font-mono text-amber-400">Certificate ID: {selectedCert.certNumber}</p>
                  <p className="mt-1 font-bold text-slate-300">Director & Principal (TELA Kaithal)</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <QrCode className="w-8 h-8 text-amber-400"/>
                  <span className="text-[9px] text-slate-400 font-mono text-left">Scan to Verify<br />tela.edu.in/verify</span>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </div>);
};
