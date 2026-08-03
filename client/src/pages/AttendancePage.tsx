import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ClipboardCheck, CheckCircle2, XCircle, Clock, AlertTriangle, Send } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { students, batches } = useAppStore();
  const [selectedBatch, setSelectedBatch] = useState<string>('GER-A1-B01');
  const [attendanceState, setAttendanceState] = useState<{ [id: string]: 'Present' | 'Absent' | 'Leave' }>({
    'std-1': 'Present',
    'std-2': 'Present',
  });

  const toggleStatus = (id: string, status: 'Present' | 'Absent' | 'Leave') => {
    setAttendanceState((prev) => ({ ...prev, [id]: status }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Batch Attendance Register
          </h1>
          <p className="text-xs text-slate-400">Teacher marking screen with low-attendance warnings (&lt;75%) &amp; automated WhatsApp alerts</p>
        </div>

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 rounded-xl px-3 py-2 focus:outline-none"
        >
          {batches.map((b) => (
            <option key={b.code} value={b.code}>
              {b.code} • {b.courseName} ({b.timing})
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Register */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Today's Register: {selectedBatch} ({new Date().toLocaleDateString()})
          </h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition">
            Save Attendance
          </button>
        </div>

        <div className="space-y-3">
          {students.map((student) => {
            const status = attendanceState[student._id] || 'Present';
            return (
              <div key={student._id} className="glass-card p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={student.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                    alt={student.name}
                    className="w-9 h-9 rounded-full border border-cyan-500/30 object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{student.name}</h4>
                    <p className="text-[10px] text-cyan-400 font-mono">{student.studentId} • Attendance: 92%</p>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStatus(student._id, 'Present')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      status === 'Present'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Present
                  </button>

                  <button
                    onClick={() => toggleStatus(student._id, 'Absent')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      status === 'Absent'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Absent
                  </button>

                  <button
                    onClick={() => toggleStatus(student._id, 'Leave')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      status === 'Leave'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Leave
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
