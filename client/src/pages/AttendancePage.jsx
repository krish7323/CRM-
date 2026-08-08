import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Calendar,
  Check,
  X,
  AlertCircle,
  Save,
  History,
  CheckCheck,
  Eye,
  FileSpreadsheet,
  UserCheck,
  UserX,
  Clock,
  Sparkles,
  BarChart3,
} from 'lucide-react';

export const AttendancePage = () => {
  const { students, batches, attendanceLogs, saveDailyAttendanceLog, currentUser } = useAppStore();

  const [selectedBatch, setSelectedBatch] = useState(batches[0]?.code || 'GER-A1-B01');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'history'

  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

  // Filter students for the selected batch
  const batchStudents = students.filter((s) => !s.batchCode || s.batchCode === selectedBatch);

  // Existing saved log for selected batch & date
  const existingLog = (attendanceLogs || []).find(
    (log) => log.batchCode === selectedBatch && log.date === selectedDate
  );

  // Reset local state when batch or date changes
  useEffect(() => {
    setAttendanceRecords({});
  }, [selectedBatch, selectedDate]);

  // Retrieve status for a student
  const getStatus = (std) => {
    const key = std.studentId || std._id;
    if (attendanceRecords[key]) return attendanceRecords[key];
    if (existingLog && Array.isArray(existingLog.entries)) {
      const match = existingLog.entries.find(
        (e) => e.studentId === std.studentId || e.studentId === std._id || e.studentName === std.name
      );
      if (match) return match.status;
    }
    return 'Present';
  };

  const handleStatusChange = (std, status) => {
    const key = std.studentId || std._id;
    setAttendanceRecords({ ...attendanceRecords, [key]: status });
  };

  const handleMarkAllPresent = () => {
    const updated = {};
    batchStudents.forEach((std) => {
      const key = std.studentId || std._id;
      updated[key] = 'Present';
    });
    setAttendanceRecords(updated);
  };

  const handleSaveAttendance = () => {
    const entries = batchStudents.map((std) => ({
      studentId: std.studentId || std._id,
      studentName: std.name,
      status: getStatus(std),
    }));

    saveDailyAttendanceLog(selectedBatch, selectedDate, entries);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Detailed Student Attendance Breakdown Calculation
  const getStudentHistoryLogs = (std) => {
    if (!std) return [];
    const history = [];
    (attendanceLogs || []).forEach((log) => {
      if (!log || !Array.isArray(log.entries)) return;
      const match = log.entries.find(
        (e) => e.studentId === std.studentId || e.studentId === std._id || e.studentName === std.name
      );
      if (match) {
        history.push({
          date: log.date,
          batchCode: log.batchCode,
          status: match.status,
          markedBy: log.markedBy || 'Faculty',
        });
      }
    });
    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <div className="space-y-6 font-sans text-slate-100 pb-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Class Attendance Register & Deduplicated Database Logs
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              {(attendanceLogs || []).length} Recorded Date Logs
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Single-threaded deduplicated attendance tracking • Real-time student profile sync & date history breakdown
          </p>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('register')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'register' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily Register
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'history' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Saved Date Logs ({attendanceLogs.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'register' ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200">
                <Calendar className="w-4 h-4 text-amber-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200">
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
                onClick={handleMarkAllPresent}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
              >
                <CheckCheck className="w-4 h-4 text-cyan-400" />
                <span>Mark All Present</span>
              </button>
            </div>

            <button
              onClick={handleSaveAttendance}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save & Sync Attendance</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-bold text-center animate-pulse shadow-lg">
              ✨ Attendance log for batch <strong>{selectedBatch}</strong> on <strong>{selectedDate}</strong> successfully saved to database & student profiles updated!
            </div>
          )}

          {/* Existing Log Indicator */}
          {existingLog ? (
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-between text-xs text-amber-300">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-amber-400" />
                <span>
                  Attendance record already saved for <strong>{selectedDate}</strong> (Marked by <strong>{existingLog.markedBy || 'Faculty'}</strong>)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30">
                Single-Threaded Log Active
              </span>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>No log recorded yet for {selectedDate}. Mark attendance below and click "Save & Sync Attendance".</span>
            </div>
          )}

          {/* Attendance Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Student ID</th>
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Course / Class</th>
                    <th className="p-4">Overall Rate (%)</th>
                    <th className="p-4 text-center">Status on {selectedDate}</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {batchStudents.map((std) => {
                    const currentStatus = getStatus(std);
                    return (
                      <tr key={std._id} className="hover:bg-slate-900/60 transition">
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
                        <td className="p-4 font-mono font-bold text-emerald-400">
                          {std.attendanceRate || 95}%
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(std, 'Present')}
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
                              onClick={() => handleStatusChange(std, 'Absent')}
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
                              onClick={() => handleStatusChange(std, 'Leave')}
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
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedStudentDetail(std)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700 font-semibold transition text-[11px] inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Full History
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* SAVED DATE LOGS TABLE */
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" /> Database Saved Attendance Logs
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Batch Code</th>
                  <th className="p-4">Total Students</th>
                  <th className="p-4">Present Count</th>
                  <th className="p-4">Absent Count</th>
                  <th className="p-4">Marked By Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(attendanceLogs || []).map((log) => {
                  const presentCount = (log.entries || []).filter((e) => e.status === 'Present').length;
                  const absentCount = (log.entries || []).filter((e) => e.status === 'Absent').length;

                  return (
                    <tr key={log._id} className="hover:bg-slate-900/60 transition">
                      <td className="p-4 font-mono font-bold text-amber-400">{log.date}</td>
                      <td className="p-4 font-bold text-slate-200">{log.batchCode}</td>
                      <td className="p-4 font-mono text-slate-300">{(log.entries || []).length} Students</td>
                      <td className="p-4 font-mono font-bold text-emerald-400">{presentCount} Present</td>
                      <td className="p-4 font-mono font-bold text-rose-400">{absentCount} Absent</td>
                      <td className="p-4 text-slate-400 font-medium">{log.markedBy || 'Academic Faculty'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Detailed Attendance Analytics Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentDetail.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                  alt={selectedStudentDetail.name}
                  className="w-10 h-10 rounded-full border border-amber-500/40 object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-100">{selectedStudentDetail.name}</h3>
                  <p className="text-xs text-amber-400 font-mono">
                    ID: {selectedStudentDetail.studentId} • {selectedStudentDetail.courseName}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedStudentDetail(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Attendance KPI Overview Cards */}
            <div className="grid grid-cols-4 gap-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center font-mono text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Attendance Rate</p>
                <p className="text-lg font-black text-emerald-400">{selectedStudentDetail.attendanceRate || 95}%</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Present Days</p>
                <p className="text-lg font-black text-emerald-400">{selectedStudentDetail.totalPresentClasses || 19}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Absent Days</p>
                <p className="text-lg font-black text-rose-400">{selectedStudentDetail.totalAbsentClasses || 1}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Leave Days</p>
                <p className="text-lg font-black text-amber-400">{selectedStudentDetail.totalLeaveClasses || 0}</p>
              </div>
            </div>

            {/* Date-by-Date History Logs */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <History className="w-4 h-4 text-amber-400" /> Chronological Class Attendance Log
              </h4>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {getStudentHistoryLogs(selectedStudentDetail).length === 0 ? (
                  <p className="text-xs text-slate-500 p-4 text-center">No historical date logs recorded yet for this student.</p>
                ) : (
                  getStudentHistoryLogs(selectedStudentDetail).map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-200">{item.date}</span>
                        <span className="text-[10px] text-slate-400 block">Batch: {item.batchCode} • Marked by {item.markedBy}</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg font-bold text-[10px] ${
                          item.status === 'Present'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : item.status === 'Absent'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
