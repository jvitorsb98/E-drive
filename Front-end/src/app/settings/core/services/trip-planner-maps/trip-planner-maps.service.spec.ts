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
      const result = service.calculateRealAutonomy(50, 15);
      expect(result).toBeCloseTo(3.6 * (50 / 15), 1);
    });
  });

  describe('calculateBatteryConsumption', () => {
    it('should calculate battery consumption in percentage', () => {
      const result = service.calculateBatteryConsumption(100, 300);
      expect(result).toBeCloseTo((100 / 300) * 100, 1);
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
});