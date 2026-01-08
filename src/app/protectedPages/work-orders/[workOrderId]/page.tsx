import RecordServiceForm from '@/components/RecordService/RecordServiceForm';
import WorkOrderForm from '@/components/Forms/WorkOrderForm';
import { getAllVehicles } from '@/lib/vehicles';

export default async function WorkOrderDetailPage({ params, searchParams }) {
   const { workOrderId } = await params;

   // Build a plain prefill object from searchParams
   const prefill = {
      workOrderId,
      vehicleId: searchParams.vehicleId || '',
      serviceType: searchParams.serviceType || '',
      location: searchParams.location || ['N/A'],
      mileage: searchParams.mileage || '',
      status: searchParams.status || 'open',
      serviceDueDate: searchParams.serviceDueDate
         ? searchParams.serviceDueDate.split('T')[0]
         : '',
         serviceDueKM: searchParams.serviceDueKM || '',
      name: searchParams.name || '',
      type: searchParams.type || '',
      year: searchParams.year || '',
      notes: searchParams.notes || '',
   };
   console.log('work order view page got ', workOrderId, searchParams, prefill);

   // Fetch all vehicles (for dropdowns, names, etc.)
   const vehicles = JSON.parse(JSON.stringify(await getAllVehicles()));

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-semibold mb-8">Work Order Details</h1>
            <WorkOrderForm prefill={prefill} vehicles={vehicles} />
         
         </div>
      </div>
   );
}
