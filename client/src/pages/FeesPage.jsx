import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Receipt,
  X,
  Plus,
  Search,
  CreditCard,
  CheckCircle2,
  Calendar,
  User,
  BookOpen,
  Printer,
  Download,
  Sparkles,
  SlidersHorizontal,
  ArrowUpRight,
  MessageSquare,
  Clock,
  Edit3,
  AlertTriangle,
  Bell,
} from 'lucide-react';

export const FeesPage = () => {
  const { fees, students, payInstallment, recordManualPayment, updateFeeNote, updateFeeDueDate } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Paid' | 'Partial' | 'Pending' | 'Due Soon'
  const [planFilter, setPlanFilter] = useState('All');

  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentModalFee, setPaymentModalFee] = useState(null);
  const [viewReceiptModal, setViewReceiptModal] = useState(null);
  const [editingNoteFee, setEditingNoteFee] = useState(null);
  const [editingDueDateFee, setEditingDueDateFee] = useState(null);

  const [tempNote, setTempNote] = useState('');
  const [tempDueDate, setTempDueDate] = useState('');

  // Manual Collection Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [paymentPlan, setPaymentPlan] = useState('Monthly'); // 'Monthly' | 'Full Package'
  const [amount, setAmount] = useState('');
  const [payMode, setPayMode] = useState('UPI');
  const [refText, setRefText] = useState(`GPay-${Math.floor(100000 + Math.random() * 900000)}`);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const totalCollected = fees.reduce((acc, f) => acc + (f.paidTotal || 0), 0);
  const totalPending = fees.reduce((acc, f) => acc + (f.remainingTotal || 0), 0);
  const totalNet = fees.reduce((acc, f) => acc + (f.netFee || 0), 0);

  // Filtered Fees
  const filteredFees = fees.filter((f) => {
    const matchesSearch =
      f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.courseName.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'Due Soon') {
      matchesStatus = f.remainingTotal > 0;
    } else if (statusFilter !== 'All') {
      matchesStatus = f.status === statusFilter;
    }

    const matchesPlan =
      planFilter === 'All' ||
      (planFilter === 'Monthly' && (f.paymentPlan === 'Monthly' || !f.paymentPlan)) ||
      (planFilter === 'Full Package' && f.paymentPlan === 'Full Package');

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // When student selection changes in manual modal
  const handleStudentSelect = (stdId) => {
    setSelectedStudentId(stdId);
    const std = students.find((s) => s._id === stdId);
    if (std) {
      const existingFee = fees.find((f) => f.studentId === std._id || f.studentCode === std.studentId);
      if (existingFee) {
        if (paymentPlan === 'Full Package') {
          setAmount(existingFee.remainingTotal > 0 ? existingFee.remainingTotal : existingFee.netFee);
        } else {
          setAmount(Math.round(existingFee.netFee / 4));
        }
      } else {
        setAmount(paymentPlan === 'Full Package' ? 30000 : 7500);
      }
    }
  };

  const handlePlanChange = (plan) => {
    setPaymentPlan(plan);
    const std = students.find((s) => s._id === selectedStudentId);
    if (std) {
      const existingFee = fees.find((f) => f.studentId === std._id || f.studentCode === std.studentId);
      if (existingFee) {
        if (plan === 'Full Package') {
          setAmount(existingFee.remainingTotal > 0 ? existingFee.remainingTotal : existingFee.netFee);
        } else {
          setAmount(Math.round(existingFee.netFee / 4));
        }
      } else {
        setAmount(plan === 'Full Package' ? 30000 : 7500);
      }
    }
  };

  const handlePayInstallment = () => {
    if (!paymentModalFee) return;
    payInstallment(paymentModalFee.fee._id, paymentModalFee.instNo, paymentModalFee.amount, payMode, refText);

    const updatedInst = {
      installmentNo: paymentModalFee.instNo,
      amount: paymentModalFee.amount,
      payMode,
      refText,
      paidDate: new Date().toISOString().split('T')[0],
    };

    setViewReceiptModal({
      fee: {
        ...paymentModalFee.fee,
        paidTotal: paymentModalFee.fee.paidTotal + paymentModalFee.amount,
        remainingTotal: Math.max(0, paymentModalFee.fee.remainingTotal - paymentModalFee.amount),
      },
      inst: updatedInst,
    });
    setPaymentModalFee(null);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudentId || !amount) return;

    const std = students.find((s) => s._id === selectedStudentId);
    const result = recordManualPayment({
      studentId: std?._id,
      studentName: std?.name || 'Student',
      studentCode: std?.studentId || `IIA-1001`,
      courseName: std?.courseName || 'German Language A1',
      paymentPlan,
      amount: Number(amount),
      payMode,
      refText,
      notes,
      paymentDate,
    });

    if (result.success) {
      setIsManualModalOpen(false);
      setViewReceiptModal({
        fee: result.fee,
        inst: result.inst,
      });
      // Reset form
      setAmount('');
      setNotes('');
      setRefText(`GPay-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  };

  // WhatsApp Bill / Due Notification Sender
  const handleSendReminder = (feeObj) => {
    const std = students.find((s) => s.studentId === feeObj.studentCode || s._id === feeObj.studentId);
    const phone = std?.parentWhatsapp || std?.parentPhone || std?.phone || '+919900000000';
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    const dueDateStr = feeObj.nextDueDate || '15th of this month';
    const message = `Hello! Fee payment reminder from *The European Language Academy (TELA Kaithal)*.

Dear Parent/Student of *${feeObj.studentName}* (${feeObj.studentCode}),
Your monthly fee installment for *${feeObj.courseName}* is due on *${dueDateStr}*.

- Remaining Dues: *₹${(feeObj.remainingTotal || 0).toLocaleString('en-IN')}*
- Payment Plan: *${feeObj.paymentPlan || 'Monthly Plan'}*

Please make the payment via GPay/UPI/Cash at the institute counter. Ignore if already paid. Thank you!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6 font-sans text-slate-100 pb-10">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CreditCard className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-100 tracking-wide">
              TELA Fees Management, Notes & Automated Reminders
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Record manual monthly installments or full package payments, add payment notes, set due dates & send 1-click WhatsApp bill reminders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setIsManualModalOpen(true);
              if (students.length > 0 && !selectedStudentId) {
                handleStudentSelect(students[0]._id);
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Record / Collect Manual Payment
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950/90">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Net Course Revenue</p>
          <p className="text-2xl font-black text-slate-100 mt-2 font-mono">₹{totalNet.toLocaleString('en-IN')}</p>

          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Enrolled Students: {fees.length}</span>
            <span className="text-amber-400 font-semibold">100% Tracked</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-emerald-950/30 via-slate-900/90 to-slate-950/90">
          <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Total Fees Collected</p>
          <p className="text-2xl font-black text-emerald-400 mt-2 font-mono">₹{totalCollected.toLocaleString('en-IN')}</p>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Collection Rate: {totalNet ? Math.round((totalCollected / totalNet) * 100) : 0}%</span>
            <span className="text-emerald-400 font-semibold">Verified Receipts</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-900/40 bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-950/90">
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Total Dues Pending</p>
          <p className="text-2xl font-black text-amber-400 mt-2 font-mono">₹{totalPending.toLocaleString('en-IN')}</p>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Pending Accounts: {fees.filter((f) => f.remainingTotal > 0).length}</span>
            <button
              onClick={() => setStatusFilter('Due Soon')}
              className="text-amber-400 font-bold hover:underline flex items-center gap-1"
            >
              <Bell className="w-3 h-3" /> Remind All Due
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name, ID, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['All', 'Due Soon', 'Paid', 'Partial', 'Pending'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-semibold transition text-[11px] ${
                  statusFilter === st
                    ? st === 'Due Soon'
                      ? 'bg-rose-500 text-white shadow'
                      : 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'Due Soon' ? '🚨 Reminders / Due' : st}
              </button>
            ))}
          </div>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Plans</option>
            <option value="Monthly">Monthly Plan</option>
            <option value="Full Package">Full Package Plan</option>
          </select>
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Student & Code</th>
                <th className="p-4">Course / Program</th>
                <th className="p-4">Payment Plan</th>
                <th className="p-4">Paid / Net Fee</th>
                <th className="p-4">Pending Dues (₹)</th>
                <th className="p-4">Next Due Date</th>
                <th className="p-4">Payment Notes</th>
                <th className="p-4 text-right">Actions & Reminders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                    No fee records match your search query or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-slate-900/60 transition">
                    <td className="p-4 font-bold text-slate-100">
                      <p>{fee.studentName}</p>
                      <p className="text-[10px] font-mono text-amber-400">{fee.studentCode}</p>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{fee.courseName}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                          fee.paymentPlan === 'Full Package'
                            ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                            : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
                        }`}
                      >
                        {fee.paymentPlan || 'Monthly Plan'}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold">
                      <span className="text-emerald-400">₹{(fee.paidTotal || 0).toLocaleString('en-IN')}</span>
                      <span className="text-slate-500 font-normal"> / ₹{(fee.netFee || 0).toLocaleString('en-IN')}</span>
                    </td>
                    <td className="p-4 text-amber-400 font-mono font-bold">₹{(fee.remainingTotal || 0).toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-300 font-mono font-medium">{fee.nextDueDate || '2026-08-15'}</span>
                        <button
                          onClick={() => {
                            setEditingDueDateFee(fee);
                            setTempDueDate(fee.nextDueDate || '2026-08-15');
                          }}
                          className="p-1 text-slate-400 hover:text-amber-400 transition"
                          title="Change Due Date"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 max-w-xs truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate italic text-[11px]">
                          {fee.notes || 'No remarks added yet'}
                        </span>
                        <button
                          onClick={() => {
                            setEditingNoteFee(fee);
                            setTempNote(fee.notes || '');
                          }}
                          className="p-1 text-slate-400 hover:text-amber-400 transition shrink-0"
                          title="Add/Edit Payment Note"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {fee.remainingTotal > 0 && (
                        <button
                          onClick={() => handleSendReminder(fee)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 hover:bg-emerald-900 font-semibold text-[11px] transition inline-flex items-center gap-1"
                          title="Send WhatsApp Payment Due Notification"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Remind
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedFee(fee)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold transition text-[11px]"
                      >
                        Breakdown & History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Payment Note Modal */}
      {editingNoteFee && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Fee Payment Remarks & Notes</h3>
              <button onClick={() => setEditingNoteFee(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Student: <strong>{editingNoteFee.studentName}</strong> ({editingNoteFee.studentCode})
            </p>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Fee Notes / Counter Remarks</label>
              <textarea
                rows={3}
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="e.g. Parent promised GPay transfer by 15th August for Monthly Installment #2"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setEditingNoteFee(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                Cancel
              </button>
              <button
                onClick={() => {
                  updateFeeNote(editingNoteFee._id, tempNote);
                  setEditingNoteFee(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Save Payment Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Due Date Modal */}
      {editingDueDateFee && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Update Monthly Installment Due Date</h3>
              <button onClick={() => setEditingDueDateFee(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Student: <strong>{editingDueDateFee.studentName}</strong> ({editingDueDateFee.studentCode})
            </p>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Next Payment Due Date</label>
              <input
                type="date"
                value={tempDueDate}
                onChange={(e) => setTempDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setEditingDueDateFee(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                Cancel
              </button>
              <button
                onClick={() => {
                  updateFeeDueDate(editingDueDateFee._id, tempDueDate);
                  setEditingDueDateFee(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Save Due Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Collect Payment Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Plus className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Record / Collect Manual Fee Payment</h3>
                  <p className="text-[11px] text-slate-400">Add payment for Monthly Installment or Full Package Plan</p>
                </div>
              </div>
              <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
              {/* Select Student */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Select Student Account</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-medium"
                  required
                >
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.studentId}) — {s.courseName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Payment Plan */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Payment Plan / Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handlePlanChange('Monthly')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                      paymentPlan === 'Monthly'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="text-xs">Monthly Installment</p>
                      <p className="text-[10px] text-slate-500 font-normal">Pay recurring monthly dues</p>
                    </div>
                    {paymentPlan === 'Monthly' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlanChange('Full Package')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                      paymentPlan === 'Full Package'
                        ? 'bg-purple-500/10 border-purple-500 text-purple-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="text-xs">Full Package One-Time</p>
                      <p className="text-[10px] text-slate-500 font-normal">Clear complete course fee at once</p>
                    </div>
                    {paymentPlan === 'Full Package' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                  </button>
                </div>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Amount Received (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in ₹"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Mode & Reference */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Payment Gateway / Mode</label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash Counter</option>
                    <option value="Bank Transfer">NEFT / RTGS Bank Transfer</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Cheque">Bank Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Txn Ref / Cheque / Receipt No</label>
                  <input
                    type="text"
                    value={refText}
                    onChange={(e) => setRefText(e.target.value)}
                    placeholder="Ref or Txn ID"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Receipt Notes / Remarks</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional remarks (e.g. Monthly installment 1 of 4 paid at counter)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Confirm Payment & Issue Official Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Installments Breakdown Modal */}
      {selectedFee && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{selectedFee.studentName}</h3>
                <p className="text-xs text-amber-400">
                  {selectedFee.courseName} • ({selectedFee.studentCode})
                </p>
              </div>
              <button onClick={() => setSelectedFee(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center text-xs font-mono">
              <div>
                <p className="text-[10px] text-slate-400">Net Fee</p>
                <p className="font-bold text-slate-100">₹{selectedFee.netFee?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-[10px] text-emerald-400">Paid Total</p>
                <p className="font-bold text-emerald-400">₹{selectedFee.paidTotal?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-[10px] text-amber-400">Remaining</p>
                <p className="font-bold text-amber-400">₹{selectedFee.remainingTotal?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {selectedFee.installments.map((inst) => (
                <div
                  key={inst.installmentNo}
                  className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-200">
                      Payment Entry #{inst.installmentNo} — ₹{(inst.amount || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Date: {inst.paidDate || inst.dueDate || 'N/A'} • {inst.paymentPlan || selectedFee.paymentPlan || 'Monthly Plan'}
                    </p>
                    {inst.notes && <p className="text-[10px] text-amber-300 italic mt-0.5">Note: {inst.notes}</p>}
                  </div>

                  {inst.status === 'Paid' ? (
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800/40">
                        Paid ({inst.payMode || 'UPI'})
                      </span>
                      <button
                        onClick={() => setViewReceiptModal({ fee: selectedFee, inst })}
                        className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 transition"
                        title="View Official Receipt"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setPaymentModalFee({
                          fee: selectedFee,
                          instNo: inst.installmentNo,
                          amount: inst.amount - (inst.paidAmount || 0),
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
                    >
                      Record Payment
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Record Pending Installment Pay Modal */}
      {paymentModalFee && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100">Record Fee Installment Payment</h3>
            <p className="text-xs text-slate-400">
              Student: <strong>{paymentModalFee.fee.studentName}</strong> (Installment #{paymentModalFee.instNo})
            </p>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Amount Received (₹)</label>
              <input
                type="number"
                value={paymentModalFee.amount}
                onChange={(e) => setPaymentModalFee({ ...paymentModalFee, amount: Number(e.target.value) })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Payment Gateway / Mode</label>
              <select
                value={payMode}
                onChange={(e) => setPayMode(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">NEFT / RTGS Bank Transfer</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="Cheque">Bank Cheque</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">UPI / Cheque / Transaction Ref ID</label>
              <input
                type="text"
                value={refText}
                onChange={(e) => setRefText(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => setPaymentModalFee(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePayInstallment}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 text-slate-950 font-bold text-xs hover:bg-emerald-500"
              >
                Confirm Payment & Issue Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Fee Receipt View & Print Modal */}
      {viewReceiptModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Official TELA Fee Receipt
              </span>
              <button onClick={() => setViewReceiptModal(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs font-sans">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-700 shadow-md">
                    <img src="/logo.png" alt="TELA Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-100 text-sm tracking-wide">THE EUROPEAN LANGUAGE ACADEMY</h2>
                    <p className="text-[10px] text-amber-400 font-semibold">TELA — Kaithal • Official Fee Receipt</p>
                  </div>
                </div>
                <span className="font-mono text-amber-400 text-[11px] font-bold">
                  RECEIPT #{viewReceiptModal.inst.refText || 'REC-99182'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Student Name:</span>{' '}
                  <strong className="text-slate-200">{viewReceiptModal.fee.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Student ID:</span>{' '}
                  <strong className="text-amber-400 font-mono">{viewReceiptModal.fee.studentCode}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Course / Level:</span>{' '}
                  <strong className="text-slate-200">{viewReceiptModal.fee.courseName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Payment Plan:</span>{' '}
                  <strong className="text-purple-300">{viewReceiptModal.inst.paymentPlan || viewReceiptModal.fee.paymentPlan || 'Monthly Plan'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Payment Mode:</span>{' '}
                  <strong className="text-emerald-400">{viewReceiptModal.inst.payMode || 'Cash'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Date:</span>{' '}
                  <strong className="text-slate-300 font-mono">{viewReceiptModal.inst.paidDate || new Date().toISOString().split('T')[0]}</strong>
                </div>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 font-mono">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Amount Received:</span>
                  <strong className="text-emerald-400 text-sm font-bold">₹{viewReceiptModal.inst.amount?.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Transaction Ref / Receipt No:</span>
                  <span className="text-slate-200 font-semibold">{viewReceiptModal.inst.refText || 'GPay-994182'}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Remaining Course Dues:</span>
                  <span className="text-amber-400 font-bold">₹{viewReceiptModal.fee.remainingTotal?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 text-center text-[10px] text-slate-500 italic">
                Computer-generated official receipt • Verified by TELA Accounts & Management Department (Kaithal)
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 shadow-lg shadow-amber-500/20"
              >
                <Printer className="w-4 h-4" /> Print / Export Official PDF Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
