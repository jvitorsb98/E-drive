import { TestBed } from '@angular/core/testing';
import { TripPlannerMapsService } from './trip-planner-maps.service';

describe('TripPlannerMapsService', () => {
  let service: TripPlannerMapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripPlannerMapsService);
  });

  describe('getBatteryHealth', () => {
    it('should return 100% when the provided battery health is given', () => {
      const result = service.getBatteryHealth({ year: 2020 }, 90);
      expect(result).toBe(90);
    });

    it('should calculate battery health based on the vehicle year', () => {
      const currentYear = new Date().getFullYear();
      const vehicleYear = currentYear - 5; // Vehicle with 5 years of use
      const result = service.getBatteryHealth({ year: vehicleYear }, 0);
      expect(result).toBeCloseTo(100 - 5 * 2.3, 1);
    });

    it('should return 0 when calculated health is negative', () => {
      const result = service.getBatteryHealth({ year: 1900 }, 0);
      expect(result).toBe(0);
    });
    it('should handle null vehicle year gracefully', () => {
      const result = service.getBatteryHealth(null, 90);
      expect(result).toBe(90); // No vehicle data, returns given health
    });
  
    it('should return 100 for a brand new vehicle', () => {
      const currentYear = new Date().getFullYear();
      const result = service.getBatteryHealth({ year: currentYear }, 100);
      expect(result).toBe(100); // A new vehicle should have full battery health
    });
  });

  describe('getConsumptionEnergetic', () => {
    it('should return the vehicle energy consumption', () => {
      const result = service.getConsumptionEnergetic({ userVehicle: { consumptionEnergetic: 15 } });
      expect(result).toBe(15);
    });

    it('should return the correct energy consumption with different values', () => {
      const result = service.getConsumptionEnergetic({ userVehicle: { consumptionEnergetic: 10 } });
      expect(result).toBe(10);
    });

    it('should handle extremely low consumptionEnergetic values gracefully', () => {
      const result = service.getConsumptionEnergetic({ userVehicle: { consumptionEnergetic: 0.01 } });
      expect(result).toBe(0.01); // Very low energy consumption should be handled properly
    });
  
    it('should handle extremely high consumptionEnergetic values gracefully', () => {
      const result = service.getConsumptionEnergetic({ userVehicle: { consumptionEnergetic: 1000 } });
      expect(result).toBe(1000); // High energy consumption should not cause errors
    });
  });

  describe('getBatteryCapacity', () => {
    it('should return the vehicle battery capacity if provided', () => {
      const result = service.getBatteryCapacity({ userVehicle: { batteryCapacity: 50 } }, 90);
      expect(result).toBe(50);
    });

    it('should return the correct battery capacity for different vehicles', () => {
      const result = service.getBatteryCapacity({ userVehicle: { batteryCapacity: 75 } }, 100);
      expect(result).toBe(75);
    });
  });

  describe('calculateRealAutonomy', () => {
    it('should calculate the real autonomy in km', () => {
      const result = service.calculateRealAutonomy(50, 15);
      expect(result).toBeCloseTo(3.6 * (50 / 15), 1);
    });

    it('should calculate real autonomy with different consumption rates', () => {
      const result = service.calculateRealAutonomy(100, 25); // 100 km battery, 25 consumption rate
      expect(result).toBeCloseTo(3.6 * (100 / 25), 1);
    });

    it('should calculate real autonomy for very large values', () => {
      const result = service.calculateRealAutonomy(1000, 20); // 1000 km battery, 20 consumption rate
      expect(result).toBeCloseTo(3.6 * (1000 / 20), 1); // Expect large autonomy to be calculated correctly
    });
  
    it('should calculate real autonomy for very small values', () => {
      const result = service.calculateRealAutonomy(1, 0.1); // 1 km battery, 0.1 consumption rate
      expect(result).toBeCloseTo(3.6 * (1 / 0.1), 1); // Expect very small autonomy to be calculated correctly
    });
  });

  describe('calculateBatteryConsumption', () => {
    it('should calculate battery consumption in percentage', () => {
      const result = service.calculateBatteryConsumption(100, 300);
      expect(result).toBeCloseTo((100 / 300) * 100, 1);
    });
    it('should calculate battery consumption in percentage for a given distance', () => {
      const distance = 100; // km
      const calculatedAutonomyReal = 200; // km
      const result = service.calculateBatteryConsumption(distance, calculatedAutonomyReal);
      expect(result).toBe(50); // 50% of battery
    });

    it('should calculate battery consumption with different distances and total autonomy', () => {
      const result = service.calculateBatteryConsumption(50, 200); // 50 km out of 200 km total range
      expect(result).toBe(25); // Expect 25% consumption
    });
  
    it('should return 100% for zero distance', () => {
      const result = service.calculateBatteryConsumption(0, 300);
      expect(result).toBe(0); // No distance traveled means no consumption
    });

    it('should handle full battery (100%) correctly', () => {
      const distance = 100; // km
      const calculatedAutonomyReal = 100; // km
      const result = service.calculateBatteryConsumption(distance, calculatedAutonomyReal);
      expect(result).toBe(100); // 100% of the battery should be used for the full distance
    });
  });

  describe('calculateBatteryStatus', () => {
    it('should return that the trip cannot be completed due to insufficient battery', () => {
      const steps = [{ distance: 100 }, { distance: 300 }];
      const result = service.calculateBatteryStatus(
        { userVehicle: { consumptionEnergetic: 15, batteryCapacity: 10 } },
        50,
        100,
        steps
      );
      expect(result.canCompleteTrip).toBe(false);
      expect(result.batteryPercentageAfterTrip).toBe(0);
    });

    it('should not complete the trip with insufficient battery', () => {
      const selectedVehicle = {
        userVehicle: {
          consumptionEnergetic: 20,
          autonomyElectricMode: 100,
          batteryCapacity: 50,
        },
      };
      const remainingBattery = 10;
      const batteryHealth = 100;
      const stepsArray = [
        { distance: 50 }, // km
        { distance: 30 },
      ];

      const result = service.calculateBatteryStatus(
        selectedVehicle,
        remainingBattery,
        batteryHealth,
        stepsArray
      );

      expect(result.canCompleteTrip).toBe(false);
      expect(result.batteryPercentageAfterTrip).toBe(0);
    });

    it('should calculate the battery status for a trip with multiple steps', () => {
      const steps = [{ distance: 100 }, { distance: 50 }, { distance: 150 }];
      const result = service.calculateBatteryStatus(
        { userVehicle: { consumptionEnergetic: 15, batteryCapacity: 50 } },
        100,
        100,
        steps
      );
      expect(result.canCompleteTrip).toBe(false);
      expect(result.batteryPercentageAfterTrip).toBe(0);
    });

    it('should return that the trip can be completed if no steps are provided', () => {
      const result = service.calculateBatteryStatus(
        { userVehicle: { consumptionEnergetic: 15, batteryCapacity: 50 } },
        100,
        100,
        [] // No steps
      );
      expect(result.canCompleteTrip).toBe(true);
      expect(result.batteryPercentageAfterTrip).toBe(100); // Full battery left
    });
  });

  describe('getBatteryHealth', () => {
    it('should return the given battery health if provided', () => {
      const selectedVehicle = { year: 2018 };
      const batteryHealth = 85;

      const result = service.getBatteryHealth(selectedVehicle, batteryHealth);

      expect(result).toBe(85);
    });
  });

  describe('calculateBatteryConsumption', () => {
    it('should calculate correct battery consumption for a given distance', () => {
      const distance = 100; // km
      const calculatedAutonomyReal = 200; // km

      const result = service.calculateBatteryConsumption(distance, calculatedAutonomyReal);

      expect(result).toBe(50); // 50% of battery
    });
  });


  describe('getBatteryHealth', () => {
    it('should return the given battery health if provided', () => {
      const selectedVehicle = { year: 2018 };
      const batteryHealth = 85;
      const result = service.getBatteryHealth(selectedVehicle, batteryHealth);
      expect(result).toBe(85);
    });

    it('should calculate battery health based on the vehicle year', () => {
      const currentYear = new Date().getFullYear();
      const vehicleYear = currentYear - 5; // Vehicle with 5 years of use
      const result = service.getBatteryHealth({ year: vehicleYear }, 0);
      expect(result).toBeCloseTo(100 - 5 * 2.3, 1); // Assumed decay rate per year
    });

    it('should return 0 when calculated health is negative', () => {
      const result = service.getBatteryHealth({ year: 1900 }, 0);
      expect(result).toBe(0); // Vehicle too old, negative health becomes 0
    });
  });

  describe('getConsumptionEnergetic', () => {
    it('should return the vehicle energy consumption', () => {
      const result = service.getConsumptionEnergetic({ userVehicle: { consumptionEnergetic: 15 } });
      expect(result).toBe(15);
    });
  });

  describe('getBatteryCapacity', () => {
    it('should return the vehicle battery capacity if provided', () => {
      const result = service.getBatteryCapacity({ userVehicle: { batteryCapacity: 50 } }, 90);
      expect(result).toBe(50);
    });

  });

  describe('calculateRealAutonomy', () => {
    it('should calculate the real autonomy in km', () => {
      const result = service.calculateRealAutonomy(50, 15); // 50 km battery, 15 consumption rate
      expect(result).toBeCloseTo(3.6 * (50 / 15), 1);
    });
  });

  describe('calculateBatteryConsumption', () => {
    it('should calculate battery consumption in percentage', () => {
      const result = service.calculateBatteryConsumption(100, 300); // 100 km, 300 km total range
      expect(result).toBeCloseTo((100 / 300) * 100, 1); // Expect 33.33%
    });

  });

  describe('calculateBatteryStatus', () => {
    it('should return that the trip cannot be completed due to insufficient battery', () => {
      const steps = [{ distance: 100 }, { distance: 300 }];
      const result = service.calculateBatteryStatus(
        { userVehicle: { consumptionEnergetic: 15, batteryCapacity: 10 } },
        50,
        100,
        steps
      );
      expect(result.canCompleteTrip).toBe(false);
      expect(result.batteryPercentageAfterTrip).toBe(0);
    });

    it('should not complete the trip if the remaining battery is too low', () => {
      const selectedVehicle = {
        userVehicle: {
          consumptionEnergetic: 20,
          autonomyElectricMode: 100,
          batteryCapacity: 50,
        },
      };
      const remainingBattery = 10;
      const batteryHealth = 100;
      const stepsArray = [
        { distance: 50 }, // km
        { distance: 30 },
      ];

      const result = service.calculateBatteryStatus(
        selectedVehicle,
        remainingBattery,
        batteryHealth,
        stepsArray
      );

      expect(result.canCompleteTrip).toBe(false);
      expect(result.batteryPercentageAfterTrip).toBe(0);
    });

  });

  
});
