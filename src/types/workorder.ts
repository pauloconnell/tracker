export interface IWorkOrder {
  vehicleId: string;
  serviceType: string;
  notes?: string;
  mileage: number;
  status?: "open" | "completed";
  dueDate?: string | null;
}
