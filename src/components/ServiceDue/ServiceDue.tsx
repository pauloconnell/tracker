'use client';
import { useEffect, useState, useRef } from 'react';
import { useWorkOrderStore } from '@/store/useWorkOrderStore';
import { useVehicleStore } from '@/store/useVehicleStore';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { CardWorkOrder } from '@/components/UI/CardWorkOrder';


interface ServiceDueProps {
   vehicleId?: string;
   companyId: string;
}

export default function ServiceDue({ vehicleId, companyId }: ServiceDueProps) {
   const fetchAllWorkOrders = useWorkOrderStore((s) => s.fetchAllWorkOrders);
   const getUpcomingWorkOrders = useWorkOrderStore((s) => s.getUpcomingWorkOrders);
   const reorderWorkOrders = useWorkOrderStore((s) => s.reorderWorkOrders);
   const [loading, setLoading] = useState(true);
   const { selectedVehicle, fetchVehicle } = useVehicleStore();
   const dragIndex = useRef<number | null>(null);

   useEffect(() => {
      if (!companyId || companyId === 'undefined') return;
      setLoading(true);
      fetchAllWorkOrders(companyId)
        .catch(console.error)
        .finally(() => setLoading(false));
   }, [companyId, fetchAllWorkOrders]);

   const upcoming = getUpcomingWorkOrders();
   const workOrders = (vehicleId ? upcoming.filter((wo) => wo.vehicleId === vehicleId) : upcoming)
      .slice()
      .sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));

   const handleDrop = async (dropIndex: number) => {
      if (dragIndex.current === null || dragIndex.current === dropIndex) return;
      const from = dragIndex.current;
      dragIndex.current = null;

      const reordered = [...workOrders];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(dropIndex, 0, moved);

      const above = reordered[dropIndex - 1]?.priority ?? (reordered[dropIndex + 1]?.priority ?? 10) - 1;
      const below = reordered[dropIndex + 1]?.priority ?? (reordered[dropIndex - 1]?.priority ?? 10) + 1;
      const newPriority = (above + below) / 2;

      reorderWorkOrders(moved._id, newPriority);

      await fetch(`/api/work-orders/${moved._id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ companyId, priority: newPriority }),
      });
   };

   // if passed vehicleId in URL, then populate store with vehicle details
useEffect(() => {
  if (vehicleId && !selectedVehicle) {
    setLoading(true);
    fetchVehicle(vehicleId, companyId)
      .catch(console.error)
      .finally(() => setLoading(false));
  }
}, [vehicleId, selectedVehicle]);


    if (loading) return <div><LoadingSpinner /> Loading…</div>;

   if (!workOrders.length) {
      return <div>No service due for at least 2 weeks</div>;
   }
  
   //if (workOrders.length === 0) return <div className="text-gray-500">No outstanding work orders</div>;

   return (
      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-100 shadow-sm">
         <ul className="space-y-3">
            {workOrders.map((wo, index) => (
               <li
                  key={wo._id}
                  draggable
                  onDragStart={() => { dragIndex.current = index; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className="p-3 border rounded-lg bg-yellow-50 hover:bg-gray-50 transition cursor-grab active:cursor-grabbing"
               >
                  <CardWorkOrder wo={wo} companyId={companyId} />
               </li>
            ))}
         </ul>
      </div>
   );
}
