'use client';

import { useState } from 'react';

export default function RecordServiceForm() {
   const [form, setForm] = useState({
      vehicleId: '',
      serviceType: '',
      location: ['N/A'],
      date: '',
      mileage: '',
      notes: '',
   });

   const vehicles = [
      { id: 'subaru-forester', name: '2014 Subaru Forester' },
      { id: 'toyota-tacoma', name: '2018 Toyota Tacoma' },
   ];

   const serviceTypes = [
      'Oil Change',
      'Brake Service',
      'Tire Rotation',
      'Coolant Flush',
      'Transmission Service',
      'Inspection',
      'Other',
   ];
   const locations = [
      { value: 'front', label: 'Front' },
      { value: 'rear', label: 'Rear' },
      { value: 'fr', label: 'Front Right (FR)' },
      { value: 'fl', label: 'Front Left (FL)' },
      { value: 'rr', label: 'Rear Right (RR)' },
      { value: 'rl', label: 'Rear Left (RL)' },
      
   ];

   function handleChange(e) {
      setForm({ ...form, [e.target.name]: e.target.value });
   }

   function handleSubmit(e) {
      e.preventDefault();
      console.log('Submitting service record:', form);
      // TODO: send to API route
   }

   return (
      <form
         onSubmit={handleSubmit}
         className="bg-white p-6 rounded-lg shadow-sm border space-y-6"
      >
         {/* Vehicle */}
         <div>
            <label className="block font-medium mb-1">Vehicle</label>
            <select
               name="vehicleId"
               value={form.vehicleId}
               onChange={handleChange}
               className="w-full border rounded-lg p-2"
               required
            >
               <option value="">Select vehicle</option>
               {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                     {v.name}
                  </option>
               ))}
            </select>
         </div>

         {/* Service Type */}
         <div>
            <label className="block font-medium mb-1">Service Type</label>
            <select
               name="serviceType"
               value={form.serviceType}
               onChange={handleChange}
               className="w-full border rounded-lg p-2"
               required
            >
               <option value="">Select service</option>
               {serviceTypes.map((s) => (
                  <option key={s} value={s}>
                     {s}
                  </option>
               ))}
            </select>
         </div>
  {/* Location */}
<div>
  <label className="block font-medium mb-2">Location</label>

  <div className="grid grid-cols-2 gap-3">
    {locations.map((loc) => (
      <label key={loc.value} className="flex items-center gap-2">
        <input
          type="checkbox"
          value={loc.value}
          checked={form.location.includes(loc.value)}
          onChange={(e) => {
            const value = e.target.value;
            let updated;

            if (form.location.includes(value)) {
              updated = form.location.filter((l) => l !== value);
            } else {
              updated = [...form.location, value];
            }

            // If anything other than N/A is selected, remove N/A
            if (updated.length > 1 && updated.includes("na")) {
              updated = updated.filter((l) => l !== "na");
            }

            // If nothing selected, default back to N/A
            if (updated.length === 0) {
              updated = ["na"];
            }

            setForm({ ...form, location: updated });
          }}
          className="h-4 w-4"
        />
        {loc.label}
      </label>
    ))}
  </div>
</div>

         {/* Date */}
         <div>
            <label className="block font-medium mb-1">Date</label>
            <input
               type="date"
               name="date"
               value={form.date}
               onChange={handleChange}
               className="w-full border rounded-lg p-2"
               required
            />
         </div>

         {/* Mileage */}
         <div>
            <label className="block font-medium mb-1">Mileage</label>
            <input
               type="number"
               name="mileage"
               value={form.mileage}
               onChange={handleChange}
               className="w-full border rounded-lg p-2"
               placeholder="e.g. 182000"
               required
            />
         </div>

         {/* Notes */}
         <div>
            <label className="block font-medium mb-1">Notes</label>
            <textarea
               name="notes"
               value={form.notes}
               onChange={handleChange}
               className="w-full border rounded-lg p-2"
               rows={4}
               placeholder="Optional notes..."
            />
         </div>

         {/* Submit */}
         <button
            type="submit"
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
         >
            Save Service Record
         </button>
      </form>
   );
}
