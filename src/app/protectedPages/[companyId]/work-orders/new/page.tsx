import { Metadata } from 'next';
import WorkOrderFormWrapper from './WorkOrderFormWrapper';
import { getAllVehicles } from '@/lib/db/vehicles';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
         <h1 className="text-3xl font-semibold mb-8">Create Work Order</h1>
         <div className="max-w-3xl">
            <WorkOrderFormWrapper companyId={companyId} vehicles={vehicles} />
         </div>
      </div>
   );
}
