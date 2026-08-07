import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import {
  UserCog,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  UserCheck,
  X,
  ShieldCheck,
} from 'lucide-react';

export const LeavePage = () => {
  const { leaveRequests, requestLeave, approveLeave, users, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    leaveType: 'Casual',
    startDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    reason: 'Family urgent commitment in hometown',
    substituteTeacher: 'Prof. Johann Weber',
  });

  const filteredLeaves = leaveRequests.filter((l) => {
    const matchesSearch = l.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) || l.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || l.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    requestLeave(form);
    setIsModalOpen(false);
    setForm({
      leaveType: 'Casual',
      startDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      reason: 'Family urgent commitment in hometown',
      substituteTeacher: 'Prof. Johann Weber',
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-emerald-400" /> Staff & Teacher Leave Approval Workflow
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              {leaveRequests.length} Leave Applications
            </span>
          </h1>
          <p className="text-xs text-slate-400">Casual, medical & emergency leave applications, substitute teacher assignments, and HR approvals</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Apply For Leave</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search staff applicant name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full sm:w-auto"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Leave Roster Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-2">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Leave Application & Substitute Roster
          </h3>
          <span className="text-[11px] text-emerald-400 font-semibold">{filteredLeaves.length} Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[9px] font-bold tracking-wider">
              <tr>
                <th className="p-3">Staff Name</th>
                <th className="p-3">Leave Type</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Substitute Assigned</th>
                <th className="p-3">Approval Status</th>
                <th className="p-3 text-right">HR Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLeaves.map((lv) => (
                <tr key={lv._id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-sans font-bold text-slate-100">{lv.applicantName} ({lv.applicantRole})</td>
                  <td className="p-3 font-sans text-cyan-300 font-semibold">{lv.leaveType} Leave</td>
                  <td className="p-3 text-amber-400 font-bold">{lv.startDate} to {lv.endDate}</td>
                  <td className="p-3 font-sans text-slate-300 max-w-xs truncate">{lv.reason}</td>
                  <td className="p-3 font-sans text-purple-300">{lv.substituteTeacher}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-sans ${
                      lv.status === 'Approved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : lv.status === 'Rejected'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800/40'
                        : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                    }`}>
                      {lv.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    {lv.status === 'Pending' && (
                      (() => {
                        const canApprove =
                          currentUser.role === 'Owner' ||
                          currentUser.role === 'Admin' ||
                          (currentUser.role === 'Counsellor' && (lv.applicantRole === 'Teacher' || lv.applicantRole === 'Student'));
                        return canApprove ? (
                          <>
                            <button
                              onClick={() => approveLeave(lv._id, true)}
                              className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] hover:bg-emerald-400"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => approveLeave(lv._id, false)}
                              className="px-2 py-1 rounded bg-rose-950 text-rose-400 font-bold text-[10px] hover:bg-rose-900"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Awaiting Higher Approver</span>
                        );
                      })()
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Apply For Staff Leave</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Leave Type</label>
              <select
                value={form.leaveType}
                onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Casual">Casual Leave</option>
                <option value="Medical">Medical Leave</option>
                <option value="Emergency">Emergency Leave</option>
                <option value="Half Day">Half Day Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Start Date</label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">End Date</label>
                <input
                  type="date"
                  required
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Substitute Faculty / Teacher</label>
              <input
                type="text"
                value={form.substituteTeacher}
                onChange={(e) => setForm({ ...form, substituteTeacher: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Reason For Leave</label>
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
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
