import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import {
  Video,
  Plus,
  Search,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Globe,
  X,
  FileText,
} from 'lucide-react';

export const PTMPage = () => {
  const { ptms, schedulePTM, updatePTMStatus, students, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    teacherName: currentUser.name,
    studentId: 'std-1',
    studentCode: 'IIA-1001',
    studentName: 'Aarav Gupta',
    parentName: 'Ramesh Gupta',
    parentPhone: '+91 93344 55667',
    meetingDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    meetingTime: '04:00 PM',
    durationMinutes: 30,
    meetingType: 'Online',
    meetLink: 'https://meet.google.com/iia-ptm-meeting',
    notes: 'Goethe German A1 mid-term academic performance review',
    actionItems: 'Regular 20 min audio practice',
  });

  const filteredPTMs = ptms.filter((p) => {
    const matchesSearch = p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || p.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    schedulePTM(form);
    setIsModalOpen(false);
  };

  const sendWhatsAppReminder = (phone, name, date, time, link) => {
    const msg = encodeURIComponent(
      `Hello ${name}, your Parent-Teacher Meeting (PTM) with IIA Academy is scheduled on ${date} at ${time}. Join Google Meet: ${link}`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-400" /> Parent Teacher Meeting (PTM) Engine
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-semibold border border-purple-500/30">
              {ptms.length} Scheduled Meetings
            </span>
          </h1>
          <p className="text-xs text-slate-400">Classroom & Google Meet online PTM scheduling, WhatsApp reminders, and progress action items</p>
        </div>

        {(currentUser.role === 'Owner' || currentUser.role === 'Admin' || currentUser.role === 'Teacher') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-purple-500/20 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule PTM</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student or parent name..."
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
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* PTM Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPTMs.map((ptm) => (
          <div key={ptm._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-purple-400 border border-slate-800 uppercase tracking-widest">
                  {ptm.meetingType} PTM
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">Student: {ptm.studentName} ({ptm.studentCode})</h3>
                <p className="text-xs text-slate-400">Parent: {ptm.parentName} • {ptm.parentPhone}</p>
              </div>

              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                ptm.status === 'Upcoming' ? 'bg-amber-950 text-amber-400 border-amber-800/40' : 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
              }`}>
                {ptm.status}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center gap-2 text-cyan-300 font-medium font-mono">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {ptm.meetingDate} at {ptm.meetingTime} ({ptm.durationMinutes} mins)
              </p>
              {ptm.meetLink && (
                <p className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  <a href={ptm.meetLink} target="_blank" rel="noreferrer" className="text-purple-400 underline font-mono text-[11px]">
                    {ptm.meetLink}
                  </a>
                </p>
              )}
              <p className="text-slate-400 pt-1 border-t border-slate-900"><strong className="text-slate-300">Agenda Notes:</strong> {ptm.notes}</p>
              {ptm.actionItems && <p className="text-amber-400 text-[11px]"><strong>Action Items:</strong> {ptm.actionItems}</p>}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <button
                onClick={() => sendWhatsAppReminder(ptm.parentPhone, ptm.parentName, ptm.meetingDate, ptm.meetingTime, ptm.meetLink)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400 text-xs font-semibold hover:bg-emerald-900 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Reminder
              </button>

              {ptm.status === 'Upcoming' && (currentUser.role === 'Owner' || currentUser.role === 'Admin' || currentUser.role === 'Teacher') && (
                <button
                  onClick={() => updatePTMStatus(ptm._id, 'Completed')}
                  className="px-3 py-1 rounded-lg bg-purple-500 text-slate-950 font-bold text-xs hover:bg-purple-400 transition"
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Schedule PTM Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Schedule Parent Teacher Meeting</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Student</label>
                <select
                  value={form.studentId}
                  onChange={(e) => {
                    const s = students.find((std) => std._id === e.target.value);
                    if (s) {
                      setForm({
                        ...form,
                        studentId: s._id,
                        studentCode: s.studentId,
                        studentName: s.name,
                        parentName: s.parentName || 'Parent',
                        parentPhone: s.phone,
                      });
                    }
                  }}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Meeting Type</label>
                <select
                  value={form.meetingType}
                  onChange={(e) => setForm({ ...form, meetingType: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Online">Google Meet (Online)</option>
                  <option value="Classroom">Classroom (In Person)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Meeting Date</label>
                <input
                  type="date"
                  required
                  value={form.meetingDate}
                  onChange={(e) => setForm({ ...form, meetingDate: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Time Slot</label>
                <input
                  type="text"
                  required
                  value={form.meetingTime}
                  onChange={(e) => setForm({ ...form, meetingTime: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Google Meet Link</label>
              <input
                type="text"
                value={form.meetLink}
                onChange={(e) => setForm({ ...form, meetLink: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Meeting Agenda Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
                className="px-4 py-2 rounded-xl bg-purple-500 text-slate-950 font-bold text-xs hover:bg-purple-400"
              >
                Confirm PTM Schedule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
