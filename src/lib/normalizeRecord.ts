export function normalizeRecord(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;

  return {
    ...obj,
    _id: obj._id?.toString?.() ?? "",
    vehicleId: obj.vehicleId?.toString?.() ?? obj.vehicleId ?? "",
    createdAt: obj.createdAt?.toISOString?.() ?? null,
    updatedAt: obj.updatedAt?.toISOString?.() ?? null,
  };
}
