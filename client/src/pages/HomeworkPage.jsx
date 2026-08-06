import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import {
  BookMarked,
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  Paperclip,
  Youtube,
  Video,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Award,
  X,
  UserCheck,
} from 'lucide-react';

export const HomeworkPage = () => {
  const { homeworks, homeworkSubmissions, addHomework, submitHomework, gradeHomework, batches, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  const [selectedHw, setSelectedHw] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  // Forms
  const [hwForm, setHwForm] = useState({
    title: '',
    description: '',
    batchCode: 'GER-A1-B01',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    totalMarks: 50,
    pdfUrl: '',
    ytUrl: '',
  });

  const [solutionUrl, setSolutionUrl] = useState('/docs/aarav_solution.pdf');
  const [gradeMarks, setGradeMarks] = useState('45');
  const [teacherRemarks, setTeacherRemarks] = useState('Great comprehension and sentence structure!');

  const filteredHomeworks = homeworks.filter((h) => {
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) || h.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = selectedBatch === 'All' || h.batchCode === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  const handleCreateHw = (e) => {
    e.preventDefault();
    const attachments = [];
    if (hwForm.pdfUrl) attachments.push({ type: 'PDF', url: hwForm.pdfUrl, title: 'Worksheet PDF' });
    if (hwForm.ytUrl) attachments.push({ type: 'YouTube', url: hwForm.ytUrl, title: 'Video Lesson' });

    addHomework({
      ...hwForm,
      attachments,
    });

    setIsAddModalOpen(false);
    setHwForm({
      title: '',
      description: '',
      batchCode: 'GER-A1-B01',
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      totalMarks: 50,
      pdfUrl: '',
      ytUrl: '',
    });
  };

  const handleSubmitSolution = (e) => {
    e.preventDefault();
    if (!selectedHw) return;
    submitHomework(selectedHw._id, solutionUrl);
    setIsSubmitModalOpen(false);
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (!selectedSub) return;
    gradeHomework(selectedSub._id, Number(gradeMarks), teacherRemarks);
    setIsGradeModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-amber-400" /> Homework & Assignment Hub
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
              {homeworks.length} Active Assignments
            </span>
          </h1>
          <p className="text-xs text-slate-400">Batch-wise assignments, PDF & YouTube attachments, student upload portal, and teacher grading desk</p>
        </div>

        {(currentUser.role === 'Owner' || currentUser.role === 'Admin' || currentUser.role === 'Teacher') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Homework</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search homework title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full sm:w-auto"
        >
          <option value="All">All Batches</option>
          {batches.map((b) => (
            <option key={b._id} value={b.code}>{b.code} ({b.courseName})</option>
          ))}
        </select>
      </div>

      {/* Homework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHomeworks.map((hw) => {
          const hwSubmissions = homeworkSubmissions.filter((s) => s.homeworkId === hw._id);

          return (
            <div key={hw._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800 uppercase tracking-widest">
                    Batch: {hw.batchCode}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 mt-1">{hw.title}</h3>
                  <p className="text-xs text-slate-400">Assigned by {hw.teacherName}</p>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 font-mono">
                  {hw.totalMarks} Marks
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                {hw.description}
              </p>

              {/* Attachments List */}
              {hw.attachments && hw.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hw.attachments.map((att, idx) => (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-cyan-300 hover:border-cyan-500 transition"
                    >
                      {att.type === 'YouTube' ? <Youtube className="w-3 h-3 text-rose-400" /> : <Paperclip className="w-3 h-3 text-cyan-400" />}
                      <span>{att.title || att.type}</span>
                    </a>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Due: {hw.dueDate}
                </span>

                {currentUser.role === 'Student' ? (
                  <button
                    onClick={() => {
                      setSelectedHw(hw);
                      setIsSubmitModalOpen(true);
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
                  >
                    Submit Assignment →
                  </button>
                ) : (
                  <span className="text-cyan-400 font-bold text-[11px]">{hwSubmissions.length} Submissions</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submissions & Evaluation Roster */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-2">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" /> Student Assignment Submissions & Grading Desk
          </h3>
          <span className="text-[11px] text-cyan-400 font-semibold">{homeworkSubmissions.length} Submissions Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[9px] font-bold tracking-wider">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Submission Date</th>
                <th className="p-3">Uploaded File</th>
                <th className="p-3">Evaluation Status</th>
                <th className="p-3">Marks Obtained</th>
                <th className="p-3">Teacher Remarks</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {homeworkSubmissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-sans font-bold text-slate-100">{sub.studentName} ({sub.studentCode})</td>
                  <td className="p-3 text-slate-400">{sub.submissionDate}</td>
                  <td className="p-3">
                    <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 font-sans">
                      <Paperclip className="w-3 h-3" /> Solution PDF
                    </a>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sub.status === 'Evaluated' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-amber-400">{sub.marksObtained} / 50</td>
                  <td className="p-3 text-slate-300 font-sans">{sub.teacherRemarks || 'Awaiting review'}</td>
                  <td className="p-3 text-right">
                    {(currentUser.role === 'Owner' || currentUser.role === 'Admin' || currentUser.role === 'Teacher') && (
                      <button
                        onClick={() => {
                          setSelectedSub(sub);
                          setIsGradeModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-[10px] hover:bg-cyan-400"
                      >
                        Grade & Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Homework Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateHw} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Assign New Homework</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Homework Title</label>
              <input
                type="text"
                required
                value={hwForm.title}
                onChange={(e) => setHwForm({ ...hwForm, title: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Detailed Instructions</label>
              <textarea
                rows={3}
                required
                value={hwForm.description}
                onChange={(e) => setHwForm({ ...hwForm, description: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Target Batch</label>
                <select
                  value={hwForm.batchCode}
                  onChange={(e) => setHwForm({ ...hwForm, batchCode: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {batches.map((b) => (
                    <option key={b._id} value={b.code}>{b.code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Due Date</label>
                <input
                  type="date"
                  required
                  value={hwForm.dueDate}
                  onChange={(e) => setHwForm({ ...hwForm, dueDate: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Publish Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grade Submission Modal */}
      {isGradeModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleGradeSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Grade Assignment Submission</h3>
              <button type="button" onClick={() => setIsGradeModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Marks Obtained (out of 50)</label>
              <input
                type="number"
                required
                value={gradeMarks}
                onChange={(e) => setGradeMarks(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Teacher Remarks & Feedback</label>
              <textarea
                rows={3}
                value={teacherRemarks}
                onChange={(e) => setTeacherRemarks(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsGradeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Save Evaluation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
