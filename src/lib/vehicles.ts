import { connectDB } from "./mongodb";
import Vehicle from "@/models/Vehicle";
import ServiceRecord from "@/models/ServiceRecord";
import WorkOrder from "@/models/WorkOrder";

export async function getVehicleById(vehicleId: string) {
    await connectDB();
    return Vehicle.findById(vehicleId).lean();
}

export async function getAllVehicles() {
   await connectDB();
   const vehicles = await Vehicle.find().lean();
   return vehicles.map((v) => ({ 
    ...v, 
    _id: v._id.toString(),
    createdAt: v.createdAt?.toISOString?.() ?? null, 
    updatedAt: v.updatedAt?.toISOString?.() ?? null,

 }));
}

export async function getServiceHistory(vehicleId: string) {
    await connectDB();
    return ServiceRecord.find({ vehicleId }).sort({ date: -1 }).lean();
}

export async function createServiceRecord(data: any) {
    await connectDB();
    const record = await ServiceRecord.create(data);
    return record.toObject();
}
export async function createVehicle(data: any) {
    await connectDB();
    const vehicle = await Vehicle.create(data);
    return vehicle.toObject();
}



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



