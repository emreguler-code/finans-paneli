import { Car, CarFront, Truck, Motorbike } from "lucide-react";
export function VehicleIcon({ vehicle, size = 24 }) {
  const Icon =
    vehicle.vehicle_kind === "motorcycle"
      ? Motorbike
      : vehicle.vehicle_kind === "van"
        ? Truck
        : vehicle.body_style === "suv"
          ? CarFront
          : Car;
  return <Icon size={size} aria-hidden="true" />;
}
