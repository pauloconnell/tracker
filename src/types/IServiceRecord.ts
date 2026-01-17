
import { IBaseService } from '@/types/IBaseService'


export interface IServiceRecord extends IBaseService {
    serviceDate: Date | string;// required

    // Track originating work order
    workOrderId?: string;

    // Work order scheduling info preserved for history
    serviceDueDate?: Date | string | null;
    serviceDueKM?: number | null;

 

    // Timestamps (ISO strings on the client, Date objects on the server) 
    createdAt: Date | string;
    updatedAt: Date | string
}
