import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { BookOpen, Plus, Clock, CircleDollarSign, CheckCircle2, X } from 'lucide-react';
import { CEFRLevel } from '../types';

export const CoursesPage: React.FC = () => {
  const { courses } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    levelCode: 'A1' as CEFRLevel,
    baseFee: 25000,
    durationWeeks: 8,
    totalClasses: 40,
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            IIA Courses & Language Curriculum
          </h1>
          <p className="text-xs text-slate-400">Manage language programs, CEFR levels, syllabus, and term fee structures in ₹</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course Program</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {course.code}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{course.name}</h3>
              </div>
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{course.description}</p>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Offered Levels</h4>
              {course.levels.map((lvl) => (
                <div key={lvl.code} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-400">{lvl.code}</span>
                    <span className="text-[10px] text-slate-400 block">{lvl.durationWeeks} weeks • {lvl.totalClasses} classes</span>
                  </div>
                  <span className="font-bold text-emerald-400 font-mono">₹{lvl.baseFee.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(`Course "${form.name}" added to IIA Curriculum!`);
              setIsModalOpen(false);
            }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Add New Language / CBSE Course</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Course Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Spanish"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Course Code</label>
              <input
                type="text"
                required
                placeholder="e.g. SPA"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Base Fee (₹)</label>
                <input
                  type="number"
                  required
                  value={form.baseFee}
                  onChange={(e) => setForm({ ...form, baseFee: Number(e.target.value) })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Level Code</label>
                <select
                  value={form.levelCode}
                  onChange={(e) => setForm({ ...form, levelCode: e.target.value as CEFRLevel })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Save Program
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
