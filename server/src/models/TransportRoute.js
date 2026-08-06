import mongoose from 'mongoose';

const StopSchema = new mongoose.Schema({
  stopName: { type: String, required: true },
  pickupTime: { type: String, required: true },
  fee: { type: Number, default: 2000 },
});

const TransportRouteSchema = new mongoose.Schema(
  {
    routeCode: { type: String, required: true, unique: true },
    routeName: { type: String, required: true },
    stops: [StopSchema],
    assignedDriver: { type: String },
    vehicleNo: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('TransportRoute', TransportRouteSchema);
