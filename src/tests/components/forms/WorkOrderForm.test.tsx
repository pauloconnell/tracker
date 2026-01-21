import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WorkOrderForm from '@/components/Forms/WorkOrderForm';
import '@testing-library/jest-dom';

// ----------------------------- 
// Stable Router Mock 
vi.mock('next/navigation', () => {
   const mockRouter = { push: vi.fn(), back: vi.fn(), refresh: vi.fn() };
   return { useRouter: () => mockRouter };
});

// -----------------------------
// Mock toast
vi.mock('react-hot-toast', () => ({
   toast: {
      success: vi.fn(),
      error: vi.fn(),
   },
}));

// -----------------------------
// Mock sanitizeInput
// -----------------------------
vi.mock('@/lib/sanitizeInput', () => ({
   sanitizeInput: vi.fn((v) => v),
}));

// -----------------------------
// Mock Zustand stores
// -----------------------------
vi.mock('@/store/useWorkOrderStore', () => {
   const mockFetchWorkOrder = vi.fn();
   const mockFetchAllWorkOrders = vi.fn();
   
   // Create stable object references
   const stableStore = {
      selectedWorkOrder: {
         _id: 'wo123',
         vehicleId: 'veh1',
         serviceType: 'Oil Change',
         serviceDueDate: '2025-01-01T00:00:00.000Z',
         serviceDueKM: 5000,
         mileage: 120000,
         location: ['Shop'],
         notes: 'Check brakes',
         serviceDate: '2025-01-02T00:00:00.000Z',
         completedBy: '',
         isRecurring: false,
         serviceFrequencyKM: 0,
         serviceFrequencyWeeks: 0,
      },
      fetchWorkOrder: mockFetchWorkOrder,
      fetchAllWorkOrders: mockFetchAllWorkOrders,
   };
   
   return {
      useWorkOrderStore: (selector: any) => selector(stableStore),
   };
});

vi.mock('@/store/useVehicleStore', () => {
   const mockFetchVehicle = vi.fn();
   const mockSetSelectedVehicle = vi.fn();
   
   // Create stable object references
   const stableStore = {
      selectedVehicle: {
         _id: 'veh1',
         year: 2020,
         make: 'Subaru',
         nickName: 'Scooby',
      },
      fetchVehicle: mockFetchVehicle,
      setSelectedVehicle: mockSetSelectedVehicle,
   };
   
   return {
      useVehicleStore: (selector: any) => selector(stableStore),
   };
});

// -----------------------------
// Mock fetch
// -----------------------------
global.fetch = vi.fn();

describe('WorkOrderForm (Essential Tests)', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   // ----------------------------------------------------
   // 1. Basic rendering (create mode)
   // ----------------------------------------------------
   it('renders correctly in create mode', () => {
      render(<WorkOrderForm vehicles={[]} vehicleId="veh1" />);

      expect(screen.getByText('Save Work Order')).toBeInTheDocument();
   });

   // ----------------------------------------------------
   // 2. Edit mode loads existing work order
   // ----------------------------------------------------
   it('renders edit mode fields when workOrderId is provided', () => {
      render(<WorkOrderForm vehicles={[]} workOrderId="wo123" />);

      expect(screen.getByDisplayValue('Oil Change')).toBeInTheDocument();
      expect(screen.getByDisplayValue('120000')).toBeInTheDocument();
   });

   // ----------------------------------------------------
   // 3. handleChange updates form
   // ----------------------------------------------------
   it('updates form fields via handleChange', () => {
      render(<WorkOrderForm vehicles={[]} vehicleId="veh1" />);

      const notesInput = screen.getByPlaceholderText(/Notes/i);

      fireEvent.change(notesInput, {
         target: { name: 'notes', value: 'New note' },
      });

      expect(notesInput).toHaveValue('New note');
   });

   // ----------------------------------------------------
   // 4. Create mode submit
   // ----------------------------------------------------
   it('submits new work order (POST)', async () => {
      (fetch as any).mockResolvedValueOnce({ ok: true });

      const { container } = render(<WorkOrderForm vehicles={[]} vehicleId="veh1" />);

      fireEvent.submit(container.querySelector('form')!);

      await waitFor(() => {
         expect(fetch).toHaveBeenCalledWith(
            '/api/work-orders',
            expect.objectContaining({ method: 'POST' })
         );
      });
   });

   // ----------------------------------------------------
   // 5. Edit mode submit
   // ----------------------------------------------------
   it('submits edited work order (PUT)', async () => {
      (fetch as any).mockResolvedValueOnce({ ok: true });

      const { container } = render(<WorkOrderForm vehicles={[]} workOrderId="wo123" />);

      fireEvent.submit(container.querySelector('form')!);

      await waitFor(() => {
         expect(fetch).toHaveBeenCalledWith(
            '/api/work-orders/wo123',
            expect.objectContaining({ method: 'PUT' })
         );
      });
   });

   // ----------------------------------------------------
   // 6. Complete button triggers complete API
   // ----------------------------------------------------
   it('calls complete endpoint when clicking "Mark Work Order as Completed"', async () => {
      (fetch as any).mockResolvedValueOnce({ ok: true, json: () => ({}) });

      render(<WorkOrderForm vehicles={[]} workOrderId="wo123" />);

      const completedByInput = screen.getByPlaceholderText('Technician Name');
      fireEvent.change(completedByInput, {
         target: { name: 'completedBy', value: 'Paul' },
      });

      const completeBtn = screen.getByText(/Mark Work Order as Completed/i);
      fireEvent.click(completeBtn);

      await waitFor(() => {
         expect(fetch).toHaveBeenCalledWith(
            '/api/work-orders/wo123/complete',
            expect.objectContaining({ method: 'PUT' })
         );
      });
   });
});
