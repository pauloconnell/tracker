import type { IServiceRecord } from '@/types/IServiceRecord';

export function normalizeServiceRecord(record: IServiceRecord): IServiceRecord {
  return {
    ...record,
    _id: record._id.toString(),
    vehicleId: record.vehicleId.toString(),
    serviceDate: record.serviceDate ? new Date(record.serviceDate).toISOString().split('T')[0] : '',
    serviceDueDate: record.serviceDueDate ? new Date(record.serviceDueDate).toISOString().split('T')[0] : '',
    createdAt: new Date(record?.createdAt).toISOString(),
    updatedAt: new Date(record?.updatedAt).toISOString(),
  };
}
