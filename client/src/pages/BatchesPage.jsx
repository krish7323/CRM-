import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Clock, User, MapPin, Plus, X, AlertTriangle, Grid, UserCheck } from 'lucide-react';
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const BatchesPage = () => {
    const { batches, addBatch, timetableSlots, addTimetableSlot, saveTeacherAttendance, teacherAttendanceLogs, currentUser } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [slotErrorMsg, setSlotErrorMsg] = useState('');
    const [form, setForm] = useState({
        code: 'GER-A1-B02',
        courseName: 'German',
        level: 'A1',
        teacherName: 'Prof. Amit Kulkarni',
        room: 'Aryabhata Hall (Room 102)',
        days: ['Mon', 'Wed', 'Fri'],
        timing: '09:00 AM - 11:00 AM',
        maxStudents: 15,
    });
    const [slotForm, setSlotForm] = useState({
        batchCode: 'GER-A1-B01',
        courseName: 'German',
        level: 'A1',
        teacherName: 'Prof. Amit Kulkarni',
        room: 'Aryabhata Hall (Room 102)',
        dayOfWeek: 'Mon',
        startTime: '09:00 AM',
        endTime: '11:00 AM',
    });
    const [checkInTime, setCheckInTime] = useState('08:45 AM');
    const [checkOutTime, setCheckOutTime] = useState('04:30 PM');
    const [teacherAttSuccess, setTeacherAttSuccess] = useState(false);
    const handleCreate = (e) => {
        e.preventDefault();
        const conflict = batches.find((b) => b.room === form.room && b.timing === form.timing && b.status === 'Ongoing');
        if (conflict) {
            setErrorMsg(`Schedule Conflict: '${form.room}' is already booked for timing '${form.timing}'.`);
            return;
        }
        addBatch(form);
        setIsModalOpen(false);
        setErrorMsg('');
    };
    const handleCreateSlot = (e) => {
        e.preventDefault();
        const res = addTimetableSlot(slotForm);
        if (!res.success) {
            setSlotErrorMsg(res.conflictMessage || 'Timetable conflict detected!');
            return;
        }
        setIsSlotModalOpen(false);
        setSlotErrorMsg('');
    };
    const handleTeacherCheckIn = (e) => {
        e.preventDefault();
        saveTeacherAttendance(currentUser.id, 'Present', checkInTime, checkOutTime);
        setTeacherAttSuccess(true);
        setTimeout(() => setTeacherAttSuccess(false), 2500);
    };
    return (<div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Batch Management, Timetable Grid & Teacher Working Hours
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
              {batches.length} Active Batches
            </span>
          </h1>
          <p className="text-xs text-slate-400">Conflict-detected timetable matrix, room allocations & faculty check-in logs</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setIsSlotModalOpen(true)} className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 text-amber-400 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-slate-800 transition">
            <Grid className="w-4 h-4 text-amber-400"/>
            <span>Schedule Timetable Slot</span>
          </button>

          <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition">
            <Plus className="w-4 h-4"/>
            <span>Create Batch</span>
          </button>
        </div>
      </div>

      {/* Teacher Attendance Check-in Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400"/> Teacher Working Hours & Check-In Log
          </h3>
          <p className="text-[11px] text-slate-400">Faculty check-in & check-out time record for salary attendance</p>
        </div>

        <form onSubmit={handleTeacherCheckIn} className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px]">In:</span>
            <input type="text" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} className="bg-transparent font-mono text-cyan-400 font-bold w-16 focus:outline-none"/>
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px]">Out:</span>
            <input type="text" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} className="bg-transparent font-mono text-cyan-400 font-bold w-16 focus:outline-none"/>
          </div>

          <button type="submit" className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20">
            Check In / Out
          </button>
        </form>
      </div>

      {teacherAttSuccess && (<div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-bold text-center animate-pulse">
          Faculty working hours check-in logged to database!
        </div>)}

      {/* Weekly Timetable Matrix Grid with Conflict Detection */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Grid className="w-4 h-4 text-amber-400"/> Weekly Timetable Matrix (Automated Conflict Detector)
          </h3>
          <span className="text-[11px] text-cyan-400 font-semibold">{timetableSlots.length} Scheduled Class Slots</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => {
            const daySlots = timetableSlots.filter((s) => s.dayOfWeek === day);
            return (<div key={day} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2 min-h-[140px]">
                <div className="text-center font-bold text-xs text-amber-400 border-b border-slate-800 pb-1">
                  {day}
                </div>
                {daySlots.map((slot) => (<div key={slot._id} className="p-2 rounded bg-slate-900 border border-slate-800 space-y-0.5 text-[10px]">
                    <p className="font-bold text-slate-100 truncate">{slot.batchCode}</p>
                    <p className="text-cyan-400 font-mono font-medium">{slot.startTime} - {slot.endTime}</p>
                    <p className="text-slate-400 truncate">{slot.room}</p>
                  </div>))}
                {daySlots.length === 0 && (<p className="text-[9px] text-slate-600 text-center pt-4">No Class</p>)}
              </div>);
        })}
        </div>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.map((b) => (<div key={b._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/40">
                  {b.code}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{b.courseName} Level {b.level}</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-800/40">
                {b.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400"/> {b.teacherName}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400"/> {b.room}
              </p>
              <p className="flex items-center gap-2 text-cyan-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-cyan-400"/> {b.days.join(', ')} • {b.timing}
              </p>
            </div>

            {/* Enrolled Capacity Bar */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Enrolled Capacity</span>
                <span className="text-slate-200 font-semibold">{b.currentEnrolledCount} / {b.maxStudents} Students</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full" style={{ width: `${(b.currentEnrolledCount / b.maxStudents) * 100}%` }}/>
              </div>
            </div>
          </div>))}
      </div>

      {/* Schedule Timetable Slot Modal */}
      {isSlotModalOpen && (<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSlot} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Schedule Timetable Class Slot</h3>
              <button type="button" onClick={() => setIsSlotModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5"/>
              </button>
            </div>

            {slotErrorMsg && (<div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0"/>
                <span>{slotErrorMsg}</span>
              </div>)}

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Batch Code</label>
              <input type="text" required value={slotForm.batchCode} onChange={(e) => setSlotForm({ ...slotForm, batchCode: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Faculty Teacher</label>
              <input type="text" required value={slotForm.teacherName} onChange={(e) => setSlotForm({ ...slotForm, teacherName: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400">Classroom / Hall</label>
              <input type="text" required value={slotForm.room} onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Day of Week</label>
                <select value={slotForm.dayOfWeek} onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500">
                  {daysOfWeek.map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Start Time</label>
                <input type="text" required value={slotForm.startTime} onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"/>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setIsSlotModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400">
                Add Timetable Slot
              </button>
            </div>
          </form>
        </div>)}

      {/* Create Batch Modal */}
      {isModalOpen && (<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Schedule New Batch</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5"/>
              </button>
            </div>

            {errorMsg && (<div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0"/>
                <span>{errorMsg}</span>
              </div>)}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400">Batch Code</label>
                <input type="text" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"/>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Faculty Teacher</label>
                <input type="text" required value={form.teacherName} onChange={(e) => setForm({ ...form, teacherName: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"/>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Room / Online</label>
                <input type="text" required value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"/>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400">Timing Slot</label>
                <input type="text" required value={form.timing} onChange={(e) => setForm({ ...form, timing: e.target.value })} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"/>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400">
                Save Batch
              </button>
            </div>
          </form>
        </div>)}
    </div>);
};
