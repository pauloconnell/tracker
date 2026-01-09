import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import WorkOrder from '@/models/WorkOrder';
import { IWorkOrder } from '@/types/workorder';

export async function PUT(req, { params }) {
   await connectDB();
   const body = await req.json();
   const id = params.id;

   if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
   }
   const updated = await WorkOrder.findByIdAndUpdate(id, body, { new: true }).lean();
   if (!updated) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
   }
   return NextResponse.json(updated);
}

// get a specific work order given id (in the url of API)

export async function GET(req, { params }) {
   try {
      await connectDB();
      const { id } = params;
      const wo = await WorkOrder.findById(id).lean();
      if (!wo) {
         return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
      }
      return NextResponse.json({
         ...wo,
         _id: wo._id.toString(),
         vehicleId: wo.vehicleId?.toString?.() ?? '',
         createdAt: wo.createdAt?.toISOString?.() ?? null,
         updatedAt: wo.updatedAt?.toISOString?.() ?? null,
      });
   } catch (err) {
      console.error('Failed to fetch work order:', err);
      return NextResponse.json({ error: 'Failed to fetch work order' }, { status: 500 });
   }
}
