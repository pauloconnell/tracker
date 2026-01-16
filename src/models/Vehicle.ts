import mongoose, { Schema } from 'mongoose';

const VehicleSchema = new Schema(
   {
      vehicleId: { type: String },
      year: { type: Number, required: true },
      make: { type: String, required: true },
      model: { type: String, required: true },
      name: { type: String, required: true },
      mileage: { type: Number },
      vin: { type: String },
   },
   { timestamps: true }
);

export default mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);
