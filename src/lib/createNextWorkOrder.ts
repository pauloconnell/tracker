import WorkOrder from "@/models/WorkOrder";
import Vehicle from "@/models/Vehicle";
import mongoose from "mongoose";

export async function createNextWorkOrder(prevWO) {

   if (!mongoose.isValidObjectId(prevWO.vehicleId)) {
     return null; // or throw an error
   }
   
   const vehicle = await Vehicle.findById(prevWO.vehicleId);
   if (!vehicle) return null;


   

   // Compute next due KM
   const nextKM = prevWO.serviceFrequencyKM
      ? (prevWO.serviceDueKM ?? prevWO.mileage) + prevWO.serviceFrequencyKM
      : null;

   // Compute next due date
   const nextDate = prevWO.serviceFrequencyWeeks
      ? new Date(Date.now() + prevWO.serviceFrequencyWeeks * 7 * 24 * 60 * 60 * 1000)  // number of miliseconds in a week
      : null;

   // Create the new work order
   await WorkOrder.create({
      vehicleId: prevWO.vehicleId,
      name: prevWO.name,
      serviceType: prevWO.serviceType,
      notes: "",
      location: ["N/A"],
      mileage: vehicle.mileage, // current mileage
      status: "open",
      serviceDueDate: nextDate,
      serviceDueKM: nextKM,
      isRecurring: true,
      serviceFrequencyKM: prevWO.serviceFrequencyKM,
      serviceFrequencyWeeks: prevWO.serviceFrequencyWeeks,
   });
}
