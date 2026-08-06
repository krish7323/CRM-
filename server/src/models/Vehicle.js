import mongoose from 'mongoose';

const FuelLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  liters: { type: Number, required: true },
  cost: { type: Number, required: true },
});

const VehicleSchema = new mongoose.Schema(
  {
    vehicleNo: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    capacity: { type: Number, default: 40 },
    driverName: { type: String, required: true },
    driverPhone: { type: String },
    conductorName: { type: String },
    insuranceExpiry: { type: Date },
    fitnessExpiry: { type: Date },
    permitExpiry: { type: Date },
    fuelLogs: [FuelLogSchema],
    status: { type: String, enum: ['Active', 'Maintenance', 'Inactive'], default: 'Active' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Vehicle', VehicleSchema);
