interface Props {
   params: { vehicleId: string };
}

import Link from 'next/link';

export default function VehiclePage({ params }) {
   const { id } = params;

   // Fetch vehicle + service history
   const vehicle = {id:"subaru-forester", mileage: 150000, make:"Subaru", model:"forester", year:"2005"}  //getVehicleById(id);
   const history = [
      { _id: 'mock1', id:"subaru-forester", serviceType: 'Oil Change', date: '2025-01-01', mileage: 150000 },
   ];
   //const history = getServiceHistory(id);

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center mb-6">
            {' '}
            <Link
               href="/dashboard"
               className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
               {' '}
               Back to Dashboard{' '}
            </Link>{' '}
         </div>
         <h1 className="text-2xl font-bold">
            {vehicle.year} {vehicle.make} {vehicle.model}
         </h1>

         {/* Buttons */}
         <div className="flex gap-4">
            <Link
               href={{
                  pathname: '/record-service',
                  query: {
                     vehicleId: id,

                     location: 'na',
                  },
               }}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
               Create Work Order
            </Link>

            <Link
               href={{
                  pathname: '/record-service',
                  query: {
                     vehicleId: id,
                     serviceType: 'Inspection',
                     location: 'na',
                  },
               }}
               className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
               Record Inspection
            </Link>

               <Link
               href={{
                  pathname: '/record-service',
                  query: {
                     vehicleId: vehicle.id,
                     name: vehicle.model,
                     
                  },
               }}
               className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
               Record Service
            </Link>
         </div>

         {/* Service History */}
         <div>
            <h2 className="text-xl font-semibold mb-2">Service History</h2>

            {history.length === 0 && (
               <p className="text-gray-500">No service records yet.</p>
            )}

            <ul className="space-y-3">
               {history?.map((item) => (
                  <li key={item?._id} className="border p-3 rounded-lg">
                     <div className="font-medium">{item.serviceType}</div>
                     <div className="text-sm text-gray-600">
                        {item.date} — {item.mileage} km
                     </div>
                  </li>
               ))}
            </ul>
         </div>
      </div>
   );
}
