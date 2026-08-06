import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import { exportToExcel } from '../utils/excelExporter.js';
import {
  Library,
  BookOpen,
  Plus,
  Search,
  Filter,
  QrCode,
  Barcode,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Download,
  X,
  UserCheck,
  Calendar,
  IndianRupee,
  BookMarked,
  Tag,
} from 'lucide-react';

export const LibraryPage = () => {
  const { books, bookIssues, addBook, issueBook, returnBook, users, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedBookForIssue, setSelectedBookForIssue] = useState(null);

  // Forms
  const [newBookForm, setNewBookForm] = useState({
    title: '',
    author: '',
    publisher: '',
    category: 'German Language',
    isbn: '',
    shelf: 'Shelf A',
    rack: 'Rack 01',
    language: 'German',
    edition: '2024 Edition',
    purchasePrice: 1500,
    vendor: 'Campus Library Supplies',
  });

  const [issueForm, setIssueForm] = useState({
    borrowerId: 'std-1',
    borrowerName: 'Aarav Gupta',
    borrowerRole: 'Student',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  });

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.includes(searchQuery) ||
      b.barcode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const availableBooks = books.filter((b) => b.status === 'Available').length;
  const issuedBooks = books.filter((b) => b.status === 'Issued').length;
  const totalFineCollected = bookIssues.reduce((sum, i) => sum + (i.fineAmount || 0), 0);

  const handleCreateBook = (e) => {
    e.preventDefault();
    addBook(newBookForm);
    setIsAddBookModalOpen(false);
    setNewBookForm({
      title: '',
      author: '',
      publisher: '',
      category: 'German Language',
      isbn: '',
      shelf: 'Shelf A',
      rack: 'Rack 01',
      language: 'German',
      edition: '2024 Edition',
      purchasePrice: 1500,
      vendor: 'Campus Library Supplies',
    });
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!selectedBookForIssue) return;
    issueBook(
      selectedBookForIssue._id,
      issueForm.borrowerId,
      issueForm.borrowerName,
      issueForm.borrowerRole,
      issueForm.dueDate
    );
    setIsIssueModalOpen(false);
    setSelectedBookForIssue(null);
  };

  const handleExportExcel = () => {
    exportToExcel(books, 'IIA_Digital_Library_Inventory');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Library className="w-5 h-5 text-cyan-400" /> Digital Library & Resource Management
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
              {books.length} Total Titles
            </span>
          </h1>
          <p className="text-xs text-slate-400">Inventory tracking, ISBN barcodes, automated book issue/return desk & fine calculator</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 text-teal-400 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-slate-800 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Catalog (.xlsx)</span>
          </button>

          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book Title</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Book Inventory</span>
            <p className="text-xl font-black text-slate-100 mt-0.5">{books.length} Books</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Currently Available</span>
            <p className="text-xl font-black text-emerald-400 mt-0.5">{availableBooks} Books</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Currently Issued</span>
            <p className="text-xl font-black text-amber-400 mt-0.5">{issuedBooks} Issued</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fine Revenue Collected</span>
            <p className="text-xl font-black text-teal-400 font-mono mt-0.5">₹{totalFineCollected.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search title, author, ISBN, barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Categories</option>
            <option value="German Language Grammar">German Grammar</option>
            <option value="Advanced German">Advanced German</option>
            <option value="General">General Reference</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Issued">Issued</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Book Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((b) => (
          <div key={b._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 uppercase tracking-widest">
                  {b.category}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1 line-clamp-1">{b.title}</h3>
                <p className="text-xs text-slate-400">By {b.author}</p>
              </div>

              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                  b.status === 'Available'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
                    : 'bg-amber-950 text-amber-400 border-amber-800/40'
                }`}
              >
                {b.status}
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-slate-400 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex justify-between">
                <span>ISBN:</span>
                <span className="text-slate-200 font-semibold">{b.isbn}</span>
              </div>
              <div className="flex justify-between">
                <span>Barcode Tag:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Barcode className="w-3 h-3 text-amber-400" /> {b.barcode}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-cyan-300">{b.shelf} • {b.rack}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Price: ₹{b.purchasePrice}</span>
              {b.status === 'Available' ? (
                <button
                  onClick={() => {
                    setSelectedBookForIssue(b);
                    setIsIssueModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shadow-md shadow-amber-500/20"
                >
                  Issue Book →
                </button>
              ) : (
                <span className="text-amber-400 font-bold text-[11px]">Issued out</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Active Issued Books Register Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-2">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-amber-400" /> Active Issued Books Log & Return Desk
          </h3>
          <span className="text-[11px] text-amber-400 font-semibold">{bookIssues.length} Borrow Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase text-[9px] font-bold tracking-wider">
              <tr>
                <th className="p-3">Barcode Tag</th>
                <th className="p-3">Book Title</th>
                <th className="p-3">Borrower Name & Role</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status / Return</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {bookIssues.map((issue) => (
                <tr key={issue._id} className="hover:bg-slate-900/50">
                  <td className="p-3 text-amber-400 font-bold">{issue.barcode}</td>
                  <td className="p-3 font-sans font-semibold text-slate-200">{issue.bookTitle}</td>
                  <td className="p-3 font-sans text-cyan-300">{issue.borrowerName} ({issue.borrowerRole})</td>
                  <td className="p-3 text-slate-400">{issue.issueDate}</td>
                  <td className="p-3 text-amber-300 font-bold">{issue.dueDate}</td>
                  <td className="p-3">
                    {issue.returnDate ? (
                      <span className="text-emerald-400 font-bold">Returned on {issue.returnDate}</span>
                    ) : (
                      <span className="text-amber-400 font-bold">Issued Out</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {!issue.returnDate && (
                      <button
                        onClick={() => returnBook(issue._id, 0)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px] hover:bg-emerald-400"
                      >
                        Return Book
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateBook} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Add Book Title to Inventory</h3>
              <button type="button" onClick={() => setIsAddBookModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Book Title</label>
                <input
                  type="text"
                  required
                  value={newBookForm.title}
                  onChange={(e) => setNewBookForm({ ...newBookForm, title: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Author Name</label>
                <input
                  type="text"
                  required
                  value={newBookForm.author}
                  onChange={(e) => setNewBookForm({ ...newBookForm, author: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">ISBN Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 978-3126061285"
                  value={newBookForm.isbn}
                  onChange={(e) => setNewBookForm({ ...newBookForm, isbn: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Category</label>
                <select
                  value={newBookForm.category}
                  onChange={(e) => setNewBookForm({ ...newBookForm, category: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="German Language Grammar">German Grammar</option>
                  <option value="Advanced German">Advanced German</option>
                  <option value="General">General Reference</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Shelf Location</label>
                <input
                  type="text"
                  value={newBookForm.shelf}
                  onChange={(e) => setNewBookForm({ ...newBookForm, shelf: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Rack Location</label>
                <input
                  type="text"
                  value={newBookForm.rack}
                  onChange={(e) => setNewBookForm({ ...newBookForm, rack: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddBookModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Save Book
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Issue Book Modal */}
      {isIssueModalOpen && selectedBookForIssue && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleIssueSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Issue Book to Student / Teacher</h3>
              <button type="button" onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
              <p className="font-bold text-amber-400">{selectedBookForIssue.title}</p>
              <p className="text-[10px] text-slate-400">Barcode Tag: {selectedBookForIssue.barcode}</p>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Borrower Full Name</label>
              <input
                type="text"
                required
                value={issueForm.borrowerName}
                onChange={(e) => setIssueForm({ ...issueForm, borrowerName: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Due Return Date</label>
              <input
                type="date"
                required
                value={issueForm.dueDate}
                onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Confirm Issue
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
