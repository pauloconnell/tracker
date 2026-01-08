import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import WorkOrder from '@/models/WorkOrder';
import ServiceRecord from '@/models/ServiceRecord';

export async function PUT(req, { params }) {
  await connectDB();

  const id = params.id;
  const body = await req.json(); // contains completedBy

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const workOrder = await WorkOrder.findById(id).lean();
  if (!workOrder) {
    return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
  }

  // 1. Update the work order
  await WorkOrder.findByIdAndUpdate(id, {
    status: 'Completed',
    completedBy: body.completedBy,
    completedDate: new Date(),
  });

  // 2. Create the service record
  const serviceRecord = await ServiceRecord.create({
    vehicleId: workOrder.vehicleId,
    workOrderId: id,
    mileage: workOrder.mileage,
    tasks: workOrder.tasks,
    notes: workOrder.notes,
    location: workOrder.location,
    serviceType: workOrder.serviceType,
    completedBy: body.completedBy,
  });

  return NextResponse.json({ serviceRecordId: serviceRecord._id });
}
