import { connectDB } from "./mongodb";
import Vehicle from "@/models/Vehicle";
import type { IFormVehicle } from "@/types/IFormVehicle";
import type { IVehicle } from "@/types/IVehicle";
import mongoose from "mongoose";



export async function getVehicleById(vehicleId: string, companyId?: string) {
  await connectDB();

  // Security: ensure validId sent
  if (!mongoose.isValidObjectId(vehicleId)) {
  return null; // or throw an error
}

  const query: any = {
    $or: [{ vehicleId }, { _id: vehicleId }],
  };

  if (companyId) {
    query.companyId = companyId;
  }

  const vehicle = await Vehicle.findOne(query).lean();

  if (!vehicle) return null;

  return {
    ...vehicle,
    _id: vehicle._id.toString(),
    companyId: vehicle.companyId?.toString() ?? '',
    vehicleId: vehicle.vehicleId?.toString() ?? vehicle._id.toString(),
    createdAt: vehicle.createdAt?.toISOString() ?? null,
    updatedAt: vehicle.updatedAt?.toISOString() ?? null,
  };
}

export async function getAllVehicles(companyId?: string) {
  await connectDB();

  const query = companyId ? { companyId } : {};
  const vehicles = await Vehicle.find(query).lean();

  return vehicles.map((v) => ({
    ...v,
    _id: v._id.toString(),
    companyId: v.companyId?.toString?.() ?? '',
    vehicleId: v.vehicleId?.toString() ?? v._id.toString(),
    createdAt: v.createdAt?.toISOString() ?? null,
    updatedAt: v.updatedAt?.toISOString() ?? null,
  }));
}

export async function createVehicle(data: IFormVehicle): Promise<Partial<IVehicle>> {
  await connectDB();

  const v = await Vehicle.create(data);

  // // Ensure vehicleId is set NO=> don't double save any ids
  // if (!v.vehicleId) {
  //   v.vehicleId = v._id.toString();
  //   await v.save();
  // }

  return {
    ...v.toObject(),
    _id: v._id.toString(),
   // vehicleId: v.vehicleId.toString(),
    createdAt: v.createdAt?.toISOString?.() ?? null,
    updatedAt: v.updatedAt?.toISOString?.() ?? null,
  };
}
