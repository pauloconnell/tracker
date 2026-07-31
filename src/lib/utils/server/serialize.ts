import type { IVehicle } from '@/types/IVehicle';
import type { IWorkOrder } from '@/types/IWorkOrder';
import type { IServiceRecord } from '@/types/IServiceRecord';

export function serializeVehicle(v: any): IVehicle {
  return {
    ...v,
    _id: v._id?.toString() ?? '',
    companyId: v.companyId?.toString?.() ?? '',
    vehicleId: v.vehicleId?.toString() ?? v._id?.toString() ?? '',
    createdAt: v.createdAt?.toISOString?.() ?? null,
    updatedAt: v.updatedAt?.toISOString?.() ?? null,
  };
}

export function serializeWorkOrder(wo: any): IWorkOrder {
  return {
    ...wo,
    _id: wo._id?.toString() ?? '',
    companyId: wo.companyId?.toString?.() ?? '',
    vehicleId: wo.vehicleId?.toString() ?? '',
    createdAt: wo.createdAt?.toISOString?.() ?? null,
    updatedAt: wo.updatedAt?.toISOString?.() ?? null,
  };
}

export function serializeServiceRecord(r: any): IServiceRecord {
  return {
    ...r,
    _id: r._id?.toString() ?? '',
    companyId: r.companyId?.toString?.() ?? '',
    vehicleId: r.vehicleId?.toString() ?? '',
    serviceDate: r.serviceDate ? new Date(r.serviceDate).toISOString().split('T')[0] : '',
    serviceDueDate: r.serviceDueDate ? new Date(r.serviceDueDate).toISOString().split('T')[0] : '',
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : null,
  };
}
