import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Receipt, X } from 'lucide-react';
export const FeesPage = () => {
    const { fees, payInstallment } = useAppStore();
    const [selectedFee, setSelectedFee] = useState(null);
    const [paymentModalFee, setPaymentModalFee] = useState(null);
    const [payMode, setPayMode] = useState('UPI');
    const [refText, setRefText] = useState('GPay-UPI-994182');
    const totalCollected = fees.reduce((acc, f) => acc + f.paidTotal, 0);
    const totalPending = fees.reduce((acc, f) => acc + f.remainingTotal, 0);
    const handlePay = () => {
        if (!paymentModalFee)
            return;
        payInstallment(paymentModalFee.fee._id, paymentModalFee.instNo, paymentModalFee.amount, payMode, refText);
        setPaymentModalFee(null);
    };
    return (<div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            IIA Fees Management & UPI Receipts
          </h1>
          <p className="text-xs text-slate-400">Installment schedules, GPay/PhonePe UPI recording, auto PDF receipts, and pending dues in ₹</p>
        </div>

        <div className="flex gap-3 text-xs font-semibold">
          <div className="bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 px-3 py-1.5 rounded-xl">
            Collected: ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <div className="bg-amber-950/60 border border-amber-800/60 text-amber-400 px-3 py-1.5 rounded-xl">
            Pending: ₹{totalPending.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Student Name</th>
                <th className="p-4">Course / Program</th>
                <th className="p-4">Total Net Fee</th>
                <th className="p-4">Paid Total (₹)</th>
                <th className="p-4">Pending (₹)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {fees.map((fee) => (<tr key={fee._id} className="hover:bg-slate-900/50 transition">
                  <td className="p-4 font-bold text-slate-100">
                    <p>{fee.studentName}</p>
                    <p className="text-[10px] font-mono text-amber-400">{fee.studentCode}</p>
                  </td>
                  <td className="p-4 text-slate-300">{fee.courseName}</td>
                  <td className="p-4 text-slate-200 font-semibold">₹{fee.netFee.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-emerald-400 font-semibold">₹{fee.paidTotal.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-amber-400 font-semibold">₹{fee.remainingTotal.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${fee.status === 'Paid'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                : 'bg-amber-950 text-amber-400 border border-amber-800/40'}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => setSelectedFee(fee)} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold">
                      Installments
                    </button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Installment Detail & Payment Modal */}
      {selectedFee && (<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{selectedFee.studentName}</h3>
                <p className="text-xs text-amber-400">{selectedFee.courseName} • Fee Installment Schedule</p>
              </div>
              <button onClick={() => setSelectedFee(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="space-y-3">
              {selectedFee.installments.map((inst) => (<div key={inst.installmentNo} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-200">Installment #{inst.installmentNo} — ₹{inst.amount.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-slate-400">Due Date: {inst.dueDate}</p>
                  </div>

                  {inst.status === 'Paid' ? (<div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800/40">
                        Paid ({inst.mode})
                      </span>
                      <button onClick={() => alert(`Downloading official PDF receipt for ${selectedFee.studentName} - Installment #${inst.installmentNo}`)} className="p-1.5 rounded bg-slate-800 text-amber-400 hover:bg-slate-700" title="Download Receipt PDF">
                        <Receipt className="w-4 h-4"/>
                      </button>
                    </div>) : (<button onClick={() => setPaymentModalFee({
                        fee: selectedFee,
                        instNo: inst.installmentNo,
                        amount: inst.amount - inst.paidAmount,
                    })} className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition">
                      Record Payment
                    </button>)}
                </div>))}
            </div>
          </div>
        </div>)}

      {/* Pay Action Modal */}
      {paymentModalFee && (<div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Record Fee Payment</h3>
            <p className="text-xs text-slate-400">
              Student: <strong>{paymentModalFee.fee.studentName}</strong> (Installment #{paymentModalFee.instNo})
            </p>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Amount Received (₹)</label>
              <input type="number" value={paymentModalFee.amount} onChange={(e) => setPaymentModalFee({ ...paymentModalFee, amount: Number(e.target.value) })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"/>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Payment Gateway / Mode</label>
              <select value={payMode} onChange={(e) => setPayMode(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500">
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">NEFT / RTGS Bank Transfer</option>
                <option value="Card">Debit / Credit Card</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">UPI / Transaction Ref ID</label>
              <input type="text" value={refText} onChange={(e) => setRefText(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"/>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button onClick={() => setPaymentModalFee(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                Cancel
              </button>
              <button onClick={handlePay} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500">
                Confirm Payment & Generate PDF Receipt
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
