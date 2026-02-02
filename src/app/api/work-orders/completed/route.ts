import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WorkOrder from "@/models/WorkOrder";
import mongoose from "mongoose";

// get all 'completed' work orders
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);


    const rawVehicleId = searchParams.get("vehicleId");

const vehicleId = rawVehicleId && mongoose.isValidObjectId(rawVehicleId) ? rawVehicleId : null;

    const baseQuery = { status: "completed" };

    const query = vehicleId                     // handle just this vehicle, or all completed
      ? { ...baseQuery, vehicleId }
      : baseQuery;

    const workOrders = await WorkOrder.find(query).lean();

    return NextResponse.json(
      workOrders.map((wo) => ({
        ...wo,
        _id: wo._id.toString(),
        vehicleId: wo.vehicleId?.toString() ?? null,
        createdAt: wo.createdAt?.toISOString() ?? null,
        updatedAt: wo.updatedAt?.toISOString() ?? null,
      }))
    );
  } catch (err) {
    console.error("Failed to fetch completed work orders:", err);
    return NextResponse.json(
      { error: "Failed to fetch completed work orders" },
      { status: 500 }
    );
  }
}
