import { User } from "../User";
import { UserVehicle } from "../UserVehicle";
import { Vehicle } from "../Vehicle";

// Dados mockados para o User
const mockUser1: User = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  cellPhone: '+55 (71) 98877-4499',
  birth: new Date('1990-01-01'),
  password: '9876542',
};

const mockUser2: User = {
  id: 2,
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  cellPhone: '+55 (71) 97799-3322',
  birth: new Date('2024-01-01'),
  password: '123456',
};

// Dados mockados para o Vehicle
const mockVehicle1: Vehicle = {
  id: 1,
  motor: 'Electric',
  version: '2024',
  model: { id: 1, name: 'Model S', brand: { id: 1, name: 'Tesla', activated: true }, activated: true },
  category: { id: 1, name: 'Sedan', activated: true },
  vehicleType: { id: 1, name: 'Electric', activated: true },
  propulsion: { id: 1, name: 'Electric', activated: true },
  autonomy: { id: 1, mileagePerLiterRoad: 15, mileagePerLiterCity: 12, consumptionEnergetic: 0.2, autonomyElectricMode: 400 },
  activated: true,
  year: 2024,
};

const mockVehicle2: Vehicle = {
  id: 2,
  motor: 'Hybrid',
  version: '2023',
  model: { id: 2, name: 'Corolla', brand: { id: 2, name: 'Toyota', activated: true }, activated: true },
  category: { id: 2, name: 'Hatchback', activated: true },
  vehicleType: { id: 2, name: 'Hybrid', activated: true },
  propulsion: { id: 2, name: 'Hybrid', activated: true },
  autonomy: { id: 2, mileagePerLiterRoad: 18, mileagePerLiterCity: 14, consumptionEnergetic: 0.3, autonomyElectricMode: 500 },
  activated: true,
  year: 2023,
};

// Dados mockados para UserVehicle
export const mockUserVehicles: UserVehicle[] = [
  {
    id: 1,
    user: mockUser1,
    vehicle: mockVehicle1,
    mileagePerLiterRoad: 15,
    mileagePerLiterCity: 12,
    consumptionEnergetic: 0.2,
    autonomyElectricMode: 400,
    activated: true,
  },
  {
    id: 2,
    user: mockUser2,
    vehicle: mockVehicle2,
    mileagePerLiterRoad: 18,
    mileagePerLiterCity: 14,
    consumptionEnergetic: 0.3,
    autonomyElectricMode: 500,
    activated: true,
  },
];
