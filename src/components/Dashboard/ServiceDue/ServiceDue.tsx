"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IWorkOrder } from "@/types";



export default function ServiceDue({ vehicleId }) {
   const [workOrders, setWorkOrders] = useState<IWorkOrder[]>([]);
   const [loading, setLoading] = useState(true);
   useEffect(() => {
      async function load() {
         try {
            const url = vehicleId                  // get all work orders, or only specific vehicle if passed vehicleId
               ? `/api/work-orders?vehicleId=${vehicleId}`
               : `/api/work-orders`;
            const res = await fetch(url);
            const data = await res.json();
            setWorkOrders(data);
         } catch (err) {
            console.error('Failed to load work orders', err);
         } finally {
            setLoading(false);
         }
      }
      load();
   }, [vehicleId]);
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
                     href={{
                        pathname: `/protectedPages/work-orders/${wo._id}`,
                        query: {
                           vehicleId: wo.vehicleId,
                           serviceType: wo.serviceType,
                           location: wo.location,
                           workOrderId: wo._id,
                           serviceDueDate: wo.serviceDueDate,
                           name: wo.name, 
                           type: wo.type, 
                           year: wo.year, 
                           notes: wo.notes
                           
                        },
                     }}
                  >
                     <div className="font-medium">{wo.serviceType}</div>
                     <div className="text-sm text-gray-600">
                        {wo.name}, {wo.vehicleId}
                     </div>
                     <div className="text-sm text-gray-500">Service Due: {wo.serviceDueDate}</div>
                     <div className="text-sm text-gray-500">DueKM: {wo.dueKM}</div>
                  </Link>
               </li>
            ))}
         </ul>
      </div>
   );
}
