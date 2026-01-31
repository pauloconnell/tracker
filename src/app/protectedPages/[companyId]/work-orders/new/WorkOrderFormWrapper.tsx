'use client';

import WorkOrderForm from '@/components/Forms/WorkOrderForm';
import { IVehicle } from '@/types/IVehicle';

interface WorkOrderFormWrapperProps {
  companyId: string;
  
}



export default function WorkOrderFormWrapper({ companyId }: WorkOrderFormWrapperProps) {
  console.log("create new work order-> ", companyId);
  return <WorkOrderForm companyId={companyId}  />;
}
