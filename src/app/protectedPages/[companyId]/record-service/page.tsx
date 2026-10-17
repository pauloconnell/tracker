import { Metadata } from 'next';
import ServiceRecordFormWrapper from './ServiceRecordFormWrapper';

export const metadata: Metadata = {
  title: 'Record Service',
};

export default async function RecordServicePage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
       
        <ServiceRecordFormWrapper companyId={companyId} />
      </div>
    </div>
  );
}
