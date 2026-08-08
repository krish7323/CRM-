import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import {
  HeartHandshake,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  FileCheck,
  X,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

export const ScholarshipPage = () => {
  const { scholarships, requestScholarship, approveScholarship, students, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    studentId: 'std-1',
    type: 'Sibling Discount',
    percentage: 10,
    amount: 2500,
    reason: 'Younger sibling enrolled in weekend German program',
  });

  const filteredScholarships = scholarships.filter((s) => {
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || s.studentCode.includes(searchQuery);
    const matchesType = selectedType === 'All' || s.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalConcessionAmount = scholarships
    .filter((s) => s.status === 'Approved')
    .reduce((sum, s) => sum + s.amount, 0);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    requestScholarship(form.studentId, form.type, form.percentage, form.amount, form.reason);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-400" /> Scholarship & Fee Concession Approval Engine
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              {scholarships.length} Applications
            </span>
          </h1>
          <p className="text-xs text-slate-400">Sibling, Referral & Special Fee Concessions with automated Fee Record adjustments</p>
        </div>

        {(currentUser.role === 'Owner' || currentUser.role === 'Admin' || currentUser.role === 'Accountant') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Request Concession</span>
          </button>
        )}
      </div>

      {/* KPI Card */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Granted Concessions</span>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">₹{(totalConcessionAmount || 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <IndianRupee className="w-6 h-6" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student name, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full sm:w-auto"
        >
          <option value="All">All Concession Types</option>
          <option value="Sibling Discount">Sibling Discount</option>
          <option value="Employee Discount">Employee Discount</option>
          <option value="Referral Discount">Referral Discount</option>
          <option value="Special Discount">Special Discount</option>
        </select>
      </div>

      {/* Scholarships Roster Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-2">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Fee Concession Approvals & Adjustments Roster
          </h3>
          <span className="text-[11px] text-emerald-400 font-semibold">{filteredScholarships.length} Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[9px] font-bold tracking-wider">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Concession Category</th>
                <th className="p-3">Concession Amount</th>
                <th className="p-3">Justification Reason</th>
                <th className="p-3">Approval Status</th>
                <th className="p-3">Approver Audit</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredScholarships.map((sch) => (
                <tr key={sch._id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-sans font-bold text-slate-100">{sch.studentName} ({sch.studentCode})</td>
                  <td className="p-3 font-sans text-cyan-300 font-semibold">{sch.type}</td>
                  <td className="p-3 font-bold text-emerald-400">₹{(sch.amount || 0).toLocaleString('en-IN')} ({sch.percentage || 0}%)</td>
                  <td className="p-3 font-sans text-slate-300 max-w-xs truncate">{sch.reason}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-sans ${
                      sch.status === 'Approved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : sch.status === 'Rejected'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800/40'
                        : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                    }`}>
                      {sch.status}
                    </span>
                  </td>
                  <td className="p-3 font-sans text-slate-400">
                    {sch.approvedBy ? `${sch.approvedBy} (${sch.approvedDate})` : 'Pending Review'}
                  </td>
                  <td className="p-3 text-right space-x-1">
                    {sch.status === 'Pending' && (currentUser.role === 'Owner' || currentUser.role === 'Admin') && (
                      <>
                        <button
                          onClick={() => approveScholarship(sch._id, true)}
                          className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] hover:bg-emerald-400"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => approveScholarship(sch._id, false)}
                          className="px-2.5 py-1 rounded bg-rose-950 text-rose-400 font-bold text-[10px] hover:bg-rose-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Request Fee Concession / Scholarship</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Select Student</label>
              <select
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                {students.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Concession Category</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Sibling Discount">Sibling Discount</option>
                <option value="Employee Discount">Employee Discount</option>
                <option value="Referral Discount">Referral Discount</option>
                <option value="Special Discount">Special Discount</option>
                <option value="Early Bird Discount">Early Bird Discount</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Discount Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Percentage (%)</label>
                <input
                  type="number"
                  value={form.percentage}
                  onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Reason / Justification</label>
              <textarea
                rows={3}
                required
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
