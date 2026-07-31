import WorkOrder from '@/models/WorkOrder';
import Vehicle from '@/models/Vehicle';
import mongoose from 'mongoose';
import type { IWorkOrder } from '@/types/IWorkOrder';

export async function createNextWorkOrder(nextWO: Partial<IWorkOrder>) {
  if (!mongoose.isValidObjectId(nextWO.vehicleId)) return null;

  const vehicle = await Vehicle.findById(nextWO.vehicleId);
  if (!vehicle) return null;

  if (
    nextWO.companyId &&
    nextWO.nickName &&
    nextWO.serviceType &&
    nextWO.vehicleId &&
    nextWO.previousWorkOrderId &&
    nextWO.mileage !== undefined
  ) {
    await WorkOrder.create({
      companyId: nextWO.companyId,
      vehicleId: nextWO.vehicleId,
      previousWorkOrderId: nextWO.previousWorkOrderId,
      nickName: nextWO.nickName,
      serviceType: nextWO.serviceType,
      notes: nextWO.notes ?? '',
      location: nextWO.location ?? ['N/A'],
      mileage: nextWO.mileage,
      status: 'open',
      serviceDueDate: nextWO.serviceDueDate ?? null,
      serviceDueKM: nextWO.serviceDueKM ?? null,
      isRecurring: true,
      serviceFrequencyKM: nextWO.serviceFrequencyKM ?? null,
      serviceFrequencyWeeks: nextWO.serviceFrequencyWeeks ?? null,
    });
  } else {
    const nextKM = nextWO.serviceFrequencyKM
      ? (nextWO.serviceDueKM ?? nextWO.mileage) + nextWO.serviceFrequencyKM
      : null;
    const nextDate = nextWO.serviceFrequencyWeeks
      ? new Date(Date.now() + Number(nextWO.serviceFrequencyWeeks) * 7 * 24 * 60 * 60 * 1000)
      : null;

    await WorkOrder.create({
      companyId: nextWO.companyId,
      vehicleId: nextWO.vehicleId,
      previousWorkOrderId: nextWO.previousWorkOrderId,
      nickName: nextWO.nickName,
      serviceType: nextWO.serviceType,
      notes: nextWO.notes ?? '',
      location: nextWO.location ?? ['N/A'],
      mileage: vehicle.mileage,
      status: 'open',
      serviceDueDate: nextDate,
      serviceDueKM: nextKM,
      isRecurring: true,
      serviceFrequencyKM: nextWO.serviceFrequencyKM ?? null,
      serviceFrequencyWeeks: nextWO.serviceFrequencyWeeks ?? null,
    });
  }
}
