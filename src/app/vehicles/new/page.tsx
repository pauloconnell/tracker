'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewVehiclePage() {
   const router = useRouter();

   const [form, setForm] = useState({
      year: '',
      make: '',
      model: '',
      name: '',
      mileage: '',
      vin: '',
   });

   const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      const res = await fetch('/api/vehicles', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(form),
      });

      if (res.ok) {
         const vehicle = await res.json();
         router.push(`/vehicles/${vehicle._id}`);
      } else {
         alert('Failed to create vehicle');
      }
   };

   return (
      <div className="space-y-6">
         <h1 className="text-2xl font-bold">Add Vehicle</h1>

         <form onSubmit={handleSubmit} className="space-y-4">
            <input
               name="year"
               placeholder="Year"
               value={form.year}
               onChange={handleChange}
               className="border p-2 rounded w-full"
            />

            <input
               name="make"
               placeholder="Make"
               value={form.make}
               onChange={handleChange}
               className="border p-2 rounded w-full"
            />

            <input
               name="model"
               placeholder="Model"
               value={form.model}
               onChange={handleChange}
               className="border p-2 rounded w-full"
            />

            <input
               name="name"
               placeholder="Name"
               value={form.name}
               onChange={handleChange}
               className="border p-2 rounded w-full"
            />

            <input
               name="mileage"
               placeholder="Mileage"
               value={form.mileage}
               onChange={handleChange}
               className="border p-2 rounded w-full"
            />

            <input
               name="vin"
               placeholder="VIN"
               value={form.vin}
               onChange={handleChange}
               className="border p-2 rounded w-full"
            />

            <div className="flex justify-between items-center mt-6 px-3">
               <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
               >
                  Save Vehicle
               </button>

               <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
               >
                  Cancel
               </button>
            </div>
         </form>
      </div>
   );
}
