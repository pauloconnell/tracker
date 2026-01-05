import Link from "next/link";

export default function VehicleList() {
  const vehicles = [
    { id: "subaru-forester", name: "2014 Subaru Forester" },
    { id: "toyota-tacoma", name: "2018 Toyota Tacoma" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {vehicles.map((v) => (
        <Link
          key={v.id}
          href={`/vehicles/${v.id}`}
          className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
        >
          <div className="font-medium">{v.name}</div>
        </Link>
      ))}
    </div>
  );
}
