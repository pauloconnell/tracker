import { Suspense } from 'react';
import ServiceRecordForm from '@/components/Forms/ServiceRecordForm';

interface ServiceRecordFormWrapperProps {
  companyId: string;
  vehicleId?: string;
}

export default function ServiceRecordFormWrapper({ companyId, vehicleId }: ServiceRecordFormWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceRecordForm companyId={companyId} vehicleId={vehicleId} />
    </Suspense>
  );
}
