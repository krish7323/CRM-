import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Lead, LeadStatus, Language, CEFRLevel } from '../types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  Plus,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Calendar,
  UserCheck,
  X,
  Send,
  MoreVertical,
  Globe,
  Clock,
  Sparkles,
  Bus,
  ShieldCheck,
  User,
} from 'lucide-react';

const stages: LeadStatus[] = [
  'New',
  'Contacted',
  'Interested',
  'Demo',
  'Follow-up',
  'Admission',
  'Lost',
];

export const CRMPage: React.FC = () => {
  const { leads, updateLeadStatus, addLead, addLeadNote, convertLeadToStudent } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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
    language: 'German' as Language,
    level: 'A1' as CEFRLevel,
    quotedFee: 25000,
    source: 'Walk-in',
    city: 'Bengaluru',
    busRequired: 'Yes',
  });

  const [noteText, setNoteText] = useState('');

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId as LeadStatus;
    updateLeadStatus(leadId, newStatus);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = selectedLanguage === 'All' || l.language === selectedLanguage;
    return matchesSearch && matchesLang;
  });

  const handleCreateLead = (e: React.FormEvent) => {
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
    if (!selectedLead || !noteText.trim()) return;
    addLeadNote(selectedLead._id, noteText);
    setNoteText('');
    const updated = leads.find((l) => l._id === selectedLead._id);
    if (updated) setSelectedLead(updated);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            IIA Admission CRM & Inquiry Pipeline
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
              {leads.length} Applications
            </span>
          </h1>
          <p className="text-xs text-slate-400">Parent inquiries, Aadhaar tracking, CBSE grade applied & bus transport requests</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-48 lg:w-64"
            />
          </div>

          {/* Program filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-amber-400 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="All">All Programs</option>
            <option value="German">German</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
            <option value="English">English</option>
          </select>

          {/* Add Application Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Admission Inquiry</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage);
            return (
              <div key={stage} className="w-72 shrink-0 flex flex-col glass-panel rounded-2xl border border-slate-800/80 p-3 max-h-[75vh]">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{stage}</h3>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Droppable Stage Column */}
                <Droppable droppableId={stage}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[150px]"
                    >
                      {stageLeads.map((lead, index) => (
                        <Draggable key={lead._id} draggableId={lead._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedLead(lead)}
                              className={`glass-card p-3.5 rounded-xl border transition cursor-pointer hover:border-amber-500/50 ${
                                snapshot.isDragging ? 'rotate-2 shadow-2xl border-amber-400 bg-slate-900' : 'border-slate-800'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <h4 className="text-xs font-bold text-slate-100 hover:text-amber-400 transition">{lead.name}</h4>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                                  {lead.language} {lead.level}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-500" /> {lead.phone}
                              </p>

                              {lead.busRequired === 'Yes' && (
                                <p className="text-[10px] text-cyan-400 mt-1 flex items-center gap-1">
                                  <Bus className="w-3 h-3 text-cyan-400" /> Bus Transport Requested
                                </p>
                              )}

                              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                                <span>₹{lead.quotedFee.toLocaleString('en-IN')}</span>
                                <span className="text-amber-400 font-medium">{lead.source}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Slide-in Lead Detail Panel */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-100">{selectedLead.name}</h3>
                  <p className="text-xs text-amber-400">{selectedLead.course} • {selectedLead.level}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 my-4">
                <a
                  href={`https://wa.me/${selectedLead.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Parent
                </a>
                <button
                  onClick={() => {
                    convertLeadToStudent(selectedLead._id);
                    setSelectedLead(null);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:scale-105 transition"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Convert to Student
                </button>
              </div>

              {/* Conversation Log */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Parent Conversation Log</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {selectedLead.notes.map((n, idx) => (
                    <div key={idx} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                      <p className="text-slate-200">{n.text}</p>
                      <p className="text-[10px] text-slate-500 flex justify-between">
                        <span>By {n.by}</span>
                        <span>{new Date(n.at).toLocaleDateString('en-IN')}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Log Note Input */}
            <div className="pt-4 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Log parent response / interview note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleAddNote}
                className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateLead}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Add New Admission Application</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Parent / Guardian Name</label>
                <input
                  type="text"
                  value={newLeadForm.parentName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, parentName: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Phone / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.phone}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value, whatsapp: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Aadhaar Card Number</label>
                <input
                  type="text"
                  value={newLeadForm.aadhaarNo}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, aadhaarNo: e.target.value })}
                  placeholder="12-digit Aadhaar"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Program / Language</label>
                <select
                  value={newLeadForm.language}
                  onChange={(e) =>
                    setNewLeadForm({
                      ...newLeadForm,
                      language: e.target.value as Language,
                      course: e.target.value,
                    })
                  }
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">School Bus Transport</label>
                <select
                  value={newLeadForm.busRequired}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, busRequired: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Yes">Yes (Bus Route)</option>
                  <option value="No">No (Self Pickup)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Save Inquiry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
