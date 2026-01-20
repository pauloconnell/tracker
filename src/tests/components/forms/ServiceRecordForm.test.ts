import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ServiceRecordForm from '@/components/Forms/ServiceRecordForm';

// Mock router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock sanitizeInput
vi.mock('@/lib/sanitizeInput', () => ({
  sanitizeInput: vi.fn((v) => v),
}));

// Mock Zustand store
const mockFetchAllVehicles = vi.fn();
const mockFetchVehicle = vi.fn();

vi.mock('@/store/useVehicleStore', () => ({
  useVehicleStore: (selector: any) =>
    selector({
      allVehicles: [
        { _id: 'veh1', nickName: 'Subaru', mileage: 123000 },
        { _id: 'veh2', nickName: 'Toyota', mileage: 200000 },
      ],
      selectedVehicle: { _id: 'veh1', nickName: 'Subaru', mileage: 123000 },
      fetchAllVehicles: mockFetchAllVehicles,
      fetchVehicle: mockFetchVehicle,
    }),
}));

// Mock fetch
global.fetch = vi.fn();

describe('ServiceRecordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial form fields', () => {
    render(<ServiceRecordForm vehicleId="veh1" />);

    expect(screen.getByLabelText(/Date Service Performed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Completed By/i)).toBeInTheDocument();
  });

  it('auto-fills nickname and mileage when vehicleId changes', () => {
    render(<ServiceRecordForm vehicleId="veh1" />);

    const vehicleSelect = screen.getByRole('combobox', { name: /vehicle/i });

    fireEvent.change(vehicleSelect, { target: { name: 'vehicleId', value: 'veh2' } });

    expect(screen.getByDisplayValue('Toyota')).toBeTruthy();
    expect(screen.getByDisplayValue('200000')).toBeTruthy();
  });

  it('updates generic fields via handleChange', () => {
    render(<ServiceRecordForm vehicleId="veh1" />);

    const completedBy = screen.getByPlaceholderText(/Technician Name/i);

    fireEvent.change(completedBy, {
      target: { name: 'completedBy', value: 'Paul' },
    });

    expect(completedBy).toHaveValue('Paul');
  });

  it('submits form successfully and redirects', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true });

    const { container } = render(<ServiceRecordForm vehicleId="veh1" />);

    const completedBy = screen.getByPlaceholderText(/Technician Name/i);
    fireEvent.change(completedBy, {
      target: { name: 'completedBy', value: 'Paul' },
    });

    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/service-records',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('alerts on failed submit', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    (fetch as any).mockResolvedValueOnce({ ok: false });

    const { container } = render(<ServiceRecordForm vehicleId="veh1" />);

    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to save record');
    });
  });
});
