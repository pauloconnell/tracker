import { NextResponse, NextRequest } from "next/server";
import { createServiceRecord } from "@/lib/serviceRecords";
import ServiceRecord from "@/models/ServiceRecord"; 
import { sanitizeCreate } from "@/lib/sanitizeCreate";
import { IServiceRecord } from "@/types/IServiceRecord"
import { getAuthSession, unauthenticatedResponse, validationErrorResponse } from '@/lib/auth';
import { hasPermission } from '@/lib/rbac';

//POST /api/service-records

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return unauthenticatedResponse();

    const body: Partial<IServiceRecord> & { companyId?: string } = await req.json();
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
    return NextResponse.json("Success", { status: 201 });
  } catch (err) {
    console.error("Error creating service record:", err);
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}
