import { create } from 'zustand';
import type { IVehicle } from '@/types/vehicle';

interface VehicleState {
  // Single vehicle (detail view)
  selectedVehicle: IVehicle | null;
  setSelectedVehicle: (vehicle: IVehicle) => void;
  clearSelectedVehicle: () => void;
  fetchVehicle: (id: string) => Promise<void>;

  // All vehicles (dashboard, dropdowns, forms)
  allVehicles: IVehicle[];
  setAllVehicles: (vehicles: IVehicle[]) => void;
  fetchAllVehicles: () => Promise<void>;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  // --- Selected Vehicle ---
  selectedVehicle: null,

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  clearSelectedVehicle: () => set({ selectedVehicle: null }),

  fetchVehicle: async (id) => {
    const res = await fetch(`/api/vehicles/${id}`);
    const data = await res.json();
    set({ selectedVehicle: data });
  },

  // --- All Vehicles ---
  allVehicles: [],

  setAllVehicles: (vehicles) => set({ allVehicles: vehicles }),

  fetchAllVehicles: async () => {
    const res = await fetch(`/api/vehicles`);
    const data = await res.json();
    set({ allVehicles: data });
  },
}));
