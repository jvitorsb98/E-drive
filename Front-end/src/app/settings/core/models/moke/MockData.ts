import { Autonomy } from "../Autonomy";
import { Brand } from "../Brand";
import { Category } from "../Category";
import { Model } from "../model";
import { Propulsion } from "../Propulsion";
import { Vehicle } from "../vehicle";
import { VehicleType } from "../vehicle-type";

export class MockData {
  static mockVehicles(): Vehicle[] {
    // Mock de Brand
    const brand1: Brand = { id: 1, name: 'Ford', activated: true };
    const brand2: Brand = { id: 2, name: 'Tesla', activated: true };
    const brand3: Brand = { id: 3, name: 'Mercedes', activated: true };

    // Mock de Model
    const model1: Model = { id: 1, name: 'Mustang', brand: brand1, activated: true };
    const model2: Model = { id: 2, name: 'Model S', brand: brand2, activated: true };
    const model3: Model = { id: 3, name: 'C300', brand: brand3, activated: true };

    // Mock de Category
    const category1: Category = { id: 1, name: 'Sport', activated: true };
    const category2: Category = { id: 2, name: 'Sedan', activated: true };
    const category3: Category = { id: 3, name: 'Luxury', activated: true };

    // Mock de Propulsion
    const propulsion1: Propulsion = { id: 1, name: 'Gasoline', activated: true };
    const propulsion2: Propulsion = { id: 2, name: 'Electric', activated: true };
    const propulsion3: Propulsion = { id: 3, name: 'Hybrid', activated: true };

    // Mock de VehicleType
    const vehicleType1: VehicleType = { id: 1, name: 'Coupe', activated: true };
    const vehicleType2: VehicleType = { id: 2, name: 'Sedan', activated: true };
    const vehicleType3: VehicleType = { id: 3, name: 'Hatchback', activated: true };

    // Mock de Autonomy
    const autonomy1: Autonomy = {
      id: 1, mileagePerLiterRoad: 12, mileagePerLiterCity: 8,
      consumptionEnergetic: 10, autonomyElectricMode: 0
    };
    const autonomy2: Autonomy = {
      id: 2, mileagePerLiterRoad: 0, mileagePerLiterCity: 0,
      consumptionEnergetic: 15, autonomyElectricMode: 600
    };
    const autonomy3: Autonomy = {
      id: 3, mileagePerLiterRoad: 14, mileagePerLiterCity: 10,
      consumptionEnergetic: 12, autonomyElectricMode: 0
    };

    // Mock de Vehicle
    const vehicles: Vehicle[] = [
      {
        id: 1, motor: 'V8', version: 'GT', model: model1, category: category1,
        vehicleType: vehicleType1, propulsion: propulsion1, autonomy: autonomy1,
        activated: true, year: 2021
      },
      {
        id: 2, motor: 'Electric', version: 'Model S', model: model2, category: category2,
        vehicleType: vehicleType2, propulsion: propulsion2, autonomy: autonomy2,
        activated: true, year: 2022
      },
      {
        id: 3, motor: 'V6', version: 'C300', model: model3, category: category3,
        vehicleType: vehicleType2, propulsion: propulsion1, autonomy: autonomy3,
        activated: true, year: 2020
      },
      {
        id: 4, motor: 'Hybrid', version: 'Prius', model: { id: 4, name: 'Prius', brand: { id: 4, name: 'Toyota', activated: true }, activated: true },
        category: { id: 4, name: 'Eco', activated: true }, vehicleType: vehicleType3,
        propulsion: propulsion3, autonomy: { id: 4, mileagePerLiterRoad: 20, mileagePerLiterCity: 15, consumptionEnergetic: 18, autonomyElectricMode: 50 },
        activated: true, year: 2019
      },
      {
        id: 5, motor: 'V12', version: 'Aventador', model: { id: 5, name: 'Aventador', brand: { id: 5, name: 'Lamborghini', activated: true }, activated: true },
        category: { id: 5, name: 'Supercar', activated: true }, vehicleType: vehicleType1,
        propulsion: propulsion1, autonomy: { id: 5, mileagePerLiterRoad: 8, mileagePerLiterCity: 5, consumptionEnergetic: 6, autonomyElectricMode: 0 },
        activated: true, year: 2023
      }
    ];

    return vehicles;
  }
}
