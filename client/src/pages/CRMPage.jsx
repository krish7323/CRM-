import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Search, X, Star, Video, PhoneCall, History, UserCheck, CheckCircle2, AlertTriangle, Calendar, Award } from 'lucide-react';

const stages = [
    'New',
    'Contacted',
    'Interested',
    'Not Interested',
    'Converted',
    'Lost',
];

export const CRMPage = () => {
    const { leads, updateLeadStatus, addLead, addLeadNote, addCallHistory, convertLeadToStudent, batches = [], fetchLeads } = useAppStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('All');
    const [selectedLead, setSelectedLead] = useState(null);
    const [followUpSuccessMsg, setFollowUpSuccessMsg] = useState('');

    useEffect(() => {
        if (fetchLeads) {
            fetchLeads();
        }
    }, []);

    const activeLead = selectedLead ? (leads.find((l) => l._id === selectedLead._id) || selectedLead) : null;

    // Admission Conversion Modal State (Section 1 & 2 Integrity)
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [leadToEnroll, setLeadToEnroll] = useState(null);
    const [selectedBatchCode, setSelectedBatchCode] = useState(batches[0]?.code || 'GER-A1-B01');
    const [customFee, setCustomFee] = useState(25000);
    const [enrollError, setEnrollError] = useState('');
    const [enrollSuccessMsg, setEnrollSuccessMsg] = useState('');

    // New Lead Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newLeadForm, setNewLeadForm] = useState({
        name: '',
        parentName: '',
        aadhaarNo: '',
        phone: '',
        whatsapp: '',
        email: '',
        gradeApplied: 'Grade 10 (CBSE)',
        course: 'German',
        language: 'German',
        level: 'A1',
        quotedFee: 25000,
        source: 'Walk-in',
        city: 'Bengaluru',
        busRequired: 'Yes',
    });
    const [noteText, setNoteText] = useState('');
    const [callNotes, setCallNotes] = useState('');
    const [callDuration, setCallDuration] = useState('180');
    const [callOutcome, setCallOutcome] = useState('Interested');
    const [nextFollowUpDate, setNextFollowUpDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    const onDragEnd = (result) => {
        if (!result.destination)
            return;
        const leadId = result.draggableId;
        const newStatus = result.destination.droppableId;
        updateLeadStatus(leadId, newStatus);
    };
    const filteredLeads = leads.filter((l) => {
        const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.phone.includes(searchQuery) ||
            l.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLang = selectedLanguage === 'All' || l.language === selectedLanguage;
        return matchesSearch && matchesLang;
    });
    const handleCreateLead = (e) => {
        e.preventDefault();
        addLead(newLeadForm);
        setIsAddModalOpen(false);
        setNewLeadForm({
            name: '',
            parentName: '',
            aadhaarNo: '',
            phone: '',
            whatsapp: '',
            email: '',
            gradeApplied: 'Grade 10 (CBSE)',
            course: 'German',
            language: 'German',
            level: 'A1',
            quotedFee: 25000,
            source: 'Walk-in',
            city: 'Bengaluru',
            busRequired: 'Yes',
        });
    };
    const handleAddNote = () => {
        if (!selectedLead || !noteText.trim())
            return;
        addLeadNote(selectedLead._id, noteText);
        setNoteText('');
    };

    const handleOpenEnrollModal = (lead) => {
        if (!lead) return;
        if (lead.status !== 'Interested') {
            alert(`Data Integrity Rule: Only leads with status 'Interested' can be enrolled (current: '${lead.status}').`);
            return;
        }
        const hasFollowUps = (lead.calls && lead.calls.length > 0) || (lead.callHistory && lead.callHistory.length > 0) || (lead.followUps && lead.followUps.length > 0);
        if (!hasFollowUps) {
            alert('Data Integrity Policy Violation: Cannot enroll lead without at least one recorded follow-up interaction. Please log a follow-up interaction before enrollment.');
            return;
        }

        setLeadToEnroll(lead);
        const matchingBatch = batches.find((b) => b.courseName?.toLowerCase().includes(lead.course?.toLowerCase())) || batches[0];
        setSelectedBatchCode(matchingBatch?.code || 'GER-A1-B01');
        setCustomFee(lead.quotedFee || 25000);
        setEnrollError('');
        setIsEnrollModalOpen(true);
    };

    const handleConfirmEnroll = (e) => {
        e.preventDefault();
        if (!leadToEnroll || !selectedBatchCode) {
            setEnrollError('Batch selection is mandatory. Every student must be assigned to a batch.');
            return;
        }

        const targetBatch = batches.find((b) => b.code === selectedBatchCode);
        if (targetBatch && (targetBatch.currentEnrolledCount || 0) >= (targetBatch.maxStudents || 15)) {
            setEnrollError(`Capacity Exceeded! Batch '${targetBatch.code}' has ${targetBatch.currentEnrolledCount}/${targetBatch.maxStudents} seats taken. Please select an available batch.`);
            return;
        }

        const res = convertLeadToStudent(leadToEnroll._id, selectedBatchCode);
        if (!res.success) {
            setEnrollError(res.message);
            return;
        }

        setEnrollSuccessMsg(`✓ Admission complete! ${res.student.name} enrolled as ${res.student.studentId} in batch ${selectedBatchCode}. Initial fee ledger created.`);
        setIsEnrollModalOpen(false);
        setLeadToEnroll(null);
        setSelectedLead(null);
        setTimeout(() => setEnrollSuccessMsg(''), 6000);
    };

    const handleLogCall = (e) => {
        e.preventDefault();
        const currentTarget = activeLead || selectedLead;
        if (!currentTarget) return;

        const trimmedNotes = callNotes.trim();
        const finalNotes = trimmedNotes || `Follow-up call logged: ${callOutcome}`;

        const callData = {
            durationSeconds: Number(callDuration) || 180,
            notes: finalNotes,
            outcome: callOutcome,
            nextFollowUpDate,
        };

        addCallHistory(currentTarget._id, callData);

        let targetStatus = currentTarget.status;
        if (callOutcome === 'Interested') {
            targetStatus = 'Interested';
        } else if (callOutcome === 'Not Interested') {
            targetStatus = 'Not Interested';
        } else if (currentTarget.status === 'New') {
            targetStatus = 'Contacted';
        }

        if (targetStatus !== currentTarget.status) {
            updateLeadStatus(currentTarget._id, targetStatus);
        }

        const newCallHistoryEntry = {
            ...callData,
            id: `call-${Date.now()}`,
            by: 'Director',
            calledBy: 'Director',
            at: new Date(),
            calledAt: new Date(),
        };

        setSelectedLead((prev) => prev ? {
            ...prev,
            status: targetStatus,
            calls: [newCallHistoryEntry, ...(prev.calls || [])],
            callHistory: [newCallHistoryEntry, ...(prev.callHistory || [])],
            followUps: [newCallHistoryEntry, ...(prev.followUps || [])],
        } : null);

        setCallNotes('');
        setFollowUpSuccessMsg(`✓ Successfully logged '${callOutcome}' follow-up!`);
        setTimeout(() => setFollowUpSuccessMsg(''), 4000);
    };
    return (<div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Admissions CRM & Lead Pipeline
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
              {leads.length} Total Applications
            </span>
          </h1>
          <p className="text-xs text-slate-400">Manage candidate leads, call history logs, demo classes & 1-click admissions</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"/>
            <input type="text" placeholder="Search candidate name, phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-60"/>
          </div>

          <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500">
            <option value="All">All Programs</option>
            <option value="German">German</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
            <option value="English">English</option>
          </select>

          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition">
            <Plus className="w-4 h-4"/>
            <span>New Admission Inquiry</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto space-x-3 pb-4 min-w-0">
          {stages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage);
            return (<div key={stage} className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 w-[270px] shrink-0 flex flex-col h-[70vh]">
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-800/80">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{stage}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-amber-400 border border-slate-800">
                    {stageLeads.length}
                  </span>
                </div>

                <Droppable droppableId={stage}>
                  {(provided) => (<div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      {stageLeads.map((lead, index) => (<Draggable key={lead._id} draggableId={lead._id} index={index}>
                          {(providedDrag) => (<div ref={providedDrag.innerRef} {...providedDrag.draggableProps} {...providedDrag.dragHandleProps} onClick={() => setSelectedLead(lead)} className="glass-card p-3.5 rounded-xl border border-slate-800/90 hover:border-amber-500/40 transition cursor-pointer space-y-2 group">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition">
                                    {lead.name}
                                  </h4>
                                  <p className="text-[10px] text-slate-400">{lead.parentName ? `Parent: ${lead.parentName}` : lead.city}</p>
                                </div>

                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 flex items-center gap-1">
                                  <Star className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400"/> {lead.leadScore || 80}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span>{lead.course} {lead.level}</span>
                                <span className="font-mono text-amber-400 font-bold">₹{(lead.quotedFee || 0).toLocaleString('en-IN')}</span>
                              </div>

                              {lead.demoClassDate && (<div className="p-1.5 rounded bg-slate-900 text-[9px] text-cyan-300 flex items-center justify-between border border-slate-800">
                                  <span className="flex items-center gap-1"><Video className="w-3 h-3 text-cyan-400"/> Demo: {lead.demoClassDate}</span>
                                </div>)}

                              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                                <span className="text-slate-500 font-medium">By {lead.counsellorName || 'Priya Nair'}</span>
                                {lead.status === 'Interested' ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEnrollModal(lead);
                                    }}
                                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition shadow-sm"
                                  >
                                    Enroll →
                                  </button>
                                ) : lead.status === 'Converted' ? (
                                  <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Enrolled
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[10px]">{lead.status}</span>
                                )}
                              </div>
                            </div>)}
                        </Draggable>))}
                      {provided.placeholder}
                    </div>)}
                </Droppable>
              </div>);
        })}
        </div>
      </DragDropContext>

      {/* Lead Detail & Call History Drawer */}
      {activeLead && (<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  {activeLead.name}
                  <span className={`text-xs px-2 py-0.5 rounded font-bold border ${
                    activeLead.status === 'Interested'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : activeLead.status === 'Not Interested'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    Stage: {activeLead.status}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Parent: {activeLead.parentName || 'N/A'} • Contact: {activeLead.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                {activeLead.status === 'Interested' && (
                  <button
                    onClick={() => handleOpenEnrollModal(activeLead)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Convert to Student Admission (Enroll)</span>
                  </button>
                )}
                {activeLead.status === 'Converted' && (
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Converted & Enrolled
                  </span>
                )}
                <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Candidate Overview Grid */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px]">Program & Level</span>
                <p className="font-bold text-slate-200">{activeLead.course} {activeLead.level}</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px]">Quoted Fee (INR)</span>
                <p className="font-bold text-amber-400 font-mono">₹{(activeLead.quotedFee || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px]">Lead Score</span>
                <p className="font-bold text-cyan-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-cyan-400"/> {activeLead.leadScore || 85} / 100
                </p>
              </div>
            </div>

            {/* Log Call & Follow-up History Form */}
            <form onSubmit={handleLogCall} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400"/> Log Structured Follow-up & Call Interaction
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Discussion details (optional)..."
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                >
                  <option value="Interested">Interested (Eligible for Admission)</option>
                  <option value="Call Back Later">Call Back Later</option>
                  <option value="No Response">No Response</option>
                  <option value="Not Interested">Not Interested</option>
                </select>
                <div>
                  <input
                    type="date"
                    title="Next Follow-up Due Date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>

              {followUpSuccessMsg && (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{followUpSuccessMsg}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-slate-500">
                  Note: Marking outcome as 'Interested' unlocks the Enroll action.
                </span>
                <button type="submit" className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition cursor-pointer shadow-sm active:scale-95">
                  Save Follow-up Log
                </button>
              </div>
            </form>

            {/* Call History Timeline */}
            {(() => {
              const interactions = (activeLead.callHistory && activeLead.callHistory.length > 0)
                ? activeLead.callHistory
                : (activeLead.calls && activeLead.calls.length > 0)
                  ? activeLead.calls
                  : (activeLead.followUps && activeLead.followUps.length > 0)
                    ? activeLead.followUps
                    : [];

              if (interactions.length === 0) return null;

              return (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-cyan-400"/> Follow-up Audit Trail ({interactions.length} Interactions)
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {interactions.map((c, idx) => (
                      <div key={c.id || c._id || idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] flex justify-between items-start gap-2">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-200">{c.notes || 'Interaction logged'}</p>
                          <p className="text-[9px] text-slate-500">
                            By {c.calledBy || c.by || c.loggedBy || 'Staff'} • {c.calledAt ? new Date(c.calledAt).toLocaleString('en-IN') : (c.at ? new Date(c.at).toLocaleString('en-IN') : (c.date ? new Date(c.date).toLocaleString('en-IN') : 'Recently'))}
                          </p>
                          {c.nextFollowUpDate && (
                            <p className="text-[9px] text-cyan-400">
                              Next Follow-up Due: {new Date(c.nextFollowUpDate).toLocaleDateString('en-IN')}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] h-fit whitespace-nowrap ${
                          c.outcome === 'Interested'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : c.outcome === 'Not Interested'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-slate-900 text-amber-400 border border-slate-800'
                        }`}>
                          {c.outcome}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>)}

      {/* Admission Conversion Modal (Section 1 & 2 Integrity) */}
      {isEnrollModalOpen && leadToEnroll && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleConfirmEnroll} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">Enroll Lead — Path A (CRM Conversion)</h3>
              </div>
              <button type="button" onClick={() => setIsEnrollModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {enrollError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{enrollError}</span>
              </div>
            )}

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <p className="text-slate-300 font-bold">{leadToEnroll.name} <span className="text-slate-500 font-normal">({leadToEnroll.phone})</span></p>
              <p className="text-[11px] text-slate-400">Course: <span className="text-amber-400 font-semibold">{leadToEnroll.course} {leadToEnroll.level}</span> • Parent: {leadToEnroll.parentName || 'N/A'}</p>
            </div>

            <div className="space-y-3">
              {/* Batch Assignment (Required by Section 0 & Section 2) */}
              <div>
                <label className="text-[11px] font-bold text-amber-400 flex items-center justify-between">
                  <span>Assign Batch * (Mandatory Step)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Capacity enforced at commit time</span>
                </label>
                <select
                  required
                  value={selectedBatchCode}
                  onChange={(e) => setSelectedBatchCode(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {batches.map((b) => {
                    const isFull = (b.currentEnrolledCount || 0) >= (b.maxStudents || 15);
                    return (
                      <option key={b._id} value={b.code} disabled={isFull}>
                        {b.code} ({b.courseName}) — {b.currentEnrolledCount}/{b.maxStudents} seats {isFull ? '(FULL - NO SEATS)' : `(${b.maxStudents - b.currentEnrolledCount} left)`}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Initial Fee Plan Amount */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Initial Course Fee Plan (INR)</label>
                <input
                  type="number"
                  required
                  value={customFee}
                  onChange={(e) => setCustomFee(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">Generates initial fee invoice ledger with 2 installments (50% each).</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEnrollModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:scale-105 transition shadow-lg shadow-emerald-500/20"
              >
                Confirm Admission & Enroll
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Lead Modal */}
      {isAddModalOpen && (<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateLead} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Add New Admission Application</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Student Full Name</label>
                <input type="text" required value={newLeadForm.name} onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Parent / Guardian Name</label>
                <input type="text" value={newLeadForm.parentName} onChange={(e) => setNewLeadForm({ ...newLeadForm, parentName: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Phone / WhatsApp</label>
                <input type="text" required value={newLeadForm.phone} onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value, whatsapp: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Aadhaar Card Number</label>
                <input type="text" value={newLeadForm.aadhaarNo} onChange={(e) => setNewLeadForm({ ...newLeadForm, aadhaarNo: e.target.value })} placeholder="12-digit Aadhaar" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"/>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Program / Language</label>
                <select value={newLeadForm.language} onChange={(e) => setNewLeadForm({
                ...newLeadForm,
                language: e.target.value,
                course: e.target.value,
            })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500">
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">School Bus Transport</label>
                <select value={newLeadForm.busRequired} onChange={(e) => setNewLeadForm({ ...newLeadForm, busRequired: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500">
                  <option value="Yes">Yes (Bus Route)</option>
                  <option value="No">No (Self Pickup)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
                Save Inquiry
              </button>
            </div>
          </form>
        </div>)}
    </div>);
};
