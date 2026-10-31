'use client';
import { useState, useEffect, useRef } from 'react';
import type { IVehicle } from '@/types/IVehicle';
import type { IFormBaseService } from '@/types/IFormBaseService';
import { SERVICE_TYPES, SERVICE_TYPES_BY_VEHICLE } from '@/constants/service';
import { LOCATIONS } from '@/constants/locations';
import { apiFetch } from '@/lib/utils/apiFetch';

interface LocationOption {
   value: string;
   label: string;
}

interface SharedFieldsFormProps <T extends IFormBaseService> { 
   form: T; 
   setForm: React.Dispatch<React.SetStateAction<T>>; 
   vehicles: IVehicle[]; 
   handleChange: ( e: React.ChangeEvent< HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement > ) => void;
   vehicleType?: string;
}


export default function SharedServiceFormFields<T extends IFormBaseService>({
   form, setForm, vehicles, handleChange, vehicleType, }: SharedFieldsFormProps<T>) {



   // toggle lock for recurring service intervals
   const [isLocked, setIsLocked] = useState(form.isRecurring);
   const serviceTypes = vehicleType ? (SERVICE_TYPES_BY_VEHICLE[vehicleType] ?? SERVICE_TYPES) : SERVICE_TYPES;
   const isLegacyServiceType = form.serviceType !== '' && !serviceTypes.includes(form.serviceType);
   const locations = LOCATIONS;

   const [lastService, setLastService] = useState<{ date: string; mileage: string } | null | 'loading' | 'none'>('none');
   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   useEffect(() => {
      if (!form.serviceType || !form.vehicleId || !form.companyId) {
         setLastService('none');
         return;
      }
      setLastService('loading');
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
         try {
            const res = await apiFetch(
               `/api/service-records?vehicleId=${form.vehicleId}&companyId=${form.companyId}&serviceType=${encodeURIComponent(form.serviceType)}`
            );
            if (!res.ok) { setLastService(null); return; }
            const data = await res.json();
            if (data) {
               setLastService({
                  date: new Date(data.serviceDate).toLocaleDateString(),
                  mileage: data.mileage ? `${data.mileage.toLocaleString()} km` : 'km unknown',
               });
            } else {
               setLastService(null);
            }
         } catch {
            setLastService(null);
         }
      }, 500);
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
   }, [form.serviceType, form.vehicleId, form.companyId]);

   return (
      <>
         {/* Vehicle */}
         <div>
            <label className="block font-medium mb-1">Vehicle</label>
            <select
               name="vehicleId"
               value={form.vehicleId}
               onChange={handleChange}
               className="border rounded px-3 py-2 w-full"
               required
            >
               <option value="">Select a vehicle</option>
               {vehicles?.map((v) => (
                  <option key={v._id} value={v._id}>
                     {v.year} {v.make} {v.model} {v.nickName}
                  </option>
               ))}
            </select>
         </div>

         {/* Service Type */}
         <div>
            <label className="block font-medium mb-1">Service Type</label>
            {isLegacyServiceType && (
               <div className="mb-2 p-2 bg-yellow-50 border border-yellow-300 rounded text-sm text-yellow-800">
                  <span className="font-medium">Current (legacy): </span>{form.serviceType}
               </div>
            )}
            <select
               name="serviceType"
               value={isLegacyServiceType ? '' : form.serviceType}
               onChange={handleChange}
               className="w-full border rounded-lg p-2"
               required={!isLegacyServiceType}
            >
               <option value="">{isLegacyServiceType ? 'Update to new service type (optional)' : 'Select service'}</option>
               {serviceTypes.map((s) => (
                  <option key={s} value={s}>{s}</option>
               ))}
            </select>
            {lastService === 'loading' && (
               <p className="text-xs text-gray-400 mt-1">Checking last service...</p>
            )}
            {lastService === null && (
               <p className="text-xs text-gray-400 mt-1">No previous record found</p>
            )}
            {lastService && lastService !== 'loading' && lastService !== 'none' && lastService !== null && (
               <p className="text-xs text-green-700 mt-1">Last done: {lastService?.date} @ {lastService?.mileage}</p>
            )}
         </div>

         {/* Location */}
         <div>
            <label className="block font-medium mb-2">Location</label>

            <div className="grid grid-cols-2 gap-3">
               {locations.map((loc) => (
                  <label
                     key={loc.value}
                     className="flex items-center gap-2 cursor-pointer"
                  >
                     <input
                        type="checkbox"
                        value={loc.value}
                        checked={form?.location.includes(loc.value)}
                        onChange={(e) => {
                           const value = e.target.value;
                           let updated = [...form?.location];

                           if (updated.includes(value)) {
                              updated = updated.filter((l) => l !== value);
                           } else {
                              updated.push(value);
                           }

                           if (updated.length > 1 && updated.includes('N/A')) {
                              updated = updated.filter((l) => l !== 'N/A');
                           }

                           if (updated.length === 0) {
                              updated = ['N/A'];
                           }

                           setForm({ ...form, location: updated });
                        }}
                        className="h-4 w-4"
                     />
                     <span>{loc.label}</span>
                  </label>
               ))}
            </div>
         </div>

         {/* Mileage */}
         <label className="flex flex-col flex-1 basis-1/2">
            Mileage
            <input
               type="number"
               name="mileage"
               value={form.mileage}
               onChange={handleChange}
               className="border border-gray-300 rounded-full px-4 py-2"
               placeholder="e.g. 182000"
               required
            />
         </label>

         {/* Recurring Service */}
         <div className="mt-4">
            <label className="flex items-center gap-2">
               <input
                  type="checkbox"
                  name="isRecurring"
                  checked={form.isRecurring}
                  disabled={isLocked}
                  onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })}
                  className={`h-5 w-5 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
               />
               <span className="font-medium">Recurring Service</span>
            </label>
         </div>

               {/* Edit Mode */}
         {form.isRecurring && (
            <div className="flex flex-col md:flex-row gap-4 mt-2">
               <div className="flex items-center gap-2 mb-4">
                  {' '}
                  <input
                     type="checkbox"
                     checked={!isLocked}
                     onChange={() => setIsLocked(!isLocked)}
                  />{' '}
                  <span className="font-medium"> Edit Mode </span>{' '}
               </div>

               {/* Freq KM */}
               <fieldset disabled={isLocked}>
                  <label className="flex flex-col flex-1">
                     Repeat Every: (KM)
                     <input
                        type="number"
                        name="serviceFrequencyKM"
                        value={form.serviceFrequencyKM ?? ''}
                        onChange={handleChange}
                        className="border rounded-full px-4 py-2"
                     />
                  </label>

               {/*  Freq Weeks */}
                  <label className="flex flex-col flex-1">
                     Repeat Every: (Weeks)
                     <input
                        type="number"
                        name="serviceFrequencyWeeks"
                        value={form.serviceFrequencyWeeks ?? ''}
                        onChange={handleChange}
                        className="border rounded-full px-4 py-2"
                     />
                  </label>
               </fieldset>
            </div>
         )}

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
      </>
   );
}
