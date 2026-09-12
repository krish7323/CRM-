import mongoose, { Schema } from 'mongoose';

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', CounterSchema);

/**
 * Atomically increments and returns the next sequence number.
 * Can run inside a MongoDB transaction session.
 */
export async function getNextSequence(name, session = null, prefix = '', padLength = 4) {
  const options = { new: true, upsert: true, setDefaultsOnInsert: true };
  if (session) options.session = session;

  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    options
  );

  const formattedSeq = String(counter.seq).padStart(padLength, '0');
  return prefix ? `${prefix}${formattedSeq}` : counter.seq;
}

export default Counter;
