import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { UserPlus, X, CheckCircle2, Shield, Trash2, Edit3, Lock, Crown, UserCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import { ALL_ROLES } from '../types';

export const StaffPage = () => {
  const { users, addUserAccount, updateUserAccount, deleteUserAccount, currentUser } = useAppStore();

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'password123',
    customRoleTitle: 'Senior Faculty Teacher',
    role: 'Teacher',
  });

  const handleNameChange = (nameVal) => {
    const cleanName = nameVal.toLowerCase().replace(/[^a-z0-9]/g, '.');
    const autoEmail = nameVal ? `${cleanName}@tela.edu.in` : '';
    setForm({
      ...form,
      name: nameVal,
      email: autoEmail,
    });
  };

  const handleRegisterUser = (e) => {
    e.preventDefault();
    addUserAccount(form);
    setIsRegisterModalOpen(false);
    setForm({
      name: '',
      email: '',
      phone: '',
      password: 'password123',
      customRoleTitle: 'Senior Faculty Teacher',
      role: 'Teacher',
    });
  };

  const handleUpdateRole = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserAccount(editingUser.id || editingUser._id, {
      name: editingUser.name,
      role: editingUser.role,
      customRoleTitle: editingUser.customRoleTitle || editingUser.role,
      phone: editingUser.phone,
    });
    setEditingUser(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmUser) return;
    deleteUserAccount(deleteConfirmUser.id || deleteConfirmUser._id);
    setDeleteConfirmUser(null);
  };

  return (
    <div className="space-y-6 font-sans text-slate-100 pb-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-100 tracking-wide">
              TELA Staff Directory & Live Access Control
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Create user accounts, grant role permissions (Owner, Admin, Counsellor, Teacher, Accountant), or revoke access dynamically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MongoDB Database Connected</span>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg shadow-amber-500/20 transition"
          >
            <UserPlus className="w-4 h-4 stroke-[3]" />
            <span>Register New User Account</span>
          </button>
        </div>
      </div>

      {/* Staff & User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map((member) => {
          const userId = member.id || member._id;
          const isSelf = currentUser?.id === userId || currentUser?._id === userId;

          return (
            <div key={userId} className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
                      alt={member.name}
                      className="w-12 h-12 rounded-2xl border border-amber-500/40 object-cover shadow-md"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                        {member.name}
                        {isSelf && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">You</span>}
                      </h3>
                      <p className="text-[11px] text-amber-400 font-semibold">{member.customRoleTitle || member.role}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-950 border border-slate-800 text-cyan-400 font-mono">
                    {member.role}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Login ID / Email:</span>
                    <span className="font-mono text-slate-200 font-semibold">{member.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Password:</span>
                    <span className="font-mono text-amber-400">{member.password || '••••••••'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone Contact:</span>
                    <span className="font-mono text-slate-300">{member.phone || '+91 98765 43210'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setEditingUser({ ...member })}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Role
                </button>

                {!isSelf && (
                  <button
                    onClick={() => setDeleteConfirmUser(member)}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-semibold text-xs transition inline-flex items-center gap-1"
                    title="Revoke User Access & Delete Account"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Revoke Access
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Register User Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRegisterUser} className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-400" /> Register User Account & Access Control
              </h3>
              <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikas Kumar"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">System Role Access</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value, customRoleTitle: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">Designation Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. German Language Faculty"
                  value={form.customRoleTitle}
                  onChange={(e) => setForm({ ...form, customRoleTitle: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300">Login ID / Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Account Password</label>
                <input
                  type="text"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">Phone Contact</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
                Create & Grant Access
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdateRole} className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Edit User Role & Permissions</h3>
              <button type="button" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300">User Name</label>
              <input
                type="text"
                required
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300">Assigned System Role</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300">Custom Designation Title</label>
              <input
                type="text"
                value={editingUser.customRoleTitle || ''}
                onChange={(e) => setEditingUser({ ...editingUser, customRoleTitle: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
                Save & Update Role
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Revoke Access Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold text-slate-100">Revoke User Access & Delete Account?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to revoke access for <strong>{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})?
              This will permanently revoke login access and remove this user from MongoDB database.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button onClick={() => setDeleteConfirmUser(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500"
              >
                Revoke Access & Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
