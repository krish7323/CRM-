import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Search, X, Star, Video, PhoneCall, History, } from 'lucide-react';
const stages = [
    'New',
    'Contacted',
    'Interested',
    'Demo',
    'Follow-up',
    'Admission',
    'Lost',
];
export const CRMPage = () => {
    const { leads, updateLeadStatus, addLead, addLeadNote, addCallHistory, convertLeadToStudent } = useAppStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('All');
    const [selectedLead, setSelectedLead] = useState(null);
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
    const handleLogCall = (e) => {
        e.preventDefault();
        if (!selectedLead || !callNotes.trim())
            return;
        addCallHistory(selectedLead._id, {
            durationSeconds: Number(callDuration),
            notes: callNotes,
            outcome: callOutcome,
        });
        setCallNotes('');
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
                                <span className="font-mono text-amber-400 font-bold">₹{lead.quotedFee.toLocaleString('en-IN')}</span>
                              </div>

                              {lead.demoClassDate && (<div className="p-1.5 rounded bg-slate-900 text-[9px] text-cyan-300 flex items-center justify-between border border-slate-800">
                                  <span className="flex items-center gap-1"><Video className="w-3 h-3 text-cyan-400"/> Demo: {lead.demoClassDate}</span>
                                </div>)}

                              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                                <span className="text-slate-500 font-medium">By {lead.counsellorName || 'Priya Nair'}</span>
                                {lead.status !== 'Admission' ? (<button onClick={(e) => {
                                    e.stopPropagation();
                                    convertLeadToStudent(lead._id);
                                }} className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 hover:bg-amber-400 transition">
                                    Enroll →
                                  </button>) : (<span className="text-emerald-400 font-bold">Enrolled</span>)}
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
      {selectedLead && (<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  {selectedLead.name}
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                    Stage: {selectedLead.status}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Parent: {selectedLead.parentName || 'N/A'} • Contact: {selectedLead.phone}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5"/>
              </button>
            </div>

            {/* Candidate Overview Grid */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px]">Program & Level</span>
                <p className="font-bold text-slate-200">{selectedLead.course} {selectedLead.level}</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px]">Quoted Fee (INR)</span>
                <p className="font-bold text-amber-400 font-mono">₹{selectedLead.quotedFee.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px]">Lead Score</span>
                <p className="font-bold text-cyan-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-cyan-400"/> {selectedLead.leadScore || 85} / 100
                </p>
              </div>
            </div>

            {/* Log Call History Form */}
            <form onSubmit={handleLogCall} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400"/> Log Phone Call History Notes
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Call Notes & Counseling Discussion..." value={callNotes} onChange={(e) => setCallNotes(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
                <select value={callOutcome} onChange={(e) => setCallOutcome(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
                  <option value="Interested">Interested</option>
                  <option value="Scheduled Demo">Scheduled Demo</option>
                  <option value="Call Back Later">Call Back Later</option>
                  <option value="Not Answering">Not Answering</option>
                  <option value="Not Interested">Not Interested</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
                  Save Call Log
                </button>
              </div>
            </form>

            {/* Call History Timeline */}
            {selectedLead.callHistory && selectedLead.callHistory.length > 0 && (<div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-cyan-400"/> Call History Timeline
                </h4>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {selectedLead.callHistory.map((c) => (<div key={c.id} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px] flex justify-between">
                      <div>
                        <p className="font-semibold text-slate-200">{c.notes}</p>
                        <p className="text-[9px] text-slate-500">By {c.calledBy} • {new Date(c.calledAt).toLocaleString('en-IN')}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-bold text-[9px] h-fit">
                        {c.outcome}
                      </span>
                    </div>))}
                </div>
              </div>)}
          </div>
        </div>)}

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
