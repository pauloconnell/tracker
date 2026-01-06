import { getAllVehicles } from '@/lib/vehicles';
import RecordServiceForm from '@/components/RecordService/RecordServiceForm';

export default async function RecordServicePage({ searchParams }) {
  

   const prefill = {
      id: searchParams.id || '',
      name: searchParams.name || '',
      serviceType: searchParams.serviceType || '',
      location: searchParams.location || '',
      mileage: searchParams.mileage || '',
   };

    const vehicles = await getAllVehicles();

    
   return (
      <div className="min-h-screen bg-gray-50">
         <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-semibold mb-8">Record Service</h1>
            <RecordServiceForm prefill={prefill} vehicles={vehicles} />
         </div>
      </div>
   );
}
