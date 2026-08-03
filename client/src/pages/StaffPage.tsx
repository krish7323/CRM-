import React from 'react';
import { UserCog, Award, BookOpen, Users, Star } from 'lucide-react';

const staffMembers = [
  {
    name: 'Prof. Johann Weber',
    role: 'Head of German Faculty',
    email: 'teacher@elh.edu',
    phone: '+49 30 9876543',
    batchesCount: 3,
    studentCount: 42,
    rating: '4.9/5.0',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    name: 'Sophie Martin',
    role: 'Senior Academic Counsellor',
    email: 'counsellor@elh.edu',
    phone: '+33 1 42685500',
    batchesCount: 0,
    studentCount: 128,
    rating: '4.8/5.0',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
  {
    name: 'Marco Rossi',
    role: 'Operations & Institute Manager',
    email: 'manager@elh.edu',
    phone: '+39 02 1234567',
    batchesCount: 2,
    studentCount: 65,
    rating: '5.0/5.0',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
  },
];

export const StaffPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          Teacher & Staff Directory
        </h1>
        <p className="text-xs text-slate-400">Faculty performance, assigned batches, student counts, and ratings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {staffMembers.map((member) => (
          <div key={member.email} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3">
              <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full border border-cyan-500/40 object-cover" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">{member.name}</h3>
                <p className="text-[11px] text-cyan-400 font-medium">{member.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px]">Assigned Batches</span>
                <p className="font-bold text-slate-100 mt-0.5">{member.batchesCount}</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px]">Rating</span>
                <p className="font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> {member.rating}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
