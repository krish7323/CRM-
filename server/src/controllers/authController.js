import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'elh_super_secret_jwt_key_2026_european_language_hub';

const fallbackUsers = [
  { id: 'usr-admin', name: 'Dinesha & Niresh', email: 'admin@elh.edu', role: 'Admin', password: 'password123' },
];

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const input = email.toLowerCase().trim();

    // Fallback if Mongoose is offline or not fully connected (readyState !== 1)
    if (mongoose.connection.readyState !== 1) {
      const fbUser = fallbackUsers.find((u) => u.email.toLowerCase() === input);
      if (!fbUser || fbUser.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: fbUser.id, email: fbUser.email, role: fbUser.role, name: fbUser.name }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({
        token,
        user: {
          id: fbUser.id,
          name: fbUser.name,
          email: fbUser.email,
          role: fbUser.role,
        },
      });
    }

    const user = await User.findOne({ email: input });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    const input = (req.body.email || '').toLowerCase().trim();
    const fbUser = fallbackUsers.find((u) => u.email.toLowerCase() === input);
    if (fbUser && fbUser.password === req.body.password) {
      const token = jwt.sign({ id: fbUser.id, email: fbUser.email, role: fbUser.role, name: fbUser.name }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({
        token,
        user: {
          id: fbUser.id,
          name: fbUser.name,
          email: fbUser.email,
          role: fbUser.role,
        },
      });
    }

    res.status(500).json({ message: 'Server error during authentication', error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const fbUser = fallbackUsers.find((u) => u.id === req.user.id);
      if (!fbUser) return res.status(404).json({ message: 'User not found' });
      return res.json(fbUser);
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    const fbUser = fallbackUsers.find((u) => u.id === req.user.id);
    if (fbUser) return res.json(fbUser);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
