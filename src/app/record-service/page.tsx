import RecordServiceForm from "@/components/RecordService/RecordServiceForm";


export default function RecordServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold mb-8">Record Service</h1>
        <RecordServiceForm />
      </div>
    </div>
  );
}
