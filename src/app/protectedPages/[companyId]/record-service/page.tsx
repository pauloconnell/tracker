import { Metadata } from 'next';
import ServiceRecordFormWrapper from './ServiceRecordFormWrapper';

export const metadata: Metadata = {
  title: 'Record Service',
};

export default async function RecordServicePage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <ServiceRecordFormWrapper companyId={companyId} />
    </div>
  );
}
