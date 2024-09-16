export interface Autonomy{
  id: number
  mileagePerLiterRoad: number;
  mileagePerLiterCity: number;
  consumptionEnergetic: number;
  autonomyElectricMode: number;
}

export interface IAutonomyRequest{
  mileagePerLiterRoad: number;
  mileagePerLiterCity: number;
  consumptionEnergetic: number;
  autonomyElectricMode: number;
}
