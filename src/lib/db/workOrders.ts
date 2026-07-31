import { connectDB } from '@/lib/mongodb';
import WorkOrder from '@/models/WorkOrder';
import type { IWorkOrder } from '@/types/IWorkOrder';
import mongoose from 'mongoose';
import { serializeWorkOrder } from '@/lib/utils/server/serialize';

export async function createWorkOrder(data: Partial<IWorkOrder>): Promise<string> {
  await connectDB();
  await WorkOrder.create(data);
  return 'success';
}

export async function getAllWorkOrders(companyId: string): Promise<IWorkOrder[]> {
  await connectDB();
  const workOrders = await WorkOrder.find({ companyId }).sort({ createdAt: -1 }).lean();
  return workOrders.map(serializeWorkOrder);
}

export async function getWorkOrdersForVehicle(vehicleId: string, companyId?: string): Promise<IWorkOrder[]> {
  await connectDB();
  const query: any = { vehicleId, status: 'open' };
  if (companyId) query.companyId = companyId;
  const workOrders = await WorkOrder.find(query).sort({ createdAt: -1 }).lean();
  return workOrders.map(serializeWorkOrder);
}

export async function deleteWorkOrder(id: string, companyId?: string): Promise<string> {
  await connectDB();
  const query: any = {
    $or: [{ _id: id }, { workOrderId: id }],
    ...(companyId ? { companyId } : {}),
  };
  const deleted = await WorkOrder.findOneAndDelete(query).lean();
  return deleted ? 'success' : 'failed';
}
