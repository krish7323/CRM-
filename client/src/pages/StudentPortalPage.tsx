import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  CircleDollarSign,
  FileCheck,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Upload,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';

export const StudentPortalPage: React.FC = () => {
  const { currentUser, students, studyNotes, addStudyNote, activeRole, attendanceLogs } = useAppStore();

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteForm, setNoteForm] = useState({
    title: '',
    gradeOrClass: '5th Standard (German A1)',
    courseName: 'German',
    pdfUrl: '/docs/study_material.pdf',
    description: '',
  });

  // Active student matching login
  const student = students[0] || {
    studentId: 'IIA-1001',
    name: currentUser.name || 'Aarav Gupta',
    parentName: 'Ramesh Gupta',
    courseName: 'German',
    level: 'A1',
    batchCode: 'GER-A1-B01',
    joiningDate: '2026-07-01',
  };

  const handleUploadNote = (e: React.FormEvent) => {
    e.preventDefault();
    addStudyNote(noteForm);
    setIsNoteModalOpen(false);
    setNoteForm({
      title: '',
      gradeOrClass: '5th Standard (German A1)',
      courseName: 'German',
      pdfUrl: '/docs/study_material.pdf',
      description: '',
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Welcome Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
            alt={student.name}
            className="w-16 h-16 rounded-full border-2 border-amber-500/50 object-cover shadow-xl"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-100">{student.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                {student.studentId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Program: <strong>{student.courseName} {student.level}</strong> • Batch: <strong className="text-cyan-400 font-mono">{student.batchCode || 'GER-A1-B01'}</strong>
            </p>
          </div>
        </div>

        {/* Faculty Teacher Upload Trigger */}
        {(activeRole === 'Teacher' || activeRole === 'Admin') && (
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Upload PDF Class Notes (for 5th Standard & Students)</span>
          </button>
        )}
      </div>

      {/* Class Notes & PDF Study Material Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" /> Class Study Material & PDF Notes (Grade/Class Wise)
          </h2>
          <span className="text-xs text-slate-400">{studyNotes.length} PDFs Uploaded by Faculty</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studyNotes.map((note) => (
            <div key={note._id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {note.gradeOrClass}
                  </span>
                  <span className="text-[10px] text-slate-500">{note.uploadedAt}</span>
                </div>

                <h3 className="text-xs font-bold text-slate-100 mt-2">{note.title}</h3>
                <p className="text-[11px] text-slate-400">{note.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">By {note.uploadedBy}</span>
                <a
                  href={note.pdfUrl || '#'}
                  download
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Timetable & Attendance Register History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" /> Weekly Class Schedule
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <div>
                <p className="font-bold text-slate-200">German A1 Grammar & Speaking</p>
                <p className="text-[10px] text-slate-400">Aryabhata Hall (Room 102)</p>
              </div>
              <div className="text-right">
                <p className="text-amber-400 font-mono font-bold">Mon, Wed, Fri</p>
                <p className="text-[10px] text-slate-400">09:00 AM - 11:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> My Attendance Log History
          </h3>
          <div className="space-y-2 text-xs">
            {attendanceLogs.length > 0 ? (
              attendanceLogs.map((log) => (
                <div key={log._id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-200">Date: {log.date}</p>
                    <p className="text-[10px] text-slate-400">Marked by: {log.markedBy}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    Present
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs italic">94.2% Attendance record verified on system database.</p>
            )}
          </div>
        </div>
      </div>

      {/* Upload Notes Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUploadNote} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Upload Class Study Material & PDF Notes</h3>
              <button type="button" onClick={() => setIsNoteModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Document Title</label>
              <input
                type="text"
                required
                placeholder="e.g. 5th Standard German Chapter 2 Notes"
                value={noteForm.title}
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Target Grade / Standard / Class</label>
              <input
                type="text"
                required
                placeholder="e.g. 5th Standard (German A1)"
                value={noteForm.gradeOrClass}
                onChange={(e) => setNoteForm({ ...noteForm, gradeOrClass: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Description / Instructions</label>
              <textarea
                rows={2}
                value={noteForm.description}
                onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                placeholder="Brief summary of the study notes..."
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Upload Class Notes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
