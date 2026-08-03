import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Student } from '../types';
import { GraduationCap, Search, Phone, Mail, FileCheck, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const { students } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Student Registry & Profiles
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
              {students.length} Enrolled
            </span>
          </h1>
          <p className="text-xs text-slate-400">Complete record of active language institute students & credentials</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student ID, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
          />
        </div>
      </div>

      {/* Grid of Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((std) => (
          <div
            key={std._id}
            onClick={() => setSelectedStudent(std)}
            className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={std.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                    alt={std.name}
                    className="w-10 h-10 rounded-full border border-cyan-500/30 object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{std.name}</h3>
                    <p className="text-[11px] text-cyan-400 font-semibold">{std.studentId}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/40">
                  Active
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                <p className="flex items-center justify-between">
                  <span className="text-slate-400">Course & Level:</span>
                  <span className="font-semibold text-slate-200">{std.courseName} {std.level}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-400">Batch Code:</span>
                  <span className="font-mono text-cyan-400">{std.batchCode || 'GER-A1-B01'}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-400">Joined:</span>
                  <span>{new Date(std.joiningDate).toLocaleDateString()}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> Documents Verified
              </span>
              <span className="text-cyan-400 font-semibold hover:underline">View Profile →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedStudent.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                  alt={selectedStudent.name}
                  className="w-14 h-14 rounded-2xl border border-cyan-500/40 object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{selectedStudent.name}</h3>
                  <p className="text-xs text-cyan-400 font-mono">ID: {selectedStudent.studentId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500">Contact Information</p>
                <p className="text-slate-200">Phone: {selectedStudent.phone}</p>
                <p className="text-slate-200">Email: {selectedStudent.email}</p>
                <p className="text-slate-200">Address: {selectedStudent.address}</p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500">Academic Details</p>
                <p className="text-slate-200">Course: {selectedStudent.courseName}</p>
                <p className="text-slate-200">CEFR Level: {selectedStudent.level}</p>
                <p className="text-slate-200">Batch Code: {selectedStudent.batchCode}</p>
              </div>
            </div>

            {/* Document Vault Status */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Submitted Credentials & Documents</h4>
              <div className="space-y-2">
                {selectedStudent.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-200 font-medium">{doc.type}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-semibold text-[10px] border border-emerald-800/40">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
