import mongoose, { Schema } from "mongoose";

const VehicleSchema = new Schema(
  {
    year: Number,
    make: String,
    model: String,
    name: String,
    mileage: Number,
    vin: String,
  },
  { timestamps: true }
);

export default mongoose.models.Vehicle ||
  mongoose.model("Vehicle", VehicleSchema);
