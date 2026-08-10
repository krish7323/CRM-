import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import {
  Library,
  Plus,
  Search,
  BookOpen,
  Barcode,
  X,
} from 'lucide-react';

export const LibraryPage = () => {
  const { books, bookIssues, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    author: '',
    category: 'German Language',
    barcode: 'IIA-BK-9001',
    shelf: 'Shelf A',
    rack: 'Rack 01',
  });

  const filteredBooks = (books || []).filter((b) => {
    return (
      b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Library className="w-5 h-5 text-cyan-400" /> Digital Library & Resource Center
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
              {filteredBooks.length} Titles
            </span>
          </h1>
          <p className="text-xs text-slate-400">Textbooks, curriculum modules, barcode tags & issue/return desk</p>
        </div>

        {(currentUser.role === 'Owner' || currentUser.role === 'Admin' || currentUser.role === 'Librarian') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book Title</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search book title, barcode, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((bk) => (
          <div key={bk._id || bk.barcode} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 uppercase tracking-widest">
                  {bk.category || 'Textbook'}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{bk.title}</h3>
                <p className="text-xs text-slate-400">Author: {bk.author || 'N/A'}</p>
              </div>

              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800/40">
                {bk.status || 'Available'}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 text-xs text-slate-300 font-mono">
              <p className="flex justify-between">
                <span className="text-slate-500 text-[10px]">Barcode:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1"><Barcode className="w-3 h-3 text-amber-400" /> {bk.barcode}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500 text-[10px]">Location:</span>
                <span className="text-slate-200">{bk.shelf || 'Shelf A'}, {bk.rack || 'Rack 01'}</span>
              </p>
            </div>
          </div>
        ))}

        {filteredBooks.length === 0 && (
          <div className="col-span-full p-8 text-center glass-panel rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No book titles found. Click "Add Book Title" to add a new book to the library catalog.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Add Book Title</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Book Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Author</label>
              <input
                type="text"
                required
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Barcode Tag</label>
              <input
                type="text"
                required
                value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
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
                Save Book
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
