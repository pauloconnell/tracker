'use server';

import { connectDB } from '@/lib/mongodb';
import WorkOrder from '@/models/WorkOrder';
import ServiceRecord from '@/models/ServiceRecord';
import { createNextWorkOrder } from '@/lib/db/createNextWorkOrder';
import { IWorkOrder } from '@/types/IWorkOrder';
import { getAuthSession } from '@/lib/auth';
import { hasPermission } from '@/lib/rbac';
import mongoose from 'mongoose';

export async function completeWorkOrder(workOrderId: string, completedBy: string) {
  const session = await getAuthSession();
  if (!session) throw new Error('Authentication required');

  if (!workOrderId || !mongoose.Types.ObjectId.isValid(workOrderId)) {
    throw new Error('Invalid work order ID');
  }
  if (!completedBy) throw new Error('completedBy is required');

  await connectDB();

  const workOrder = await WorkOrder.findById(workOrderId).lean();
  if (!workOrder) throw new Error('Work order not found');

  const companyId = workOrder.companyId?.toString() ?? '';
  if (!companyId) throw new Error('Work order missing company context');

  const canComplete = await hasPermission(session.userId, companyId, 'workOrder', 'complete');
  if (!canComplete) throw new Error('Forbidden');

  await WorkOrder.findOneAndUpdate(
    { _id: workOrderId, companyId },
    { status: 'completed', completedBy, completedDate: new Date() }
  );

  await ServiceRecord.create({
    companyId,
    vehicleId: workOrder.vehicleId,
    workOrderId: workOrder._id,
    serviceType: workOrder.serviceType,
    serviceDate: new Date(),
    serviceDueDate: workOrder.serviceDueDate ?? null,
    serviceDueKM: workOrder.serviceDueKM ?? null,
    mileage: workOrder.mileage,
    location: workOrder.location ?? [],
    notes: workOrder.notes ?? '',
    completedBy,
    serviceFrequencyKM: workOrder.serviceFrequencyKM ?? null,
    serviceFrequencyWeeks: workOrder.serviceFrequencyWeeks ?? null,
    isRecurring: workOrder.isRecurring ?? false,
  });

  if (workOrder.isRecurring) {
    const next: Partial<IWorkOrder> = {
      companyId,
      vehicleId: workOrder.vehicleId,
      nickName: workOrder.nickName,
      previousWorkOrderId: workOrder._id,
      serviceType: workOrder.serviceType,
      isRecurring: true,
      location: workOrder.location ?? [],
      notes: workOrder.notes ?? '',
      mileage: workOrder.mileage,
      serviceFrequencyKM: workOrder.serviceFrequencyKM ?? null,
      serviceFrequencyWeeks: workOrder.serviceFrequencyWeeks ?? null,
    };

    if (workOrder.serviceFrequencyKM) {
      next.serviceDueKM = (workOrder.mileage ?? 0) + workOrder.serviceFrequencyKM;
    }
    if (workOrder.serviceFrequencyWeeks) {
      const nextDate = new Date(workOrder?.serviceDate ?? Date.now());
      nextDate.setDate(nextDate.getDate() + workOrder.serviceFrequencyWeeks * 7);
      next.serviceDueDate = nextDate.toISOString().split('T')[0];
    }

    try {
      await createNextWorkOrder(next as IWorkOrder);
    } catch (err) {
      console.error('Failed to create next recurring work order:', err);
    }
  }
}
