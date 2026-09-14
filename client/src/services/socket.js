import { io } from 'socket.io-client';

// Determine Socket.IO server URL (relative proxy in dev/production or explicit backend URL)
const SOCKET_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:5000' : '/');

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log(`⚡ Socket connected to server [${socket.id}]`);
  const activeRole = localStorage.getItem('elh_user_role') || 'Admin';
  socket.emit('join_role', activeRole);
});

socket.on('disconnect', (reason) => {
  console.log(`🔥 Socket disconnected: ${reason}`);
});

export const joinRoleChannel = (role) => {
  if (socket && socket.connected) {
    socket.emit('join_role', role);
  }
};

export const joinBatchChannel = (batchCode) => {
  if (socket && socket.connected) {
    socket.emit('join_room', `batch:${batchCode}`);
  }
};
