import { NextResponse } from "next/server";
import { createVehicle } from "@/lib/vehicles";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("body:", body);
        // Clean mileage input 
        if (body.mileage) { body.mileage = Number(body.mileage.replace(/,/g, "")); }
        const vehicle = await createVehicle(body);

        // Assign vehicleId = _id.toString() as this is used to create work orders and serviceRecords
        vehicle.vehicleId = vehicle._id.toString(); 
        await vehicle.save();

        return NextResponse.json(vehicle, { status: 201 });
    } catch (err) {
        console.error("Error creating vehicle:", err);
        return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
    }
}
