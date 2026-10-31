import { Metadata } from 'next';
import WorkOrderEditFormWrapper from './edit/WorkOrderEditFormWrapper';
import { getAllVehicles } from '@/lib/db/vehicles';

export const metadata: Metadata = {
  title: 'Work Order Details',
};

export default async function WorkOrderDetailPage({
  params,
}: {
  params: Promise<{ companyId: string; workOrderId: string }>;
}) {
  const { companyId, workOrderId } = await params;

  const vehicles = await getAllVehicles(companyId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-semibold mb-8">Work Order Details</h1>
      <div className="max-w-3xl">
        <WorkOrderEditFormWrapper companyId={companyId} workOrderId={workOrderId} vehicles={vehicles} />
      </div>
    </div>
  );
}
