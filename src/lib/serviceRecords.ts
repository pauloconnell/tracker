import { connectDB } from './mongodb';
import ServiceRecord from '@/models/ServiceRecord';
import type { IWorkOrder } from '@/types/IWorkOrder';
import type { IVehicle } from '@/types/IVehicle';
import { IServiceRecord } from '@/types/IServiceRecord';

// helper to normalize Records
export function normalizeServiceRecord(record: IServiceRecord): IServiceRecord {
   return {
      ...record,
      _id: record._id.toString(),
      vehicleId: record.vehicleId.toString(),
      serviceDate: record.serviceDate ? new Date(record.serviceDate).toISOString().split('T')[0] : '',
      serviceDueDate: record.serviceDueDate  ? new Date(record.serviceDueDate).toISOString().split('T')[0] : '',
      createdAt: new Date(record.createdAt).toISOString(),
      updatedAt: new Date(record.updatedAt).toISOString(),
   };
}

export async function createServiceRecord(data: Partial<IServiceRecord>) {
   await connectDB();
   const record = await ServiceRecord.create(data);

   return normalizeServiceRecord(record.toObject());
}

export async function getServiceHistory(
   vehicleId: string,
   companyId?: string
): Promise<IServiceRecord[]> {
   await connectDB();
   const query: any = { vehicleId };
   if (companyId) {
      query.companyId = companyId;
   }
   const records = await ServiceRecord.find(query).sort({ date: -1 }).lean();

   return records.map(normalizeServiceRecord);
}

export async function getAllServiceRecords(companyId?: string): Promise<IServiceRecord[]> {
   await connectDB();
   const query = companyId ? { companyId } : {};
   const records = await ServiceRecord.find(query).lean();

   return records.map(normalizeServiceRecord);
}
