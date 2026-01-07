import { connectDB } from "./mongodb";
import Vehicle from "@/models/Vehicle";

export async function getVehicleById(vehicleId) {
  await connectDB();

  const vehicle = await Vehicle.findOne({
    $or: [{ vehicleId }, { _id: vehicleId }],
  }).lean();

  if (!vehicle) return null;

  return {
    ...vehicle,
    _id: vehicle._id.toString(),
    vehicleId: vehicle.vehicleId?.toString?.() ?? vehicle._id.toString(),
    createdAt: vehicle.createdAt?.toISOString?.() ?? null,
    updatedAt: vehicle.updatedAt?.toISOString?.() ?? null,
  };
}

export async function getAllVehicles() {
  await connectDB();

  const vehicles = await Vehicle.find().lean();

  return vehicles.map((v) => ({
    ...v,
    _id: v._id.toString(),
    vehicleId: v.vehicleId?.toString?.() ?? v._id.toString(),
    createdAt: v.createdAt?.toISOString?.() ?? null,
    updatedAt: v.updatedAt?.toISOString?.() ?? null,
  }));
}

export async function createVehicle(data) {
  await connectDB();

  const v = await Vehicle.create(data);

  // Ensure vehicleId is set
  if (!v.vehicleId) {
    v.vehicleId = v._id.toString();
    await v.save();
  }

  return {
    ...v.toObject(),
    _id: v._id.toString(),
    vehicleId: v.vehicleId.toString(),
    createdAt: v.createdAt?.toISOString?.() ?? null,
    updatedAt: v.updatedAt?.toISOString?.() ?? null,
  };
}
