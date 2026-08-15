'use client';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { IWorkOrder } from '@/types/IWorkOrder';
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
   const workOrders = useWorkOrderStore((s) => s.workOrders);
   const [loading, setLoading] = useState(true);
   const [localList, setLocalList] = useState<IWorkOrder[]>([]);
   const { selectedVehicle, fetchVehicle } = useVehicleStore();
   const dragIndex = useRef<number | null>(null);

   useEffect(() => {
      if (!companyId || companyId === 'undefined') return;
      setLoading(true);
      fetchAllWorkOrders(companyId)
         .catch(console.error)
         .finally(() => setLoading(false));
   }, [companyId, fetchAllWorkOrders]);

   // Sync localList from store whenever store changes
   useEffect(() => {
      const upcoming = getUpcomingWorkOrders();
      const sorted = (vehicleId ? upcoming.filter((wo) => wo.vehicleId === vehicleId) : upcoming)
         .slice()
         .sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));
      setLocalList(sorted);
   }, [workOrders, vehicleId]);

   useEffect(() => {
      if (vehicleId && !selectedVehicle) {
         setLoading(true);
         fetchVehicle(vehicleId, companyId)
            .catch(console.error)
            .finally(() => setLoading(false));
      }
   }, [vehicleId, selectedVehicle]);

   const handleDrop = async (dropIndex: number) => {
      if (dragIndex.current === null || dragIndex.current === dropIndex) return;
      const from = dragIndex.current;
      dragIndex.current = null;

      const reordered = [...localList];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(dropIndex, 0, moved);

      const above = reordered[dropIndex - 1]?.priority ?? (reordered[dropIndex + 1]?.priority ?? 10) - 1;
      const below = reordered[dropIndex + 1]?.priority ?? (reordered[dropIndex - 1]?.priority ?? 10) + 1;
      const newPriority = (above + below) / 2;

      // Optimistic update
      setLocalList(reordered.map((wo) => wo._id === moved._id ? { ...wo, priority: newPriority } : wo));
      reorderWorkOrders(moved._id, newPriority);

      const toastId = toast.loading('Saving...');
      try {
         const res = await fetch(`/api/work-orders/${moved._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ companyId, priority: newPriority }),
         });
         if (!res.ok) throw new Error();
         toast.success('Saved', { id: toastId });
      } catch {
         toast.error('Failed to save priority order change', { id: toastId });
      }
   };

   if (loading) return <div><LoadingSpinner /> Loading…</div>;
   if (!localList.length) return <div>No service due for at least 2 weeks</div>;

   return (
      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-100 shadow-sm">
         <ul className="space-y-3">
            {localList.map((wo, index) => (
               <li
                  key={wo._id}
                  draggable
                  onDragStart={(e) => { e.stopPropagation(); dragIndex.current = index; }}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleDrop(index); }}
                  className=" border rounded-lg bg-yellow-50 hover:bg-gray-50 transition cursor-grab active:cursor-grabbing"
               >
                  <CardWorkOrder wo={wo} companyId={companyId} />
               </li>
            ))}
         </ul>
      </div>
   );
}
