import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  BookOpen,
  Plus,
  X,
  GraduationCap,
  Sparkles,
  BookmarkCheck,
  Calendar,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  School,
  Layers,
  Award,
} from 'lucide-react';

export const CoursesPage = () => {
  const {
    courses,
    schoolClasses,
    subjects,
    academicYears,
    students,
    addCourse,
    addSchoolClass,
    addSubject,
    addAcademicYear,
    promoteStudents,
    currentUser,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('school'); // 'school' | 'coaching' | 'subjects' | 'sessions'

  // Modals
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  // Forms
  const [classForm, setClassForm] = useState({
    name: 'Class 9 (Secondary Board)',
    code: 'STD-09',
    category: 'Secondary',
    baseFee: 38000,
    sectionName: 'Section A',
    teacherName: 'Prof. Amit Kulkarni',
  });

  const [subjectForm, setSubjectForm] = useState({
    code: 'AI-101',
    name: 'Artificial Intelligence & Robotics',
    teacherName: 'Vikramaditya Roy',
    weeklyClasses: 5,
    maxMarks: 100,
    passingMarks: 33,
    isPractical: true,
  });

  const [sessionForm, setSessionForm] = useState({
    code: '2028-29',
    name: 'Academic Session 2028-2029',
    startDate: '2028-04-01',
    endDate: '2029-03-31',
    isCurrent: false,
  });

  const [promoteForm, setPromoteForm] = useState({
    sourceClass: 'STD-10',
    targetClass: 'STD-11',
  });

  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    description: '',
    levelCode: 'A1',
    baseFee: 25000,
  });

  const handlePromoteSubmit = (e) => {
    e.preventDefault();
    promoteStudents(promoteForm.sourceClass, promoteForm.targetClass);
    setIsPromoteModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <School className="w-5 h-5 text-amber-400" /> IIA Academic Program, Class & Curriculum Manager
          </h1>
          <p className="text-xs text-slate-400">
            Traditional School (Nursery - Class 12), Coaching & Language programs, Subject Registry & Session Promotion Engine
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'school' && (
            <button
              onClick={() => setIsClassModalOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add School Class</span>
            </button>
          )}

          {activeTab === 'coaching' && (
            <button
              onClick={() => setIsCourseModalOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Program</span>
            </button>
          )}

          {activeTab === 'subjects' && (
            <button
              onClick={() => setIsSubjectModalOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          )}

          {activeTab === 'sessions' && (
            <button
              onClick={() => setIsPromoteModalOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-purple-500/20 hover:scale-105 transition"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Promote Students</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-4 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('school')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'school' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> School Programs (Nursery – Class 12)
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px]">
            {schoolClasses.length} Classes
          </span>
        </button>

        <button
          onClick={() => setActiveTab('coaching')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'coaching' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Coaching & Language Programs
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px]">
            {courses.length} Programs
          </span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'subjects' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" /> Subject Registry ({subjects.length})
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'sessions' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" /> Academic Sessions & Student Promotion
        </button>
      </div>

      {/* TAB 1: K-12 SCHOOL PROGRAMS */}
      {activeTab === 'school' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schoolClasses.map((cls) => (
            <div key={cls._id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {cls.category} • Code: {cls.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">{cls.name}</h3>
                </div>
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Annual Tuition Fee:</span>
                  <span className="font-bold text-emerald-400 font-mono">₹{(cls.baseFee || 0).toLocaleString('en-IN')}</span>
                </div>

                <div className="border-t border-slate-800/80 pt-2 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Configured Sections</span>
                  {(cls.sections || []).map((sec, idx) => (
                    <div key={idx} className="flex justify-between text-[10px] font-mono text-slate-300 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                      <span>{sec.code} ({sec.capacity} Seats)</span>
                      <span className="text-amber-300">{sec.teacherName}</span>
                    </div>
                  ))}
                </div>

                {cls.streams && cls.streams.length > 0 && (
                  <div className="border-t border-slate-800/80 pt-2 space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase">Available Academic Streams</span>
                    {cls.streams.map((st, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-purple-950/40 border border-purple-800/40 text-[10px] space-y-0.5">
                        <div className="flex justify-between font-bold text-purple-300">
                          <span>{st.name}</span>
                          <span>₹{(st.fee || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 truncate">{(st.subjects || []).join(', ')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: COACHING & LANGUAGE PROGRAMS */}
      {activeTab === 'coaching' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {course.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">{course.name}</h3>
                </div>
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{course.description}</p>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Offered CEFR Levels</h4>
                {(course.levels || []).map((lvl) => (
                  <div key={lvl.code} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-cyan-400">{lvl.code}</span>
                      <span className="text-[10px] text-slate-400 block">{lvl.durationWeeks} weeks • {lvl.totalClasses} classes</span>
                    </div>
                    <span className="font-bold text-emerald-400 font-mono">₹{(lvl.baseFee || 0).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SUBJECT REGISTRY */}
      {activeTab === 'subjects' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-emerald-400" /> Master Subject Curriculum Registry
            </h3>
            <span className="text-[11px] text-emerald-400 font-bold">{subjects.length} Subjects Defined</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[9px] font-bold tracking-wider">
                <tr>
                  <th className="p-3">Subject Code</th>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3">Assigned Teacher</th>
                  <th className="p-3">Weekly Classes</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Max / Pass Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {subjects.map((sb) => (
                  <tr key={sb._id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-amber-400">{sb.code}</td>
                    <td className="p-3 font-sans font-bold text-slate-100">{sb.name}</td>
                    <td className="p-3 font-sans text-cyan-300">{sb.teacherName}</td>
                    <td className="p-3 text-slate-300">{sb.weeklyClasses} Classes/Week</td>
                    <td className="p-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sb.isPractical ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
                        {sb.isPractical ? 'Practical + Theory' : 'Theory Only'}
                      </span>
                    </td>
                    <td className="p-3 text-emerald-400 font-bold">{sb.maxMarks} Max / {sb.passingMarks} Pass</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ACADEMIC SESSIONS & PROMOTION DESK */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academicYears.map((ay) => (
              <div key={ay._id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${ay.isCurrent ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                    {ay.isCurrent ? 'Active Current Session' : 'Upcoming Session'}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-2">{ay.name} ({ay.code})</h3>
                  <p className="text-xs text-slate-400 font-mono">Duration: {ay.startDate} to {ay.endDate}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-purple-400" /> Automated Academic Year Student Promotion Desk
            </h3>
            <p className="text-xs text-slate-400">
              Promote students or entire class sections to the next academic grade session. Moves student roster, updates fee structure, and archives previous academic history.
            </p>

            <form onSubmit={handlePromoteSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Current Class (Source)</label>
                <select
                  value={promoteForm.sourceClass}
                  onChange={(e) => setPromoteForm({ ...promoteForm, sourceClass: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {schoolClasses.map((c) => (
                    <option key={c._id} value={c.code}>{c.name} ({c.code})</option>
                  ))}
                  {courses.map((c) => (
                    <option key={c._id} value={c.code}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Promote To Class (Target)</label>
                <select
                  value={promoteForm.targetClass}
                  onChange={(e) => setPromoteForm({ ...promoteForm, targetClass: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {schoolClasses.map((c) => (
                    <option key={c._id} value={c.code}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl hover:scale-105 transition"
                >
                  Execute Year-End Promotion →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SCHOOL CLASS */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addSchoolClass({
                name: classForm.name,
                code: classForm.code,
                category: classForm.category,
                baseFee: classForm.baseFee,
                sections: [{ code: classForm.sectionName, teacherName: classForm.teacherName, capacity: 35 }],
              });
              setIsClassModalOpen(false);
            }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Add School Grade Class</h3>
              <button type="button" onClick={() => setIsClassModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Class Grade Name</label>
              <input
                type="text"
                required
                value={classForm.name}
                onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Class Code</label>
                <input
                  type="text"
                  required
                  value={classForm.code}
                  onChange={(e) => setClassForm({ ...classForm, code: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Category</label>
                <select
                  value={classForm.category}
                  onChange={(e) => setClassForm({ ...classForm, category: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Pre-Primary">Pre-Primary</option>
                  <option value="Primary">Primary</option>
                  <option value="Middle">Middle</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Senior Secondary">Senior Secondary</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Annual Tuition Base Fee (₹)</label>
              <input
                type="number"
                required
                value={classForm.baseFee}
                onChange={(e) => setClassForm({ ...classForm, baseFee: Number(e.target.value) })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setIsClassModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
                Save School Class
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD SUBJECT */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addSubject(subjectForm);
              setIsSubjectModalOpen(false);
            }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Add Master Subject Curriculum</h3>
              <button type="button" onClick={() => setIsSubjectModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Subject Name</label>
              <input
                type="text"
                required
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Subject Code</label>
                <input
                  type="text"
                  required
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Assigned Teacher</label>
                <input
                  type="text"
                  required
                  value={subjectForm.teacherName}
                  onChange={(e) => setSubjectForm({ ...subjectForm, teacherName: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setIsSubjectModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400">
                Save Subject
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
