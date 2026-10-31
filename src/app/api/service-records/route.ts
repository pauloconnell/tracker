import { NextResponse, NextRequest } from "next/server";
import { createServiceRecord, getLastServiceRecord } from '@/lib/db/serviceRecords';
import ServiceRecord from "@/models/ServiceRecord"; 
import { sanitizeCreate } from '@/lib/utils/server/sanitizeCreate';
import { IServiceRecord } from "@/types/IServiceRecord"
import { getAuthSession, unauthenticatedResponse, validationErrorResponse } from '@/lib/auth';
import { hasPermission } from '@/lib/rbac';
import mongoose from 'mongoose';

//POST /api/service-records

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthenticatedResponse();

    const body: Partial<IServiceRecord> & { companyId: string } = await req.json();
    const companyId = body.companyId;

    if (!companyId) {
      return validationErrorResponse('companyId is required');
    }

    // RBAC: Check create permission
    const canCreate = await hasPermission(session.userId, companyId, 'serviceRecord', 'create');
    if (!canCreate) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const sanitized = sanitizeCreate<Partial<IServiceRecord>>(ServiceRecord, { ...body, companyId });

    const record = await createServiceRecord(sanitized);
    return NextResponse.json("Success", { status: 201 });   // we don't need service recordIds so just return a fast success(service records are view only, and reloaded on page navigation)
  } catch (err) {
    console.error("Error creating service record:", err);
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthenticatedResponse();

    const { searchParams } = new URL(req.url);
    const vehicleId = searchParams.get('vehicleId');
    const companyId = searchParams.get('companyId');
    const serviceType = searchParams.get('serviceType');

    if (!vehicleId || !companyId || !serviceType) {
      return validationErrorResponse('vehicleId, companyId and serviceType are required');
    }

    if (!mongoose.isValidObjectId(vehicleId) || !mongoose.isValidObjectId(companyId)) {
      return validationErrorResponse('Invalid ID format');
    }

    const canRead = await hasPermission(session.userId, companyId, 'serviceRecord', 'read');
    if (!canRead) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const record = await getLastServiceRecord(vehicleId, companyId, serviceType);
    return NextResponse.json(record ?? null);
  } catch (err) {
    console.error('Error fetching last service record:', err);
    return NextResponse.json({ error: 'Failed to fetch record' }, { status: 500 });
  }
}
