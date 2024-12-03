import { TestBed } from '@angular/core/testing';
import { BatteryService } from './battery.service';

describe('BatteryService', () => {
  let service: BatteryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatteryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateBatteryStatus', () => {
    it('should return canCompleteTrip true when battery is sufficient', () => {
      const selectedVehicle = {
        year: 2020,
        userVehicle: {
          consumptionEnergetic: 15, // MJ/km
          batteryCapacity: 50, // kWh
          autonomyElectricMode: 300, // km
        }
      };
      const remainingBattery = 80; // 80%
      const batteryHealth = 90; // 90%
      const stepsArray = [
        { distance: 50 }, // km
        { distance: 100 }, // km
        { distance: 80 }, // km
      ];

      const result = service.calculateBatteryStatus(
        selectedVehicle,
        remainingBattery,
        batteryHealth,
        stepsArray
      );

      expect(result.canCompleteTrip).toBe(true);
      expect(result.batteryPercentageAfterTrip).toBeGreaterThan(0);
    });

    it('should return canCompleteTrip false when battery is insufficient', () => {
      const selectedVehicle = {
        year: 2020,
        userVehicle: {
          consumptionEnergetic: 15, // MJ/km
          batteryCapacity: 50, // kWh
          autonomyElectricMode: 300, // km
        }
      };
      const remainingBattery = 20; // 20%
      const batteryHealth = 80; // 80%
      const stepsArray = [
        { distance: 50 }, // km
        { distance: 100 }, // km
        { distance: 200 }, // km
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

    it('should calculate correct battery percentage after trip', () => {
      const selectedVehicle = {
        year: 2020,
        userVehicle: {
          consumptionEnergetic: 10, // MJ/km
          batteryCapacity: 50, // kWh
          autonomyElectricMode: 200, // km
        }
      };
      const remainingBattery = 100; // 100%
      const batteryHealth = 100; // 100%
      const stepsArray = [
        { distance: 50 }, // km
        { distance: 50 }, // km
      ];

      const result = service.calculateBatteryStatus(
        selectedVehicle,
        remainingBattery,
        batteryHealth,
        stepsArray
      );

      expect(result.batteryPercentageAfterTrip).toBe(50); // A bateria deve reduzir para 50% após o percurso
    });
  });
});
