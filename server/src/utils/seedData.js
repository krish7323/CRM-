import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already initialized with Admin account.');
      return;
    }

    console.log('Initializing single Master Admin account for production...');
    const defaultPassword = await bcrypt.hash('password123', 10);

    // Single Master Admin User
    await User.create({
      name: 'Master ERP Administrator',
      email: 'admin@elh.edu',
      phone: '+91 98765 43210',
      passwordHash: defaultPassword,
      role: 'Admin',
      designation: 'System Administrator & Principal',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isActive: true,
    });

    console.log('Master Admin account created successfully (admin@elh.edu).');
  } catch (error) {
    console.error('Error seeding admin account:', error);
  }
};
