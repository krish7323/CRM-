import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CheckCircle2 } from 'lucide-react';
export const AdmissionApplicationPage = () => {
    const { addLead } = useAppStore();
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        studentName: '',
        dob: '',
        parentName: '',
        phone: '',
        email: '',
        city: 'Bengaluru',
        gradeApplied: 'Grade 10 (CBSE)',
        language: 'German',
        aadhaarNo: '',
        previousSchool: '',
        previousPercentage: '88%',
        busRequired: 'Yes',
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        addLead({
            name: `${form.studentName} (Parent: ${form.parentName})`,
            phone: form.phone,
            whatsapp: form.phone,
            email: form.email,
            city: form.city,
            course: `${form.gradeApplied} - ${form.language}`,
            language: form.language,
            level: 'A1',
            source: 'Online Application Portal',
            quotedFee: 45000,
        });
        setSubmitted(true);
    };
    return (<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative font-sans">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none"/>

      <div className="w-full max-w-2xl glass-panel border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-lg shadow-amber-500/20 flex items-center justify-center border border-slate-700">
            <img src="/logo.png" alt="TELA Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-100 uppercase tracking-wider">The European Language Academy</h1>
            <p className="text-xs text-amber-400 font-semibold">TELA — Kaithal | Online Admission Inquiry & Registration Portal</p>
          </div>
        </div>

        {submitted ? (<div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8"/>
            </div>
            <h2 className="text-xl font-bold text-slate-100">Application Submitted Successfully!</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Thank you for applying to TELA (The European Language Academy, Kaithal). Application Reference #: <strong>TELA-APP-2026-992</strong>. Our Academic Admissions Counsellor will contact you on WhatsApp at <strong>{form.phone}</strong> shortly.
            </p>
            <button onClick={() => setSubmitted(false)} className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
              Submit Another Application
            </button>
          </div>) : (<form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-400">Student Full Name</label>
                <input type="text" required value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="e.g. Aarav Sharma" className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"/>
              </div>

              <div>
                <label className="font-semibold text-slate-400">Parent / Guardian Name</label>
                <input type="text" required value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} placeholder="e.g. Dr. Ramesh Sharma" className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"/>
              </div>

              <div>
                <label className="font-semibold text-slate-400">WhatsApp / Contact Phone</label>
                <input type="text" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"/>
              </div>

              <div>
                <label className="font-semibold text-slate-400">Email Address</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="parent@example.com" className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"/>
              </div>

              <div>
                <label className="font-semibold text-slate-400">Student Aadhaar Card Number</label>
                <input type="text" value={form.aadhaarNo} onChange={(e) => setForm({ ...form, aadhaarNo: e.target.value })} placeholder="12-digit Aadhaar Number" className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"/>
              </div>

              <div>
                <label className="font-semibold text-slate-400">Class / Grade Applied For</label>
                <select value={form.gradeApplied} onChange={(e) => setForm({ ...form, gradeApplied: e.target.value })} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500">
                  <option value="Grade 8 (CBSE)">Grade 8 (CBSE)</option>
                  <option value="Grade 9 (CBSE)">Grade 9 (CBSE)</option>
                  <option value="Grade 10 (CBSE)">Grade 10 (CBSE)</option>
                  <option value="Grade 11 Science (CBSE)">Grade 11 Science (CBSE)</option>
                  <option value="Grade 12 Commerce (CBSE)">Grade 12 Commerce (CBSE)</option>
                  <option value="CEFR German Program">CEFR German Program</option>
                  <option value="CEFR French Program">CEFR French Program</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-400">School Bus Transport Facility</label>
                <select value={form.busRequired} onChange={(e) => setForm({ ...form, busRequired: e.target.value })} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500">
                  <option value="Yes">Yes (Bus Route Required)</option>
                  <option value="No">No (Self Pickup)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-400">Previous School & Percentage (%)</label>
                <input type="text" value={form.previousPercentage} onChange={(e) => setForm({ ...form, previousPercentage: e.target.value })} placeholder="e.g. DPS Bengaluru - 88%" className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"/>
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition">
              Submit Admission Application to IIA
            </button>
          </form>)}
      </div>
    </div>);
};
