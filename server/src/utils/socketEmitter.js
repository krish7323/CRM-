let ioInstance = null;

export const setIoInstance = (io) => {
  ioInstance = io;
};

export const getIoInstance = () => ioInstance;

/**
 * Standardized Socket.IO event emitter
 * Supports broadcasting globally or targeting room channels (e.g. role:Director, batch:GER-A1-B01)
 */
export const emitSocketEvent = (eventName, data, room = null) => {
  if (!ioInstance) return;
  try {
    if (room) {
      ioInstance.to(room).emit(eventName, data);
    } else {
      ioInstance.emit(eventName, data);
    }
  } catch (err) {
    console.warn(`⚠️ Socket emit error [${eventName}]:`, err.message);
  }
};
