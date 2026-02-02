import { connectDB } from "./mongodb";
import WorkOrder from "@/models/WorkOrder";
import { IWorkOrder } from "@/types/IWorkOrder";
import mongoose from "mongoose";

export async function createWorkOrder(data:Partial<IWorkOrder>): Promise<string> {
  await connectDB();
  const wo = await WorkOrder.create(data);
  // don't need return object here
  return "success" ;
  
    // ...wo.toObject(),
    // _id: wo._id.toString(),
    // companyId: wo?.companyId?.toString() ?? '',
    // createdAt: wo?.createdAt?.toISOString(),
    // updatedAt: wo?.updatedAt?.toISOString(),
  
}

export async function getAllWorkOrders(companyId: string): Promise<IWorkOrder[]> {
  await connectDB();
  const workOrders = await WorkOrder.find({ companyId }).sort({ createdAt: -1 }).lean();
  return workOrders.map((wo) => ({
    ...wo,
    _id: wo._id?.toString(),
    companyId: wo.companyId?.toString?.() ?? '',
    vehicleId: wo.vehicleId?.toString(),
    createdAt: wo.createdAt?.toISOString() ?? null,
    updatedAt: wo.updatedAt?.toISOString() ?? null,
  }));
}

export async function getWorkOrdersForVehicle(vehicleId: string, companyId?: string):Promise<IWorkOrder[]> {
  await connectDB();
  const query: Partial<Record<keyof IWorkOrder, unknown>> = { vehicleId, status: "open" };
  if (companyId) {
    query.companyId = companyId;
  }
  const workOrders = await WorkOrder.find(query).sort({ createdAt: -1 }).lean();
  return workOrders.map((wo) => ({
    ...wo,
    _id: wo._id?.toString(),
    companyId: wo.companyId?.toString?.() ?? '',
    vehicleId: wo.vehicleId?.toString(),
    createdAt: wo.createdAt?.toISOString() ?? null,
    updatedAt: wo.updatedAt?.toISOString() ?? null,
  }));
}



// NOTE: THIS ISN"T USED ANYWHERE YET - we DONT Ever want to delete records -> but perhaps will add functionality here in future
export async function deleteWorkOrder(id: string, companyId?: string): Promise<string> {
  await connectDB();

  const query: mongoose.FilterQuery<IWorkOrder> = {
    $or: [{ _id: id }, { workOrderId: id }],
    ...(companyId ? { companyId }: {}), // optional companyId
  };
  
  if (companyId) {
    query.companyId = companyId;
  }

  const deleted = await WorkOrder.findOneAndDelete(query).lean();

  return deleted ? "success":"failed";  // not implemented
    // ? {
    //     ...deleted,
    //     _id: deleted._id.toString(),
    //     companyId: deleted.companyId?.toString?.() ?? '',
    //     vehicleId: deleted.vehicleId?.toString() ?? "",
    //   }
    //: null;
}
