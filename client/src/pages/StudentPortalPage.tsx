import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { GraduationCap, Calendar, Clock, BookOpen, CircleDollarSign, Download, CheckCircle } from 'lucide-react';

export const StudentPortalPage: React.FC = () => {
  const { students, fees, certificates } = useAppStore();
  const currentStudent = students[0];
  const studentFee = fees.find((f) => f.studentId === currentStudent?._id) || fees[0];

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentStudent?.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
            alt="Student"
            className="w-14 h-14 rounded-2xl border-2 border-cyan-500/40 object-cover"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-100">Willkommen, {currentStudent?.name}!</h1>
            <p className="text-xs text-cyan-400 font-mono">ID: {currentStudent?.studentId} • Batch: {currentStudent?.batchCode}</p>
          </div>
        </div>

        <div className="flex gap-3 text-xs">
          <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Attendance</span>
            <span className="font-bold text-emerald-400">94.2%</span>
          </div>
          <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Fee Status</span>
            <span className="font-bold text-cyan-400">{studentFee?.status}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Timetable Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" /> Class Timetable & Schedule
          </h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
            <p className="font-bold text-cyan-400">German A1 Morning Intensive</p>
            <p className="text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Mon, Wed, Fri (09:00 AM - 11:00 AM)
            </p>
            <p className="text-slate-400">Facility Room: Room 102 (Berlin Hall)</p>
          </div>
        </div>

        {/* Fee Receipts & Download Center */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <CircleDollarSign className="w-4 h-4 text-emerald-400" /> Payment History & Receipts
          </h3>
          <div className="space-y-2">
            {studentFee?.installments.map((inst) => (
              <div key={inst.installmentNo} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-200">Installment #{inst.installmentNo} — €{inst.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Paid on: {inst.paidDate || 'Pending'}</p>
                </div>
                {inst.status === 'Paid' && (
                  <button
                    onClick={() => alert(`Downloading official PDF receipt for Installment #${inst.installmentNo}`)}
                    className="flex items-center gap-1 px-3 py-1 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700 font-semibold"
                  >
                    <Download className="w-3 h-3" /> Receipt PDF
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
