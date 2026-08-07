import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import { exportToExcel } from '../utils/excelExporter.js';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  UserCheck,
  Award,
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  Printer,
  BarChart3,
  TrendingUp,
  MapPin,
  Star,
} from 'lucide-react';

export const ExamsPage = () => {
  const { exams, examMarks, addExam, recordExamMarks, batches, students, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Modals
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [selectedExamForMarks, setSelectedExamForMarks] = useState(null);

  // Forms
  const [examForm, setExamForm] = useState({
    title: '',
    examType: 'Mid Term',
    batchCode: 'GER-A1-B01',
    subject: 'German Syntax & Oral',
    examDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    startTime: '09:00 AM',
    room: 'Aryabhata Hall (Room 102)',
    invigilatorName: 'Prof. Amit Kulkarni',
    totalMarks: 100,
    passingMarks: 50,
  });

  const [marksForm, setMarksForm] = useState({
    studentId: 'std-1',
    studentCode: 'IIA-1001',
    studentName: 'Aarav Gupta',
    marksObtained: 88,
    teacherRemarks: 'Excellent syntax formation and oral articulation',
  });

  const filteredExams = exams.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || e.examType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCreateExam = (e) => {
    e.preventDefault();
    addExam(examForm);
    setIsAddExamModalOpen(false);
    setExamForm({
      title: '',
      examType: 'Mid Term',
      batchCode: 'GER-A1-B01',
      subject: 'German Syntax & Oral',
      examDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      startTime: '09:00 AM',
      room: 'Aryabhata Hall (Room 102)',
      invigilatorName: 'Prof. Amit Kulkarni',
      totalMarks: 100,
      passingMarks: 50,
    });
  };

  const handleRecordMarksSubmit = (e) => {
    e.preventDefault();
    if (!selectedExamForMarks) return;
    recordExamMarks({
      examId: selectedExamForMarks._id,
      ...marksForm,
    });
    setIsMarksModalOpen(false);
    setSelectedExamForMarks(null);
  };

  const handleExportExcel = () => {
    exportToExcel(examMarks, 'IIA_Exam_Results_Roster');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-400" /> Exams, Hall Tickets & Grade Report Cards
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30">
              {exams.length} Scheduled Exams
            </span>
          </h1>
          <p className="text-xs text-slate-400">Unit/Mid-term/Final test schedules, room invigilator assignments, CGPA calculations & printable report cards</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 text-teal-400 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-slate-800 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Results (.xlsx)</span>
          </button>

          {(currentUser.role === 'Owner' || currentUser.role === 'Admin' || currentUser.role === 'Teacher') && (
            <button
              onClick={() => setIsAddExamModalOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-rose-500/20 hover:scale-105 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Examination</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search exam title, subject..."
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
          <option value="All">All Exam Types</option>
          <option value="Unit Test">Unit Test</option>
          <option value="Monthly Test">Monthly Test</option>
          <option value="Mid Term">Mid Term</option>
          <option value="Final Exam">Final Exam</option>
        </select>
      </div>

      {/* Exam Timetable Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExams.map((ex) => (
          <div key={ex._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-rose-400 border border-slate-800 uppercase tracking-widest">
                  {ex.examType} • Batch: {ex.batchCode}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{ex.title}</h3>
                <p className="text-xs text-slate-400">Subject: {ex.subject}</p>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800 font-mono">
                Max Marks: {ex.totalMarks}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5 text-xs text-slate-300 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-rose-400" /> Exam Date:</span>
                <span className="text-slate-200 font-bold">{ex.examDate} at {ex.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> Hall / Room:</span>
                <span className="text-cyan-300 font-bold">{ex.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Invigilator:</span>
                <span className="text-amber-300 font-bold">{ex.invigilatorName}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-sans">
              <span className="text-slate-400 text-[11px]">Pass Criteria: {ex.passingMarks} Marks</span>
              {(currentUser.role === 'Owner' || currentUser.role === 'Admin' || currentUser.role === 'Teacher') && (
                <button
                  onClick={() => {
                    setSelectedExamForMarks(ex);
                    setIsMarksModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-lg bg-rose-500 text-slate-950 font-bold text-xs hover:bg-rose-400 transition"
                >
                  Input Marks →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Student Exam Marks & Printable Report Cards Roster */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-2">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Award className="w-4 h-4 text-rose-400" /> Student Examination Marks & Printable Grade Cards Roster
          </h3>
          <span className="text-[11px] text-rose-400 font-semibold">{examMarks.length} Marks Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[9px] font-bold tracking-wider">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Marks Obtained</th>
                <th className="p-3">Grade Scale</th>
                <th className="p-3">Class Rank</th>
                <th className="p-3">Teacher Remarks</th>
                <th className="p-3">Approval Status</th>
                <th className="p-3 text-right">Report Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {examMarks.map((em) => (
                <tr key={em._id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-sans font-bold text-slate-100">{em.studentName} ({em.studentCode})</td>
                  <td className="p-3 font-bold text-rose-400">{em.marksObtained} / 100</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-amber-400 border border-slate-800 font-sans">
                      Grade {em.grade}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-cyan-400 flex items-center gap-1 font-sans">
                    <Star className="w-3 h-3 fill-cyan-400" /> Rank #{em.rank || 1}
                  </td>
                  <td className="p-3 text-slate-300 font-sans">{em.teacherRemarks}</td>
                  <td className="p-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${em.approvalStatus === 'Published' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'}`}>
                      {em.approvalStatus || 'Published'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => window.print()}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold inline-flex items-center gap-1 font-sans"
                    >
                      <Printer className="w-3 h-3 text-cyan-400" /> Printable Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Exam Modal */}
      {isAddExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateExam} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Schedule Examination Session</h3>
              <button type="button" onClick={() => setIsAddExamModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Exam Title</label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Exam Type</label>
                <select
                  value={examForm.examType}
                  onChange={(e) => setExamForm({ ...examForm, examType: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Unit Test">Unit Test</option>
                  <option value="Monthly Test">Monthly Test</option>
                  <option value="Mid Term">Mid Term</option>
                  <option value="Final Exam">Final Exam</option>
                  <option value="Practical">Practical</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Subject</label>
                <input
                  type="text"
                  required
                  value={examForm.subject}
                  onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Target Batch</label>
                <select
                  value={examForm.batchCode}
                  onChange={(e) => setExamForm({ ...examForm, batchCode: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {batches.map((b) => (
                    <option key={b._id} value={b.code}>{b.code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Exam Date</label>
                <input
                  type="date"
                  required
                  value={examForm.examDate}
                  onChange={(e) => setExamForm({ ...examForm, examDate: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Start Time</label>
                <input
                  type="text"
                  required
                  value={examForm.startTime}
                  onChange={(e) => setExamForm({ ...examForm, startTime: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddExamModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs hover:bg-rose-400"
              >
                Save Exam Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Record Marks Modal */}
      {isMarksModalOpen && selectedExamForMarks && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRecordMarksSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Record Marks for {selectedExamForMarks.title}</h3>
              <button type="button" onClick={() => setIsMarksModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Select Student</label>
              <select
                value={marksForm.studentId}
                onChange={(e) => {
                  const s = students.find((std) => std._id === e.target.value);
                  if (s) setMarksForm({ ...marksForm, studentId: s._id, studentCode: s.studentId, studentName: s.name });
                }}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                {students.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Marks Obtained (out of {selectedExamForMarks.totalMarks})</label>
              <input
                type="number"
                required
                value={marksForm.marksObtained}
                onChange={(e) => setMarksForm({ ...marksForm, marksObtained: Number(e.target.value) })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Teacher Performance Remarks</label>
              <textarea
                rows={3}
                value={marksForm.teacherRemarks}
                onChange={(e) => setMarksForm({ ...marksForm, teacherRemarks: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsMarksModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs hover:bg-rose-400"
              >
                Save Marks
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
