import { connectDB } from "./mongodb";
import WorkOrder from "@/models/WorkOrder";

export async function createWorkOrder(data) {
  await connectDB();
  const wo = await WorkOrder.create(data);
  return {
    ...wo.toObject(),
    _id: wo._id.toString(),
    createdAt: wo.createdAt.toISOString(),
    updatedAt: wo.updatedAt.toISOString(),
  };
}

export async function getAllWorkOrders() {
  await connectDB();
  const workOrders = await WorkOrder.find().lean();
  return workOrders.map((wo) => ({
    ...wo,
    _id: wo._id.toString(),
    vehicleId: wo.vehicleId.toString(),
    createdAt: wo.createdAt?.toISOString?.() ?? null,
    updatedAt: wo.updatedAt?.toISOString?.() ?? null,
  }));
}

export async function getWorkOrdersForVehicle(vehicleId) {
  await connectDB();
  const workOrders = await WorkOrder.find({ vehicleId }).lean();
  return workOrders.map((wo) => ({
    ...wo,
    _id: wo._id.toString(),
    vehicleId: wo.vehicleId.toString(),
    createdAt: wo.createdAt?.toISOString?.() ?? null,
    updatedAt: wo.updatedAt?.toISOString?.() ?? null,
  }));
}
