interface Props {
  params: { id: string };
}

export default function VehiclePage({ params }: Props) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">
        Vehicle: {params.id}
      </h1>

      <p className="text-gray-600">Vehicle details coming soon.</p>
    </div>
  );
}
