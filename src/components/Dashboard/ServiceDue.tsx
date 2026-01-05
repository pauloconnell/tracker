export default function ServiceDue() {
  const workOrders = [
    { id: 1, title: "Oil Change", vehicle: "2014 Subaru Forester", due: "2026-01-10" },
    { id: 2, title: "Brake Inspection", vehicle: "2018 Toyota Tacoma", due: "2026-01-15" },
  ];

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      {workOrders.length === 0 && (
        <p className="text-gray-500">No service due.</p>
      )}

      <ul className="space-y-3">
        {workOrders.map((wo) => (
          <li
            key={wo.id}
            className="p-3 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="font-medium">{wo.title}</div>
            <div className="text-sm text-gray-600">{wo.vehicle}</div>
            <div className="text-sm text-gray-500">Due: {wo.due}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
