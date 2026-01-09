import RecordServiceForm from '@/components/RecordService/RecordServiceForm';
import WorkOrderForm from '@/components/Forms/WorkOrderForm';
import { getAllVehicles } from '@/lib/vehicles';
import { useWorkOrderStore } from '@/store/useWorkOrderStore';

export default async function WorkOrderDetailPage({ params, searchParams }) {
   const { workOrderId } = await params;
 

   // Zustand Store only accessable in client - so server will just take the workorderId, client can confirm correct id and get workorder from store
   //const prefill = {
     // workOrderId,
      // vehicleId: searchParams?.vehicleId ?? storeWO.vehicleId ?? '',
      // serviceType: searchParams?.serviceType ?? storeWO.serviceType ?? '',
      // location: Array.isArray(searchParams?.location)
      //    ? searchParams.location
      //    : searchParams?.location
      //    ? [searchParams.location]
      //    : storeWO.location ?? ['N/A'],
      // mileage: searchParams?.mileage ?? storeWO.mileage ?? '',
      // status: searchParams?.status ?? storeWO.status ?? 'open',
      // serviceDueDate: searchParams?.serviceDueDate
      //    ? searchParams.serviceDueDate.split('T')[0]
      //    : storeWO.serviceDueDate
      //    ? storeWO.serviceDueDate.split('T')[0]
      //    : '',
      // serviceDueKM: searchParams?.serviceDueKM ?? storeWO.serviceDueKM ?? '',
      // name: searchParams?.name ?? storeWO.name ?? '',
      // type: searchParams?.type ?? storeWO.type ?? '',
      // year: searchParams?.year ?? storeWO.year ?? '',
      // notes: searchParams?.notes ?? storeWO.notes ?? '',
   //};
  //console.log('work order view page got ', workOrderId, searchParams, prefill);

   // Fetch all vehicles (for dropdowns, names, etc.)
   const vehicles = JSON.parse(JSON.stringify(await getAllVehicles()));

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-semibold mb-8">Work Order Details</h1>
            <WorkOrderForm workOrderId={workOrderId} vehicles={vehicles} />
         </div>
      </div>
   );
}
