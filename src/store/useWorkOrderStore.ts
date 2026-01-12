import { create } from 'zustand';
import type { IWorkOrder } from '@/types/workorder';

interface WorkOrderState {
   workOrders: IWorkOrder[];
   selectedWorkOrder: IWorkOrder | null;
   // Setters
   setSelectedWorkOrder: (wo: IWorkOrder | null) => void;
   clearSelectedWorkOrder: () => void;
   // Fetchers
   fetchAllWorkOrders: () => Promise<void>;
   fetchWorkOrder: (id: string) => Promise<void>;
   // Derived selectors
   getWorkOrdersForVehicle: (vehicleId: string) => IWorkOrder[];
   getUpcomingWorkOrders: () => IWorkOrder[];
}

export const useWorkOrderStore = create<WorkOrderState>((set, get) => ({
   workOrders: [],
   selectedWorkOrder: null,

   setSelectedWorkOrder: (wo) => set({ selectedWorkOrder: wo }),

   clearSelectedWorkOrder: () => set({ selectedWorkOrder: null }),

   fetchAllWorkOrders: async () => {
      const res = await fetch('/api/work-orders');
      const data = await res.json();
      set({ workOrders: data });
   },

   fetchWorkOrder: async (id) => {
      const res = await fetch(`/api/work-orders/${id}`);
      const data = await res.json();
      set({ selectedWorkOrder: data });
   },

   getWorkOrdersForVehicle: (vehicleId) => {
      return get().workOrders.filter((wo) => wo.vehicleId === vehicleId);
   },

   getUpcomingWorkOrders: () => {
      const now = new Date();
      const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      return get().workOrders.filter((wo) => {
         const dueDate = wo.serviceDueDate ? new Date(wo.serviceDueDate) : null;
         const dueKM = wo.serviceDueKM;
         const dateSoon = dueDate && dueDate >= now && dueDate <= twoWeeksFromNow;  // want all due before 2weeksFromNow
         const kmSoon = dueKM && wo.mileage && dueKM - wo.mileage <= 100;
         return dateSoon || kmSoon;
      });
   },
}));
