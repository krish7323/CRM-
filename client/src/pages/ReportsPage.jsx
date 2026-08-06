import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { exportToExcel } from '../utils/excelExporter';
import { Download, FileSpreadsheet, Users, GraduationCap, CircleDollarSign, Receipt, ShieldCheck } from 'lucide-react';
export const ReportsPage = () => {
    const { users, students, leads, fees, expenses, customRoles } = useAppStore();
    const handleExportStaff = () => {
        const staffData = users.map((u) => ({
            'User ID': u.id,
            'Full Name': u.name,
            'Email / Login ID': u.email,
            'Phone Number': u.phone || 'N/A',
            'Assigned Base Role': u.role,
            'Custom Sub-Role Title': u.customRoleTitle || 'Standard',
            'Account Status': u.isActive ? 'Active' : 'Disabled',
        }));
        exportToExcel(staffData, 'IIA_Staff_Credentials_Ledger');
    };
    const handleExportStudents = () => {
        const studentData = students.map((s) => ({
            'Student ID': s.studentId,
            'Full Name': s.name,
            'Parent / Guardian Name': s.parentName || 'N/A',
            'Phone Number': s.phone,
            'Email': s.email,
            'Address': s.address,
            'Program Course': s.courseName,
            'Grade / Level': s.level,
            'Batch Code': s.batchCode || 'N/A',
            'Joining Date': s.joiningDate,
            'Account Status': s.isActive ? 'Active' : 'Inactive',
        }));
        exportToExcel(studentData, 'IIA_Students_Master_Registry');
    };
    const handleExportLeads = () => {
        const leadData = leads.map((l) => ({
            'Lead ID': l._id,
            'Candidate Name': l.name,
            'Parent Name': l.parentName || 'N/A',
            'Phone Number': l.phone,
            'Email': l.email,
            'City': l.city,
            'Course Applied': l.course,
            'Level': l.level,
            'Bus Facility Requested': l.busRequired || 'No',
            'Quoted Fee (INR)': l.quotedFee,
            'Status Stage': l.status,
            'Assigned Counsellor': l.counsellorName || 'N/A',
            'Created Date': l.createdAt,
        }));
        exportToExcel(leadData, 'IIA_CRM_Inquiries_Pipeline');
    };
    const handleExportFees = () => {
        const feeData = fees.map((f) => ({
            'Fee Record ID': f._id,
            'Student ID': f.studentCode,
            'Student Name': f.studentName,
            'Course Name': f.courseName,
            'Total Fee (INR)': f.totalFee,
            'Discount (INR)': f.discount,
            'Net Fee (INR)': f.netFee,
            'Paid Total (INR)': f.paidTotal,
            'Remaining Dues (INR)': f.remainingTotal,
            'Payment Status': f.status,
        }));
        exportToExcel(feeData, 'IIA_Fee_Collections_Ledger');
    };
    const handleExportExpenses = () => {
        const expData = expenses.map((e) => ({
            'Expense ID': e._id,
            'Category': e.category,
            'Amount (INR)': e.amount,
            'Date': e.date,
            'Authorized By': e.paidBy,
            'Remarks': e.remarks || '-',
        }));
        exportToExcel(expData, 'IIA_Operating_Expenses');
    };
    const handleExportAllMaster = () => {
        handleExportStaff();
        setTimeout(handleExportStudents, 300);
        setTimeout(handleExportLeads, 600);
        setTimeout(handleExportFees, 900);
        setTimeout(handleExportExpenses, 1200);
    };
    return (<div className="space-y-6 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-100 flex items-center gap-2">
            IIA Microsoft Excel Data Export & Backup Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Export all school data (Staff, Students, CRM Inquiries, Fees, Expenses) directly into Excel (.xlsx / .csv) spreadsheets.
          </p>
        </div>

        <button onClick={handleExportAllMaster} className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition hover:scale-105">
          <FileSpreadsheet className="w-4 h-4"/>
          <span>Export All Master Excel Sheets</span>
        </button>
      </div>

      {/* Export Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Staff Credentials */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Staff Credentials Ledger</span>
              <ShieldCheck className="w-5 h-5 text-amber-400"/>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Exports all registered staff accounts, email IDs, hierarchy ranks, and custom sub-role titles into Excel.
            </p>
            <p className="text-[11px] font-mono text-cyan-400 mt-3 font-semibold">{users.length} Staff Accounts</p>
          </div>

          <button onClick={handleExportStaff} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-700">
            <Download className="w-4 h-4"/> Export Staff Ledger (.xlsx)
          </button>
        </div>

        {/* Card 2: Student Master Registry */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Student Master Registry</span>
              <GraduationCap className="w-5 h-5 text-cyan-400"/>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Exports complete student profiles, parent names, Aadhaar numbers, grade/level, and enrollment dates.
            </p>
            <p className="text-[11px] font-mono text-cyan-400 mt-3 font-semibold">{students.length} Enrolled Students</p>
          </div>

          <button onClick={handleExportStudents} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-700">
            <Download className="w-4 h-4"/> Export Student Registry (.xlsx)
          </button>
        </div>

        {/* Card 3: CRM Inquiries & Pipeline */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">CRM Inquiries & Pipeline</span>
              <Users className="w-5 h-5 text-teal-400"/>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Exports parent inquiries, candidate names, WhatsApp contacts, bus transport requests, and pipeline stages.
            </p>
            <p className="text-[11px] font-mono text-cyan-400 mt-3 font-semibold">{leads.length} Candidate Inquiries</p>
          </div>

          <button onClick={handleExportLeads} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-700">
            <Download className="w-4 h-4"/> Export CRM Leads (.xlsx)
          </button>
        </div>

        {/* Card 4: Fee Collections & UPI Ledger */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Fee Collections & UPI Ledger</span>
              <CircleDollarSign className="w-5 h-5 text-emerald-400"/>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Exports student term fees, amounts paid in ₹, pending dues, and UPI transaction reference numbers.
            </p>
            <p className="text-[11px] font-mono text-cyan-400 mt-3 font-semibold">{fees.length} Fee Ledgers</p>
          </div>

          <button onClick={handleExportFees} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-700">
            <Download className="w-4 h-4"/> Export Fee Ledgers (.xlsx)
          </button>
        </div>

        {/* Card 5: Operating Expenses */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Operating Expenses & P&L</span>
              <Receipt className="w-5 h-5 text-rose-400"/>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Exports campus facility rent, salaries, utilities, and marketing expense entries into Excel.
            </p>
            <p className="text-[11px] font-mono text-cyan-400 mt-3 font-semibold">{expenses.length} Expense Entries</p>
          </div>

          <button onClick={handleExportExpenses} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-700">
            <Download className="w-4 h-4"/> Export Expenses (.xlsx)
          </button>
        </div>
      </div>
    </div>);
};
