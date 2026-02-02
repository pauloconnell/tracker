import { IBaseService } from '@/types/IBaseService';

export interface IWorkOrder extends IBaseService {
   nickName: string;
   year?: string;
   type?: string;
   companyId: string;
   status: 'open' | 'completed';
   previousWorkOrderId?: string;
   serviceDate: string;
   serviceDueDate?: string;
   serviceDueKM?: string;

   createdAt?: string;
   updatedAt?: string;

   completedDate?: string;


}

// Payload shape for creating a new work order
export type IWorkOrderInput = Omit<IWorkOrder, '_id' | 'createdAt' | 'updatedAt'>;

