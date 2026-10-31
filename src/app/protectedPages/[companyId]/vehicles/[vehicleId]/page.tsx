import Link from 'next/link';
import { getServiceHistory } from '@/lib/db/serviceRecords';
import { getVehicleById } from '@/lib/db/vehicles';
import ServiceDue from '@/components/ServiceDue/ServiceDue';

interface Props {
   params: Promise<{ companyId: string; vehicleId: string }>;
}

export default async function VehiclePage({ params }: Props) {
   const { companyId, vehicleId } = await params;

   // Fetch vehicle + service history from MongoDB
   const [vehicle, history] = await Promise.all([
      getVehicleById(vehicleId, companyId),
      getServiceHistory(vehicleId, companyId),
   ]);

   if (!vehicle) {
      return <div className="text-red-600 p-6">Vehicle not found</div>;
   }

   return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
         {/* Back Button */}
         <div className="flex justify-between items-center mb-6">
            <Link
               href={`/protectedPages/${companyId}/dashboard`}
               className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg border border-blue-600 hover:bg-white hover:text-black transition-colors duration-200 shadow-md hover:shadow-lg"
            >
               Back to Dashboard
            </Link>
            <Link
               href={`/protectedPages/${companyId}/vehicles/${vehicleId}/edit`}
               className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg border border-blue-600 hover:bg-white hover:text-black transition-colors duration-200 shadow-md hover:shadow-lg"
            >
               Edit Vehicle
            </Link>
         </div>

         {/* Vehicle Title */}
         <h1 className="text-2xl font-bold mb-1">
            {vehicle?.year} {vehicle?.make} {vehicle?.model} - {vehicle?.nickName}
         </h1>
         <h2 className="text-gray-600 mb-6">Type: {vehicle?.vehicleType ?? 'car/truck'} | KM: {vehicle?.mileage}</h2>

         {/* Action Buttons */}
         <div className="flex gap-4 mb-8">
            <Link
               href={`/protectedPages/${companyId}/work-orders/new?vehicleId=${vehicleId}`}
               className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg border border-blue-600 hover:bg-white hover:text-black transition-colors duration-200 shadow-md hover:shadow-lg"
            >
               Create Work Order
            </Link>

            <Link
               href={`/protectedPages/${companyId}/record-service/${vehicleId}`}
               className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg border border-blue-600 hover:bg-white hover:text-black transition-colors duration-200 shadow-md hover:shadow-lg"
            >
               Record Service
            </Link>
         </div>

         {/* Service Due */}
         <section className="flex flex-col gap-6 min-h-[150px] mb-8">
            <h2 className="text-2xl font-semibold">Service Due</h2>
            <ServiceDue companyId={companyId} vehicleId={vehicleId}  />
         </section>

         {/* Service History */}
         <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold">Service History</h2>
            {history.length === 0 ? (
               <p className="text-gray-500">No service history yet</p>
            ) : (
               <div className="space-y-4">
                  {history.map((record) => (
                     <div
                        key={record._id}
                        className="border border-gray-300 rounded-lg p-4 bg-white"
                     >
                        <p className="font-semibold">{record.serviceType}</p>
                        <p className="text-sm text-gray-600">
                           {new Date(record.serviceDate).toLocaleDateString()}
                        </p>
                        {record.notes && <p className="text-sm">{record.notes}</p>}
                     </div>
                  ))}
               </div>
            )}
         </section>
      </div>
   );
}
