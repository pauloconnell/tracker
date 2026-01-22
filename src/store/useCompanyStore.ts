import { create } from 'zustand';

interface useCompanyState {
  activeCompanyId: string | null;
  setActiveCompanyId: (id: string) => void;
  clearCompany: () => void;
}

export const useCompanyStore = create<useCompanyState>((set) => ({
  activeCompanyId: null, // Default to null until a company is selected
  
  setActiveCompanyId: (id: string) => set({ activeCompanyId: id }),
  
  clearCompany: () => set({ activeCompanyId: null }),
}));