import Link from "next/link";

export default function VehicleList() {
  const vehicles = [
    { vehicleId: "subaru-forester", name: "2014 Subaru Forester" },
    { vehicleId: "toyota-tacoma", name: "2018 Toyota Tacoma" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {vehicles.map((v) => (
        <Link
          key={v.vehicleId}
          href={`/vehicles/${v.vehicleId}`}
          className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
        >

          <div className="font-medium">{v.name}, id: {v.vehicleId}</div>
        </Link>
      ))}
    </div>
  );
}
