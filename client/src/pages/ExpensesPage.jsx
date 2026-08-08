import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, X } from 'lucide-react';
export const ExpensesPage = () => {
    const { expenses, addExpense, fees } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({
        category: 'Rent',
        amount: 15000,
        date: new Date().toISOString().split('T')[0],
        remarks: '',
    });
    const totalCollected = fees.reduce((acc, f) => acc + f.paidTotal, 0);
    const totalExp = expenses.reduce((acc, e) => acc + e.amount, 0);
    const netSurplus = totalCollected - totalExp;
    const handleSubmit = (e) => {
        e.preventDefault();
        addExpense(form);
        setIsModalOpen(false);
        setForm({ category: 'Rent', amount: 15000, date: new Date().toISOString().split('T')[0], remarks: '' });
    };
    return (<div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            IIA Facility Expenses & Profit / Loss Accounting
          </h1>
          <p className="text-xs text-slate-400">Track operating expenses, rent, faculty salaries, marketing, and net surplus in ₹</p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition">
          <Plus className="w-4 h-4"/>
          <span>Log New Operating Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Fee Income (INR)</span>
          <p className="text-xl font-black text-emerald-400 mt-2">₹{(totalCollected || 0).toLocaleString('en-IN')}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Operating Expenses (INR)</span>
          <p className="text-xl font-black text-rose-400 mt-2">₹{(totalExp || 0).toLocaleString('en-IN')}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Net Surplus / Margin</span>
          <p className="text-xl font-black text-amber-400 mt-2">₹{(netSurplus || 0).toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Expense Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Expense Ledger</h3>
          <span className="text-xs text-slate-400">{expenses.length} Records Logged</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold">
            <tr>
              <th className="p-4">Category</th>
              <th className="p-4">Amount (₹)</th>
              <th className="p-4">Date</th>
              <th className="p-4">Authorized By</th>
              <th className="p-4">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {expenses.map((exp) => (<tr key={exp._id} className="hover:bg-slate-900/50">
                <td className="p-4 font-bold text-slate-100">{exp.category}</td>
                <td className="p-4 font-mono font-bold text-rose-400">₹{(exp.amount || 0).toLocaleString('en-IN')}</td>
                <td className="p-4 text-slate-400">{exp.date}</td>
                <td className="p-4 text-slate-300">{exp.paidBy}</td>
                <td className="p-4 text-slate-400">{exp.remarks || '-'}</td>
              </tr>))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isModalOpen && (<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Log New Operating Expense</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Expense Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500">
                <option value="Rent">Campus Facility Rent</option>
                <option value="Salary">Faculty & Staff Salary</option>
                <option value="Marketing">Meta & Google Ads</option>
                <option value="Electricity">Electricity & Utilities</option>
                <option value="Internet">High-Speed Internet</option>
                <option value="Stationery">Stationery & Courseware</option>
                <option value="Maintenance">Facility Maintenance</option>
                <option value="Other">Other Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Amount (₹)</label>
              <input type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"/>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Remarks / Purpose</label>
              <input type="text" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="e.g. Monthly Lab Maintenance" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
                Save Expense Record
              </button>
            </div>
          </form>
        </div>)}
    </div>);
};
