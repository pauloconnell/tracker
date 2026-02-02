import { create } from 'zustand';
import type { IVehicle } from '@/types/IVehicle';

interface VehicleState {
  // Single vehicle (detail view)
  selectedVehicle: IVehicle | null;
  setSelectedVehicle: (vehicle: IVehicle) => void;
  clearSelectedVehicle: () => void;
  fetchVehicle: (id: string) => Promise<void>;

  // All vehicles (dashboard, dropdowns, forms)
  allVehicles: IVehicle[];
  setAllVehicles: (vehicles: IVehicle[]) => void;
  fetchAllVehicles: (companyId: string) => Promise<void>;
  getAllVehicles: () => IVehicle[];
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  // --- Selected Vehicle ---
  selectedVehicle: null,

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  clearSelectedVehicle: () => set({ selectedVehicle: null }),

  fetchVehicle: async (id) => {
    try {
      console.log("store Fetching vehicle with id:", id);
      const res = await fetch(`/api/vehicles/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch vehicle: ${res.status}`);
      const data = await res.json();
      set({ selectedVehicle: data });
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      set({ selectedVehicle: null });
    }
  },


  // --- All Vehicles ---
  allVehicles: [],

  setAllVehicles: (vehicles) => set({ allVehicles: vehicles }),

  fetchAllVehicles: async (companyId) => {
    try {
      //console.log("Fetching vehicle with companyid:", companyId);
      const res = await fetch(`/api/vehicles?companyId=${companyId}`);
      if (!res.ok) throw new Error(`Failed to fetch vehicles: ${res.status}`);
      const data = await res.json();
      set({ allVehicles: data });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // set({ allVehicles: [] });
    }
  },

  getAllVehicles: () => get().allVehicles,

}))
