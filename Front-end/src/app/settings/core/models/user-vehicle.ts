export interface UserVehicle {
  id: number;
  userId: number;
  vehicleId: number;
  mileagePerLiterRoad: number;
  mileagePerLiterCity: number;
  consumptionEnergetic: number;
  autonomyElectricMode: number;
  batteryCapacity: number;
  activated: boolean;
}