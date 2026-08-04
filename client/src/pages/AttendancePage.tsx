import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ClipboardCheck, Calendar, Check, X, AlertCircle, Save, History, Search } from 'lucide-react';
import { AttendanceEntry } from '../types';

export const AttendancePage: React.FC = () => {
  const { students, batches, attendanceLogs, saveDailyAttendanceLog, activeRole } = useAppStore();

  const [selectedBatch, setSelectedBatch] = useState(batches[0]?.code || 'GER-A1-B01');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filter students for the selected batch
  const batchStudents = students.filter((s) => !s.batchCode || s.batchCode === selectedBatch);

  // Check if attendance has already been logged for this date and batch
  const existingLog = attendanceLogs.find((log) => log.batchCode === selectedBatch && log.date === selectedDate);

  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'Present' | 'Absent' | 'Leave'>>({});

  // Initialize or fetch records for selected date
  const getStatus = (stdId: string) => {
    if (attendanceRecords[stdId]) return attendanceRecords[stdId];
    if (existingLog) {
      const match = existingLog.entries.find((e) => e.studentId === stdId);
      if (match) return match.status;
    }
    return 'Present';
  };

  const handleStatusChange = (stdId: string, status: 'Present' | 'Absent' | 'Leave') => {
    setAttendanceRecords({ ...attendanceRecords, [stdId]: status });
  };

  const handleSaveAttendance = () => {
    const entries: AttendanceEntry[] = batchStudents.map((std) => ({
      studentId: std.studentId,
      studentName: std.name,
      status: getStatus(std.studentId),
    }));

    saveDailyAttendanceLog(selectedBatch, selectedDate, entries);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Class Attendance Register & Database Logs
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              {attendanceLogs.length} Saved Date Logs
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Teachers mark daily roll call; Admins, Counsellors & Teachers inspect class attendance history by date
          </p>
        </div>

        {/* Date & Batch Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200">
            <Calendar className="w-4 h-4 text-amber-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200">
            <span className="text-slate-400 font-medium">Batch:</span>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-transparent font-bold text-amber-400 focus:outline-none cursor-pointer"
            >
              {batches.map((b) => (
                <option key={b._id} value={b.code} className="bg-slate-900 text-slate-200">
                  {b.code} ({b.courseName} {b.level})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSaveAttendance}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance to Database</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-bold text-center animate-pulse">
          Attendance log for {selectedBatch} on {selectedDate} permanently saved to database!
        </div>
      )}

      {/* Existing Log Indicator */}
      {existingLog ? (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>
              Attendance record found for <strong>{selectedDate}</strong> (Marked by <strong>{existingLog.markedBy}</strong>)
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
            Database Log Saved
          </span>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>No log recorded yet for {selectedDate}. Select Present/Absent below and click Save.</span>
        </div>
      )}

      {/* Attendance Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Student ID</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Course / Class</th>
                <th className="p-4">Parent Contact</th>
                <th className="p-4 text-center">Attendance Status on {selectedDate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {batchStudents.map((std) => {
                const currentStatus = getStatus(std.studentId);
                return (
                  <tr key={std._id} className="hover:bg-slate-900/50 transition">
                    <td className="p-4 font-mono font-bold text-amber-400">{std.studentId}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={std.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                          alt={std.name}
                          className="w-8 h-8 rounded-full border border-cyan-500/30 object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-100">{std.name}</p>
                          <p className="text-[10px] text-slate-400">Parent: {std.parentName || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-semibold">{std.courseName} {std.level}</td>
                    <td className="p-4 font-mono text-slate-400">{std.phone}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.studentId, 'Present')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.studentId, 'Absent')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.studentId, 'Leave')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition ${
                            currentStatus === 'Leave'
                              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Leave</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
