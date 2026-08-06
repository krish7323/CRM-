import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import {
  CalendarCheck,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  Globe,
  X,
  Tag,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const AcademicCalendarPage = () => {
  const { academicEvents, addAcademicEvent, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    eventType: 'Class Event',
    startDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    description: '',
    targetRoles: ['All'],
  });

  const filteredEvents = academicEvents.filter((evt) => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || evt.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || evt.eventType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    addAcademicEvent(form);
    setIsModalOpen(false);
    setForm({
      title: '',
      eventType: 'Class Event',
      startDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      description: '',
      targetRoles: ['All'],
    });
  };

  const getGoogleCalendarUrl = (title, details, startDate) => {
    const formattedDate = startDate.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details || '')}&dates=${formattedDate}/${formattedDate}`;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-cyan-400" /> Centralized Academic Calendar & Events
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
              {academicEvents.length} Events Scheduled
            </span>
          </h1>
          <p className="text-xs text-slate-400">School holidays, exam dates, PTMs, annual functions, sports day & Google Calendar integration</p>
        </div>

        {(currentUser.role === 'Owner' || currentUser.role === 'Admin') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Calendar Event</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search event title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full sm:w-auto"
        >
          <option value="All">All Event Categories</option>
          <option value="School Holiday">School Holiday</option>
          <option value="Exam Date">Exam Date</option>
          <option value="PTM">PTM</option>
          <option value="Annual Function">Annual Function</option>
          <option value="Sports Day">Sports Day</option>
          <option value="Class Event">Class Event</option>
        </select>
      </div>

      {/* Academic Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((evt) => (
          <div key={evt._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 uppercase tracking-widest">
                  {evt.eventType}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{evt.title}</h3>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 text-xs text-slate-300 font-mono">
              <p className="flex items-center gap-1.5 text-amber-400 font-bold">
                <CalendarIcon className="w-3.5 h-3.5" /> {evt.startDate} to {evt.endDate}
              </p>
              <p className="text-slate-400 text-[11px] font-sans pt-1">{evt.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500">Target: {evt.targetRoles?.join(', ')}</span>
              <a
                href={getGoogleCalendarUrl(evt.title, evt.description, evt.startDate)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:underline text-[11px] font-bold"
              >
                Google Calendar <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Add Academic Calendar Event</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Event Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Category</label>
              <select
                value={form.eventType}
                onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="School Holiday">School Holiday</option>
                <option value="Exam Date">Exam Date</option>
                <option value="PTM">PTM</option>
                <option value="Annual Function">Annual Function</option>
                <option value="Sports Day">Sports Day</option>
                <option value="Class Event">Class Event</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Start Date</label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">End Date</label>
                <input
                  type="date"
                  required
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Event Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
