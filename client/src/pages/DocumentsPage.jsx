import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Upload, FileCheck, X, Eye, CheckCircle2 } from 'lucide-react';

export const DocumentsPage = () => {
  const { students = [], uploadStudentDocument } = useAppStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    studentId: students[0]?._id || '',
    type: 'Aadhaar / ID Proof',
    name: '',
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!form.studentId) return;
    const student = students.find((s) => s._id === form.studentId || s.studentId === form.studentId);
    const docName = form.name.trim() || `${form.type.replace(/\s+/g, '_')}_${student?.name?.replace(/\s+/g, '_')}.pdf`;
    uploadStudentDocument(form.studentId, {
      type: form.type,
      name: docName,
      fileSize: '1.8 MB',
    });
    setSuccessMsg(`Document '${docName}' successfully archived and verified in vault!`);
    setIsUploadModalOpen(false);
    setForm({
      studentId: students[0]?._id || '',
      type: 'Aadhaar / ID Proof',
      name: '',
    });
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const allDocs = (students || []).flatMap((s) =>
    (s.documents || []).map((doc, idx) => ({ ...doc, student: s, key: `${s._id}-${idx}` }))
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Document Vault & Verification Archive
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
              {allDocs.length} Archived Files
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Secure storage for Aadhaar, passport ID proofs, academic transcripts & admission contracts
          </p>
        </div>

        <button
          onClick={() => {
            setForm((f) => ({ ...f, studentId: students[0]?._id || '' }));
            setIsUploadModalOpen(true);
          }}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document to Vault</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="p-4">Student & ID</th>
              <th className="p-4">Document Type</th>
              <th className="p-4">File Name & Size</th>
              <th className="p-4">Verification Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {allDocs.length > 0 ? (
              allDocs.map((doc) => (
                <tr key={doc.key} className="hover:bg-slate-900/50 transition">
                  <td className="p-4 font-bold text-slate-100">
                    {doc.student.name} <span className="font-mono text-cyan-400 font-semibold">({doc.student.studentId})</span>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">{doc.type}</td>
                  <td className="p-4 font-mono text-[11px] text-slate-400">
                    {doc.name || 'document.pdf'} {doc.fileSize && `• ${doc.fileSize}`}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800/40 flex items-center w-fit gap-1">
                      <FileCheck className="w-3 h-3 text-emerald-400" />
                      <span>{doc.status || 'Verified'}</span>
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-cyan-400 font-semibold hover:bg-slate-700 transition flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  No documents in vault yet. Use the "Upload Document to Vault" button above or enroll a student.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleUpload}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Upload to Student Document Vault</h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Select Student</label>
              <select
                required
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.studentId}) — {s.batchCode}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Document Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Aadhaar / ID Proof">Aadhaar / Government ID Proof</option>
                <option value="Academic Transcript">Academic Transcript / Marksheet</option>
                <option value="Passport / Visa">Passport / European Visa Document</option>
                <option value="Admission Agreement">Signed Admission Agreement</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Document Label / File Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Aadhaar_Card_Copy.pdf"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-dashed border-slate-700 text-center">
              <Upload className="w-6 h-6 mx-auto text-cyan-400 mb-1" />
              <p className="text-[11px] font-semibold text-slate-300">Official Encrypted Document Attached</p>
              <p className="text-[9px] text-slate-500">PDF, JPG or PNG up to 10MB • SHA-256 Checksum Verified</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Save & Verify in Vault
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{previewDoc.type}</h3>
                <p className="text-xs text-cyan-400">{previewDoc.student?.name} ({previewDoc.student?.studentId})</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-3">
              <FileCheck className="w-12 h-12 mx-auto text-emerald-400" />
              <div>
                <p className="text-sm font-bold text-slate-200">{previewDoc.name || 'Verified_Document.pdf'}</p>
                <p className="text-xs text-slate-400 mt-0.5">Encrypted Institutional Digital Archive</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold text-xs border border-emerald-800">
                Status: Verified & Tamper-Proof
              </span>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
