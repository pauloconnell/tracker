import { IFormBaseService } from '@/types/IFormBaseService';
export interface IFormWorkOrder  extends IFormBaseService {  // react input forms will be all strings -> mongoDB will convert this input into correct types based on schema
  workOrderId: string;

  serviceDate: string; // yyyy-mm-dd
  
  serviceDueDate: string; // yyyy-mm-dd or ''
  serviceDueKM: string;

}
