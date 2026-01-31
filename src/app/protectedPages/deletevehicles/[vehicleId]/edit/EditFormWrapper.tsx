import VehicleForm from "@/components/Forms/Vehicle/VehicleForm";
import { IVehicle } from "@/types/IVehicle";

export default function EditFormWrapper({ vehicle }: {vehicle:IVehicle}) {
  return <VehicleForm vehicle={vehicle} />;
}
