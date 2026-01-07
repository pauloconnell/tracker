import { connectDB } from "./mongodb";
import ServiceRecord from "@/models/ServiceRecord";

export async function createServiceRecord(data) {
  await connectDB();

  const record = await ServiceRecord.create(data);

  return {
    ...record.toObject(),
    _id: record._id.toString(),
    vehicleId: record.vehicleId?.toString?.() ?? "",
    createdAt: record.createdAt?.toISOString?.() ?? null,
    updatedAt: record.updatedAt?.toISOString?.() ?? null,
  };
}

export async function getServiceHistory(vehicleId) {
  await connectDB();

  const records = await ServiceRecord.find({ vehicleId })
    .sort({ date: -1 })
    .lean();

  return records.map((r) => ({
    ...r,
    _id: r._id.toString(),
    vehicleId: r.vehicleId?.toString?.() ?? "",
    createdAt: r.createdAt?.toISOString?.() ?? null,
    updatedAt: r.updatedAt?.toISOString?.() ?? null,
  }));
}

export async function getAllServiceRecords() {
  await connectDB();

  const records = await ServiceRecord.find().lean();

  return records.map((r) => ({
    ...r,
    _id: r._id.toString(),
    vehicleId: r.vehicleId?.toString?.() ?? "",
    createdAt: r.createdAt?.toISOString?.() ?? null,
    updatedAt: r.updatedAt?.toISOString?.() ?? null,
  }));
}
