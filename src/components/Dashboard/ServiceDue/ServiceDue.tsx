'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IWorkOrder } from '@/types/workorder';
import { useWorkOrderStore, getWorkOrdersForVehicle } from '@/store/useWorkOrderStore';
import { useVehicleStore } from '@/store/useVehicleStore';
interface ServiceDueProps {
   vehicleId: string;
}

export default function ServiceDue({ vehicleId }: ServiceDueProps) {
   const setSelectedWorkOrder = useWorkOrderStore((s) => s.setSelectedWorkOrder);
   const getWorkOrdersForVehicle = useWorkOrderStore((s) => s.getWorkOrdersForVehicle);
   const getUpcomingWorkOrders = useWorkOrderStore((s) => s.getUpcomingWorkOrders);
   const [loading, setLoading] = useState(true);
   const { selectedVehicle, fetchVehicle } = useVehicleStore();

   // If a vehicleId is passed, filter upcoming WOs for that vehicle
   const workOrders = vehicleId
      ? getWorkOrdersForVehicle(vehicleId).filter((wo) =>
           getUpcomingWorkOrders().includes(wo)
        )
      : getUpcomingWorkOrders();
   if (!workOrders.length) {
      return <div>No upcoming service due</div>;
   }

   // if passed vehicleId in URL, then populate store with vehicle details
   useEffect(() => {
      if (vehicleId && !selectedVehicle) {
         fetchVehicle(vehicleId);
      }
   }, [vehicleId, selectedVehicle]);

   if (loading) return <div>Loading…</div>;
   //if (workOrders.length === 0) return <div className="text-gray-500">No outstanding work orders</div>;

   return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
         {workOrders.length === 0 && <p className="text-gray-500">No service due.</p>}

         <ul className="space-y-3">
            {workOrders.map((wo) => (
               <li
                  key={wo._id}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition"
               >
                  <Link
                     href={`/protectedPages/work-orders/${wo._id}`}
                     onClick={() => setSelectedWorkOrder(wo)}
                  >
                     <div className="text-center font-extrabold text-lg mb-2">
                        {/* <pre className="text-xs text-left"> {JSON.stringify(wo, null, 2)} </pre>  */}
                        {wo?.name ?? ''}
                     </div>
                     <div className="font-medium">{wo.serviceType}</div>
                     <div className="text-sm text-gray-600"></div>
                     <div className="text-sm text-gray-500">
                        Service Due: {wo.serviceDueDate}
                     </div>
                     <div className="text-sm text-gray-500">
                        Service Due @: {wo.serviceDueKM} KM
                     </div>
                  </Link>
               </li>
            ))}
         </ul>
      </div>
   );
}
