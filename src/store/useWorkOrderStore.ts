import { create } from 'zustand';
import type { IWorkOrder } from '@/types/workorder';

interface WorkOrderState {
   selectedWorkOrder: IWorkOrder | null;
   setSelectedWorkOrder: (wo: IWorkOrder) => void;
   clearSelectedWorkOrder: () => void;
   fetchWorkOrder: (id: string) => Promise<void>;
}

export const useWorkOrderStore = create<WorkOrderState>((set) => ({
   selectedWorkOrder: null,

   setSelectedWorkOrder: (wo) => set({ selectedWorkOrder: wo }),

   clearSelectedWorkOrder: () => set({ selectedWorkOrder: null }),

   fetchWorkOrder: async (id) => {
      const res = await fetch(`/api/work-orders/${id}`);
      const data = await res.json();
      set({ selectedWorkOrder: data });
   },
}));
