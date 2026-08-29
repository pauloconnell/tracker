'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IWorkOrder } from '@/types/IWorkOrder';
import { useWorkOrderStore } from '@/store/useWorkOrderStore';
import { useVehicleStore } from '@/store/useVehicleStore';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { CardWorkOrder } from '@/components/UI/CardWorkOrder';
import {
   DndContext,
   closestCenter,
   PointerSensor,
   TouchSensor,
   useSensor,
   useSensors,
   DragEndEvent,
} from '@dnd-kit/core';
import {
   SortableContext,
   useSortable,
   verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ServiceDueProps {
   vehicleId?: string;
   companyId: string;
}

function SortableItem({ wo, companyId }: { wo: IWorkOrder; companyId: string }) {
   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: wo._id });
   return (
      <li
         ref={setNodeRef}
         style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
         className="p-3 border rounded-lg bg-yellow-50 hover:bg-gray-50 transition cursor-grab active:cursor-grabbing"
      >
         {/* drag handle covers the whole card except the chevron link */}
         <div {...attributes} {...listeners} className="touch-none">
            <CardWorkOrder wo={wo} companyId={companyId} />
         </div>
      </li>
   );
}

export default function ServiceDue({ vehicleId, companyId }: ServiceDueProps) {
   const fetchAllWorkOrders = useWorkOrderStore((s) => s.fetchAllWorkOrders);
   const getUpcomingWorkOrders = useWorkOrderStore((s) => s.getUpcomingWorkOrders);
   const reorderWorkOrders = useWorkOrderStore((s) => s.reorderWorkOrders);
   const workOrders = useWorkOrderStore((s) => s.workOrders);
   const [loading, setLoading] = useState(true);
   const [localList, setLocalList] = useState<IWorkOrder[]>([]);
   const { selectedVehicle, fetchVehicle } = useVehicleStore();

   const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
   );

   useEffect(() => {
      if (!companyId || companyId === 'undefined') return;
      setLoading(true);
      fetchAllWorkOrders(companyId)
         .catch(console.error)
         .finally(() => setLoading(false));
   }, [companyId, fetchAllWorkOrders]);

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

   const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = localList.findIndex((wo) => wo._id === active.id);
      const newIndex = localList.findIndex((wo) => wo._id === over.id);

      const reordered = [...localList];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      const above = reordered[newIndex - 1]?.priority ?? (reordered[newIndex + 1]?.priority ?? 10) - 1;
      const below = reordered[newIndex + 1]?.priority ?? (reordered[newIndex - 1]?.priority ?? 10) + 1;
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
         toast.success('Order saved', { id: toastId });
      } catch {
         toast.error('Failed to save order', { id: toastId });
      }
   };

   if (loading) return <div><LoadingSpinner /> Loading…</div>;
   if (!localList.length) return <div>No service due for at least 2 weeks</div>;

   return (
      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-100 shadow-sm">
         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={localList.map((wo) => wo._id)} strategy={verticalListSortingStrategy}>
               <ul className="space-y-3">
                  {localList.map((wo) => (
                     <SortableItem key={wo._id} wo={wo} companyId={companyId} />
                  ))}
               </ul>
            </SortableContext>
         </DndContext>
      </div>
   );
}
