import React from 'react';
import { useAppStore } from '../store/useAppStore.js';
import {
  Home,
  User,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  CircleDollarSign,
  BookMarked,
  Video,
  Award,
  Download,
  FileCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const ParentPortalPage = () => {
  const { students, fees, attendanceLogs, homeworks, ptms, certificates, timetableSlots, currentUser } = useAppStore();

  const child = students[0] || {
    studentId: 'IIA-1001',
    name: 'Aarav Gupta',
    parentName: 'Ramesh Gupta',
    courseName: 'German',
    level: 'A1',
    batchCode: 'GER-A1-B01',
  };

  const childFee = fees.find((f) => f.studentId === child._id || f.studentCode === child.studentId) || fees[0];
  const childPTM = ptms.filter((p) => p.studentId === child._id || p.studentCode === child.studentId);
  const childCerts = certificates.filter((c) => c.studentId === child._id || c.studentCode === child.studentId);

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-amber-500 p-0.5 shadow-xl shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-teal-400 text-xl">
              P
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Parent Self-Service Portal
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 font-semibold border border-teal-500/30">
                Logged in: {currentUser.name}
              </span>
            </h1>
            <p className="text-xs text-slate-400">Child Roster: <strong>{child.name}</strong> ({child.studentId}) • Course: {child.courseName} {child.level}</p>
          </div>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attendance Percentage</span>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">92.5%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ClipboardCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Fees Paid</span>
            <p className="text-2xl font-black text-cyan-400 font-mono mt-0.5">₹{childFee?.paidTotal?.toLocaleString('en-IN') || '15,000'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <CircleDollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Assignments</span>
            <p className="text-2xl font-black text-amber-400 mt-0.5">{homeworks.length} Active</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookMarked className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upcoming PTM</span>
            <p className="text-sm font-bold text-purple-400 mt-0.5">{childPTM[0]?.meetingDate || 'Aug 12, 2026'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Video className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Child Fee Payment Schedule */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
            <CircleDollarSign className="w-4 h-4 text-cyan-400" /> Child Fee Receipts & Installments Schedule
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span>Total Course Net Fee:</span>
              <span className="font-bold text-slate-100 font-mono">₹{childFee?.netFee?.toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-1.5 pt-2">
              {childFee?.installments.map((inst) => (
                <div key={inst.installmentNo} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                  <div>
                    <p className="font-bold text-slate-200">Installment #{inst.installmentNo}</p>
                    <p className="text-[10px] text-slate-500">Due: {inst.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-400">₹{inst.amount.toLocaleString('en-IN')}</p>
                    <span className={`text-[10px] font-bold ${inst.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {inst.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PTM Schedule & Progress Reports */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
            <Video className="w-4 h-4 text-purple-400" /> Parent Teacher Meetings & Progress Reports
          </h3>

          <div className="space-y-2 text-xs">
            {childPTM.map((p) => (
              <div key={p._id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-400">{p.meetingDate} at {p.meetingTime}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">{p.status}</span>
                </div>
                <p className="text-[11px] text-slate-300">Teacher: {p.teacherName}</p>
                <p className="text-[10px] text-slate-400">Link: <a href={p.meetLink} target="_blank" rel="noreferrer" className="text-purple-400 underline font-mono">{p.meetLink}</a></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
