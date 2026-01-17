import { IFormBaseService } from '@/types/IFormBaseService';

export interface IFormServiceRecord extends IFormBaseService {       // react input forms will always be all strings -> mongoDB will convert this input into correct types based on schema

  serviceDate?: string; // yyyy-mm-dd

  workOrderId?: string;

  serviceDueDate?: string; // yyyy-mm-dd or ''
    serviceDueKM?: string;

}
