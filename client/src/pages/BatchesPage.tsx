import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Calendar, Clock, User, MapPin, Plus, X, AlertTriangle } from 'lucide-react';

export const BatchesPage: React.FC = () => {
  const { batches, addBatch } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    code: 'GER-A1-B02',
    courseName: 'German',
    level: 'A1',
    teacherName: 'Prof. Johann Weber',
    room: 'Room 102 (Berlin Hall)',
    days: ['Mon', 'Wed', 'Fri'],
    timing: '09:00 AM - 11:00 AM',
    maxStudents: 15,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate conflict (teacher or room overlap)
    const conflict = batches.find(
      (b) => b.room === form.room && b.timing === form.timing && b.status === 'Ongoing'
    );

    if (conflict) {
      setErrorMsg(`Schedule Conflict: '${form.room}' is already booked for timing '${form.timing}'.`);
      return;
    }

    addBatch(form);
    setIsModalOpen(false);
    setErrorMsg('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Batch Management & Timetable
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
              {batches.length} Active Batches
            </span>
          </h1>
          <p className="text-xs text-slate-400">Class schedules, faculty allocation, room assignment, and capacity bars</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Batch</span>
        </button>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.map((b) => (
          <div key={b._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/40">
                  {b.code}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{b.courseName} Level {b.level}</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800/40">
                {b.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" /> {b.teacherName}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {b.room}
              </p>
              <p className="flex items-center gap-2 text-cyan-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> {b.days.join(', ')} • {b.timing}
              </p>
            </div>

            {/* Enrolled Capacity Bar */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Enrolled Capacity</span>
                <span className="text-slate-200 font-semibold">{b.currentEnrolledCount} / {b.maxStudents} Students</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                  style={{ width: `${(b.currentEnrolledCount / b.maxStudents) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Schedule New Batch</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Batch Code</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Faculty Teacher</label>
                <input
                  type="text"
                  required
                  value={form.teacherName}
                  onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Room / Online</label>
                <input
                  type="text"
                  required
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Timing Slot</label>
                <input
                  type="text"
                  required
                  value={form.timing}
                  onChange={(e) => setForm({ ...form, timing: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
              >
                Save Batch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
