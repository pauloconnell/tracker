import { Metadata } from 'next';
import WorkOrderFormWrapper from './WorkOrderFormWrapper';
import { getAllVehicles } from '@/lib/vehicles';

export const metadata: Metadata = {
   title: 'Create Work Order',
};

export default async function NewWorkOrderPage({
   params,
   searchParams,
}: {
   params: Promise<{ companyId: string }>;
   searchParams: Promise<{ vehicleId?: string }>;
}) {

  const { companyId } = await params;
  const { vehicleId } = await searchParams;
   const vehicles = await getAllVehicles(companyId);

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-semibold mb-8">Create Work Order</h1>
            <WorkOrderFormWrapper companyId={companyId} vehicles={vehicles} />
         </div>
      </div>
   );
}
