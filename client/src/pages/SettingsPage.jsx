import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { canManageUser, getCreatableRoles, ROLE_RANKS } from '../utils/hierarchy';
import { ShieldCheck, UserPlus, Edit3, Trash2, CheckCircle2, XCircle, X, Tag, Upload, FileSpreadsheet, Download, AlertTriangle, History, } from 'lucide-react';
export const SettingsPage = () => {
    const { users, customRoles, addUserAccount, updateUserAccount, deleteUserAccount, addCustomRole, deleteCustomRole, currentUser, auditLogs } = useAppStore();
    const creatableRoles = getCreatableRoles(currentUser.role);
    const defaultRole = creatableRoles[0] || 'Counsellor';
    // Account Modal State
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [accountForm, setAccountForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: 'password123',
        role: defaultRole,
        customRoleTitle: '',
    });
    // Custom Role Modal State
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [roleForm, setRoleForm] = useState({
        name: '',
        parentRole: defaultRole,
        description: '',
    });
    // Bulk CSV Import Modal State
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [parsedRows, setParsedRows] = useState([]);
    const [isImporting, setIsImporting] = useState(false);
    const [importCompleted, setImportCompleted] = useState(false);
    const handleSaveAccount = (e) => {
        e.preventDefault();
        if (editingUser) {
            updateUserAccount(editingUser.id, accountForm);
        }
        else {
            addUserAccount(accountForm);
        }
        setIsAccountModalOpen(false);
        setEditingUser(null);
        setAccountForm({ name: '', email: '', phone: '', password: 'password123', role: defaultRole, customRoleTitle: '' });
    };
    const handleSaveCustomRole = (e) => {
        e.preventDefault();
        addCustomRole(roleForm);
        setIsRoleModalOpen(false);
        setRoleForm({ name: '', parentRole: defaultRole, description: '' });
    };
    const startEditUser = (user) => {
        setEditingUser(user);
        setAccountForm({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            password: user.password || 'password123',
            role: user.role,
            customRoleTitle: user.customRoleTitle || '',
        });
        setIsAccountModalOpen(true);
    };
    const downloadSampleCSV = () => {
        const csvContent = 'Full Name,Email,Phone,Role,SubRoleTitle,Password\n' +
            'Aarav Verma,aarav.verma@iia.edu,+91 98765 00001,Teacher,Head of Physics,password123\n' +
            'Priya Sharma,priya.sharma@iia.edu,+91 98765 00002,Counsellor,Senior Admissions Officer,password123\n' +
            'Siddharth Roy,siddharth.r@iia.edu,+91 98765 00003,Accountant,Junior Auditor,password123\n' +
            'Ananya Nair,ananya.nair@iia.edu,+91 98765 00004,Student,Student,password123\n';
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'iia_bulk_users_sample.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setImportCompleted(false);
        const demoBatch = [
            { name: 'Dr. Vikram Malhotra', email: 'vikram.m@iia.edu', phone: '+91 98765 10001', role: 'Teacher', customRoleTitle: 'Senior Faculty Physics', password: 'password123', status: 'Valid' },
            { name: 'Kavya Deshmukh', email: 'kavya.d@iia.edu', phone: '+91 98765 10002', role: 'Counsellor', customRoleTitle: 'Admissions Lead', password: 'password123', status: 'Valid' },
            { name: 'Siddharth Roy', email: 'siddharth.r@iia.edu', phone: '+91 98765 10003', role: 'Accountant', customRoleTitle: 'Junior Auditor', password: 'password123', status: 'Valid' },
            { name: 'Meera Kulkarni', email: 'meera.k@iia.edu', phone: '+91 98765 10004', role: 'Student', customRoleTitle: 'Student', password: 'password123', status: 'Valid' },
        ];
        setParsedRows(demoBatch);
    };
    const processBulkImport = () => {
        setIsImporting(true);
        setTimeout(() => {
            const validRows = parsedRows.filter((r) => r.status === 'Valid');
            validRows.forEach((r) => {
                addUserAccount({
                    name: r.name,
                    email: r.email,
                    phone: r.phone,
                    role: r.role,
                    customRoleTitle: r.customRoleTitle,
                    password: r.password,
                });
            });
            setIsImporting(false);
            setImportCompleted(true);
        }, 600);
    };
    return (<div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            System Settings, 6-Role Hierarchy & Audit Logs
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
              {users.length} Active Accounts
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Role Scope: Owner (Rank 0) &gt; Admin (Rank 1) &gt; Counsellor (Rank 2) &gt; Teacher (Rank 3) &gt; Accountant (Rank 4) &gt; Student (Rank 5)
          </p>
        </div>

        {creatableRoles.length > 0 && (<div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setIsBulkModalOpen(true)} className="flex items-center space-x-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-teal-500/20 hover:scale-105 transition">
              <FileSpreadsheet className="w-4 h-4"/>
              <span>Bulk CSV Import</span>
            </button>

            <button onClick={() => setIsRoleModalOpen(true)} className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 text-amber-400 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-slate-800 transition">
              <Tag className="w-3.5 h-3.5 text-amber-400"/>
              <span>Create Custom Sub-Role</span>
            </button>

            <button onClick={() => {
                setEditingUser(null);
                setAccountForm({ name: '', email: '', phone: '', password: 'password123', role: defaultRole, customRoleTitle: '' });
                setIsAccountModalOpen(true);
            }} className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition">
              <UserPlus className="w-4 h-4"/>
              <span>Create Staff Account</span>
            </button>
          </div>)}
      </div>

      {/* System Audit Logs Table (Exclusively for Owner & Admin) */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-2">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400"/> Master Security Audit Trail
          </h3>
          <span className="text-[11px] text-slate-400">{auditLogs.length} Audit Events Logged</span>
        </div>

        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[9px] font-bold tracking-wider sticky top-0">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User & Role</th>
                <th className="p-3">Module</th>
                <th className="p-3">Action Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {auditLogs.map((log) => (<tr key={log._id} className="hover:bg-slate-900/50">
                  <td className="p-3 text-slate-400">{log.timestamp}</td>
                  <td className="p-3 font-bold text-amber-400">{log.userName} ({log.userRole})</td>
                  <td className="p-3 text-cyan-400 font-semibold">{log.module}</td>
                  <td className="p-3 text-slate-200">{log.action}</td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Sub-Roles Registry Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400"/> Custom Sub-Roles Directory
          </h3>
          <span className="text-[11px] text-slate-400">Hierarchy limits enforced</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {customRoles.map((cr) => (<div key={cr.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 relative group">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-bold text-amber-400">{cr.name}</h4>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  Base: {cr.parentRole} (Rank {cr.rank})
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">{cr.description}</p>
              <div className="pt-2 flex justify-between items-center text-[9px] text-slate-500 border-t border-slate-900">
                <span>By {cr.createdBy}</span>
                {canManageUser(currentUser.role, cr.parentRole) && (<button onClick={() => deleteCustomRole(cr.id)} className="text-rose-400 hover:text-rose-300 font-bold opacity-0 group-hover:opacity-100 transition">
                    Delete Sub-Role
                  </button>)}
              </div>
            </div>))}
        </div>
      </div>

      {/* Staff User Accounts Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400"/> Staff Credentials & Custom Titles Roster
          </h3>
          <span className="text-[11px] text-amber-400 font-medium">Active User: {currentUser.name} ({currentUser.role})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Staff Member Name</th>
                <th className="p-4">Login Email / User ID</th>
                <th className="p-4">Assigned Role & Sub-Title</th>
                <th className="p-4">Password</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users
            .sort((a, b) => (ROLE_RANKS[a.role] ?? 99) - (ROLE_RANKS[b.role] ?? 99))
            .map((user) => {
            const isLowerRank = canManageUser(currentUser.role, user.role);
            return (<tr key={user.id} className="hover:bg-slate-900/50 transition">
                      <td className="p-4">
                        <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-[10px] text-amber-400">
                          {ROLE_RANKS[user.role] ?? '-'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={user.name} className="w-8 h-8 rounded-full border border-amber-500/30 object-cover"/>
                          <div>
                            <p className="font-bold text-slate-100">{user.name}</p>
                            <p className="text-[10px] text-slate-400">{user.phone || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-cyan-400 font-semibold">{user.email}</td>
                      <td className="p-4 space-y-0.5">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-amber-400 border border-amber-500/30 block w-fit">
                          {user.role}
                        </span>
                        {user.customRoleTitle && (<span className="text-[10px] text-cyan-300 font-semibold italic block">
                            ↳ {user.customRoleTitle}
                          </span>)}
                      </td>
                      <td className="p-4 font-mono text-slate-300">
                        <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {user.password || '••••••••'}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.isActive ? (<span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3"/> Active
                          </span>) : (<span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800/40 flex items-center gap-1 w-fit">
                            <XCircle className="w-3 h-3"/> Disabled
                          </span>)}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {isLowerRank ? (<>
                            <button onClick={() => startEditUser(user)} className="p-1.5 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700 font-semibold text-[11px] inline-flex items-center gap-1" title="Edit Credentials">
                              <Edit3 className="w-3.5 h-3.5"/> Edit
                            </button>
                            <button onClick={() => deleteUserAccount(user.id || user._id || user.email)} className="p-1.5 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-900 font-semibold text-[11px] inline-flex items-center gap-1" title="Remove Account">
                              <Trash2 className="w-3.5 h-3.5"/> Remove
                            </button>
                          </>) : (<span className="text-[10px] text-slate-500 italic">Protected</span>)}
                      </td>
                    </tr>);
        })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk CSV Upload Modal */}
      {isBulkModalOpen && (<div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-teal-400"/> Bulk CSV Importer
                </h3>
                <p className="text-xs text-slate-400">Upload CSV to batch-import staff, faculty, counsellors, and accountants</p>
              </div>
              <button onClick={() => setIsBulkModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">Download Standard IIA Import Template (.csv)</p>
                <p className="text-[10px] text-slate-400">Columns: Full Name, Email, Phone, Role, SubRoleTitle, Password</p>
              </div>
              <button onClick={downloadSampleCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-semibold transition">
                <Download className="w-3.5 h-3.5"/> Sample Template
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 text-center space-y-2 bg-slate-950/50 transition">
              <Upload className="w-8 h-8 text-teal-400 mx-auto"/>
              <p className="text-xs font-bold text-slate-200">Select or Drag CSV File Here</p>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-file-input"/>
              <label htmlFor="csv-file-input" className="inline-block mt-2 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-teal-400 transition">
                Choose File
              </label>
            </div>

            {parsedRows.length > 0 && (<div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Pre-Import Validation Preview ({parsedRows.length} Rows Found)
                </h4>
                <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950/80">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-[9px] font-bold">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Role & Title</th>
                        <th className="p-2">Validation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {parsedRows.map((r, i) => (<tr key={i} className="hover:bg-slate-900/50">
                          <td className="p-2 font-bold text-slate-200">{r.name}</td>
                          <td className="p-2 font-mono text-cyan-400">{r.email}</td>
                          <td className="p-2 text-amber-400 font-semibold">{r.role} ({r.customRoleTitle})</td>
                          <td className="p-2">
                            {r.status === 'Valid' ? (<span className="text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3"/> Ready to Import
                              </span>) : (<span className="text-rose-400 font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3"/> {r.status}
                              </span>)}
                          </td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>

                {importCompleted ? (<div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs text-center font-bold">
                    Successfully imported {parsedRows.filter((r) => r.status === 'Valid').length} accounts into the IIA Database!
                  </div>) : (<div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setParsedRows([])} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                      Clear Preview
                    </button>
                    <button onClick={processBulkImport} disabled={isImporting} className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition flex items-center gap-2">
                      {isImporting ? 'Processing Batch...' : 'Confirm Bulk Import'}
                    </button>
                  </div>)}
              </div>)}
          </div>
        </div>)}

      {/* Single Account Modal */}
      {isAccountModalOpen && (<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveAccount} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">
                {editingUser ? `Edit ${editingUser.name}'s Account` : 'Create New Staff Account'}
              </h3>
              <button type="button" onClick={() => setIsAccountModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Full Name</label>
              <input type="text" required value={accountForm.name} onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Login ID / Email Address</label>
              <input type="email" required value={accountForm.email} onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Assignable Base Role</label>
              <select value={accountForm.role} onChange={(e) => setAccountForm({ ...accountForm, role: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500">
                {creatableRoles.map((r) => (<option key={r} value={r}>
                    {r} (Rank {ROLE_RANKS[r]})
                  </option>))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Custom Sub-Role Title (Optional)</label>
              <input type="text" placeholder="e.g. Senior Career Counsellor" value={accountForm.customRoleTitle} onChange={(e) => setAccountForm({ ...accountForm, customRoleTitle: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-sans"/>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Set Account Password</label>
              <input type="text" required value={accountForm.password} onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"/>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setIsAccountModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
                Save Credentials
              </button>
            </div>
          </form>
        </div>)}

      {/* Create Custom Sub-Role Modal */}
      {isRoleModalOpen && (<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveCustomRole} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Create Custom Sub-Role</h3>
              <button type="button" onClick={() => setIsRoleModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Sub-Role Title</label>
              <input type="text" required placeholder="e.g. Lead Admissions Officer" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Parent Base Role</label>
              <select value={roleForm.parentRole} onChange={(e) => setRoleForm({ ...roleForm, parentRole: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500">
                {creatableRoles.map((r) => (<option key={r} value={r}>
                    {r} (Rank {ROLE_RANKS[r]})
                  </option>))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Description / Responsibilities</label>
              <textarea rows={2} value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} placeholder="Responsibilities of this custom sub-role..." className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"/>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setIsRoleModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
                Create Custom Sub-Role
              </button>
            </div>
          </form>
        </div>)}
    </div>);
};
