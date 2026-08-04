import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Student } from '../types';
import { GraduationCap, Search, Phone, Mail, FileCheck, CheckCircle2, ShieldCheck, X, UserPlus, Plus } from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const { students, registerDirectStudent } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    parentName: '',
    phone: '',
    email: '',
    aadhaarNo: '',
    courseName: 'German',
    level: 'A1',
    batchCode: 'GER-A1-B01',
    address: 'Bengaluru, India',
  });

  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    registerDirectStudent(newStudentForm);
    setIsAddModalOpen(false);
    setNewStudentForm({
      name: '',
      parentName: '',
      phone: '',
      email: '',
      aadhaarNo: '',
      courseName: 'German',
      level: 'A1',
      batchCode: 'GER-A1-B01',
      address: 'Bengaluru, India',
    });
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Student Registry & Profiles
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
              {students.length} Enrolled
            </span>
          </h1>
          <p className="text-xs text-slate-400">Complete record of active IIA students, Aadhaar status & credentials</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Student</span>
          </button>
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
                    <p className="text-[11px] text-amber-400 font-semibold">{std.studentId}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/40">
                  Active
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                <p className="flex items-center justify-between">
                  <span className="text-slate-400">Parent / Guardian:</span>
                  <span className="font-semibold text-slate-200">{std.parentName || 'N/A'}</span>
                </p>
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
                  <span>{new Date(std.joiningDate).toLocaleDateString('en-IN')}</span>
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

      {/* Register New Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRegisterStudent} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Register New IIA Student</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Parent / Guardian Name</label>
                <input
                  type="text"
                  value={newStudentForm.parentName}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, parentName: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Phone / WhatsApp Number</label>
                <input
                  type="text"
                  required
                  value={newStudentForm.phone}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={newStudentForm.email}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Aadhaar Card Number</label>
                <input
                  type="text"
                  value={newStudentForm.aadhaarNo}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, aadhaarNo: e.target.value })}
                  placeholder="12-digit Aadhaar"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Program Course</label>
                <select
                  value={newStudentForm.courseName}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, courseName: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
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
                Register Student
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedStudent.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                  alt={selectedStudent.name}
                  className="w-14 h-14 rounded-full border-2 border-cyan-500/40 object-cover"
                />
                <div>
                  <h2 className="text-base font-bold text-slate-100">{selectedStudent.name}</h2>
                  <p className="text-xs text-amber-400 font-mono font-semibold">{selectedStudent.studentId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Parent / Guardian</span>
                <span className="font-semibold text-slate-200">{selectedStudent.parentName || 'N/A'}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Course & Level</span>
                <span className="font-semibold text-slate-200">{selectedStudent.courseName} {selectedStudent.level}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Contact Phone</span>
                <span className="font-mono text-slate-200">{selectedStudent.phone}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Aadhaar Card Status</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
