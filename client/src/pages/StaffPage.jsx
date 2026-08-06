import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { UserPlus, X, CheckCircle2 } from 'lucide-react';
export const StaffPage = () => {
    const { users, addUserAccount, batches } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teacherForm, setTeacherForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: 'password123',
        customRoleTitle: 'Senior Faculty Teacher',
        role: 'Teacher',
    });
    const handleNameChange = (nameVal) => {
        const cleanName = nameVal.toLowerCase().replace(/[^a-z0-9]/g, '.');
        const autoEmail = nameVal ? `${cleanName}@iia.edu` : '';
        setTeacherForm({
            ...teacherForm,
            name: nameVal,
            email: autoEmail,
        });
    };
    const handleRegisterTeacher = (e) => {
        e.preventDefault();
        addUserAccount(teacherForm);
        setIsModalOpen(false);
        setTeacherForm({
            name: '',
            email: '',
            phone: '',
            password: 'password123',
            customRoleTitle: 'Senior Faculty Teacher',
            role: 'Teacher',
        });
    };
    // Filter staff members with Teacher or Counsellor role
    const staffList = users.filter((u) => u.role === 'Teacher' || u.role === 'Counsellor' || u.role === 'Admin');
    return (<div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Teacher & Faculty Directory
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
              {staffList.length} Active Staff Accounts
            </span>
          </h1>
          <p className="text-xs text-slate-400">Register new faculty teachers with auto-generated User IDs & passwords</p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition">
          <UserPlus className="w-4 h-4"/>
          <span>Register New Teacher</span>
        </button>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {staffList.map((member) => (<div key={member.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3">
              <img src={member.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'} alt={member.name} className="w-12 h-12 rounded-full border border-amber-500/40 object-cover"/>
              <div>
                <h3 className="text-sm font-bold text-slate-100">{member.name}</h3>
                <p className="text-[11px] text-amber-400 font-semibold">{member.customRoleTitle || member.role}</p>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <p className="flex justify-between">
                <span className="text-slate-400">Login User ID:</span>
                <span className="font-mono text-cyan-400 font-bold">{member.email}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400">Account Password:</span>
                <span className="font-mono text-slate-300">{member.password || 'password123'}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400">Phone Contact:</span>
                <span className="font-mono text-slate-300">{member.phone || 'N/A'}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px]">Assigned Role</span>
                <p className="font-bold text-slate-100 mt-0.5">{member.role}</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px]">Login Status</span>
                <p className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3"/> Active
                </p>
              </div>
            </div>
          </div>))}
      </div>

      {/* Register Teacher Modal */}
      {isModalOpen && (<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRegisterTeacher} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Register New Teacher Account</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Teacher Full Name</label>
              <input type="text" required placeholder="e.g. Prof. Sunita Sharma" value={teacherForm.name} onChange={(e) => handleNameChange(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Auto-Generated Login User ID / Email</label>
              <input type="email" required value={teacherForm.email} onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-400 font-mono focus:outline-none focus:border-amber-500"/>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Phone Contact Number</label>
              <input type="text" value={teacherForm.phone} onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })} placeholder="+91 98765 00000" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"/>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Custom Title / Specialization</label>
              <input type="text" placeholder="e.g. Senior Faculty Physics & German" value={teacherForm.customRoleTitle} onChange={(e) => setTeacherForm({ ...teacherForm, customRoleTitle: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Set Teacher Login Password</label>
              <input type="text" required value={teacherForm.password} onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"/>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
                Register Teacher Account
              </button>
            </div>
          </form>
        </div>)}
    </div>);
};
