import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WorkOrder from "@/models/WorkOrder";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const vehicleId = searchParams.get("vehicleId");

    const baseQuery = { status: "completed" };

    const query = vehicleId                     // handle just this vehicle, or all completed
      ? { ...baseQuery, vehicleId }
      : baseQuery;

    const workOrders = await WorkOrder.find(query).lean();

    return NextResponse.json(
      workOrders.map((wo) => ({
        ...wo,
        _id: wo._id.toString(),
        vehicleId: wo.vehicleId?.toString?.() ?? "",
        createdAt: wo.createdAt?.toISOString?.() ?? null,
        updatedAt: wo.updatedAt?.toISOString?.() ?? null,
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
