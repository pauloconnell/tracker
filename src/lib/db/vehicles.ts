import { connectDB } from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import type { IFormVehicle } from '@/types/IFormVehicle';
import type { IVehicle } from '@/types/IVehicle';
import mongoose from 'mongoose';
import { serializeVehicle } from '@/lib/utils/server/serialize';

export async function getVehicleById(vehicleId: string, companyId?: string) {
  await connectDB();

  if (!mongoose.isValidObjectId(vehicleId)) return null;

  const query: any = { $or: [{ vehicleId }, { _id: vehicleId }] };
  if (companyId) query.companyId = companyId;

  const vehicle = await Vehicle.findOne(query).lean();
  if (!vehicle) return null;

  return serializeVehicle(vehicle);
}

export async function getAllVehicles(companyId?: string): Promise<IVehicle[]> {
  await connectDB();
  const query = companyId ? { companyId } : {};
  const vehicles = await Vehicle.find(query).lean();
  return vehicles.map(serializeVehicle);
}

export async function createVehicle(data: IFormVehicle): Promise<Partial<IVehicle>> {
  await connectDB();
  const v = await Vehicle.create(data);
  return serializeVehicle(v.toObject());
}
