import ServiceDue from "@/components/Dashboard/ServiceDue";
import VehicleList from "@/components/Dashboard/VehicleList";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50"> 
      {/* Same background as homepage */}

      <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-16">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold tracking-tight">
            Dashboard
          </h1>

          <Link
            href="/record-service"
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Record Service
          </Link>
        </header>

        {/* Service Due */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">Service Due</h2>
          <ServiceDue />
        </section>

        {/* Vehicles */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">Vehicles</h2>
          <VehicleList />
        </section>
      </div>
    </div>
  );
}
