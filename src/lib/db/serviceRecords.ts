import { connectDB } from '@/lib/mongodb';
import ServiceRecord from '@/models/ServiceRecord';
import type { IServiceRecord } from '@/types/IServiceRecord';
import { serializeServiceRecord } from '@/lib/utils/server/serialize';

export async function createServiceRecord(data: Partial<IServiceRecord>) {
  await connectDB();
  const record = await ServiceRecord.create(data);
  return serializeServiceRecord(record.toObject());
}

export async function getServiceHistory(vehicleId: string, companyId?: string): Promise<IServiceRecord[]> {
  await connectDB();
  const query: any = { vehicleId };
  if (companyId) query.companyId = companyId;
  const records = await ServiceRecord.find(query).sort({ serviceDate: -1 }).lean();
  return records.map(serializeServiceRecord);
}

export async function getAllServiceRecords(companyId?: string): Promise<IServiceRecord[]> {
  await connectDB();
  const query = companyId ? { companyId } : {};
  const records = await ServiceRecord.find(query).lean();
  return records.map(serializeServiceRecord);
}
