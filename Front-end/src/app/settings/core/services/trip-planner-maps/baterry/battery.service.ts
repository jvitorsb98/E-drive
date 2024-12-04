import { Injectable } from '@angular/core';
import { Step } from '../../../models/step';

@Injectable({
  providedIn: 'root'
})
export class BatteryService {
  
  calculateBatteryStatus(
    selectedVehicle: any,
    remainingBattery: number,
    batteryHealth: number,
    stepsArray: any[]
  ): { canCompleteTrip: boolean, batteryPercentageAfterTrip: number } {
    let batteryPercentageAfterTrip = remainingBattery;

    batteryHealth = this.getBatteryHealth(selectedVehicle, batteryHealth);
    const consumptionEnergetic = this.getConsumptionEnergetic(selectedVehicle);
    const batteryCapacity = this.getBatteryCapacity(selectedVehicle, batteryHealth);
    const calculatedAutonomyReal = this.calculateRealAutonomy(batteryCapacity, consumptionEnergetic);

    for (const step of stepsArray) {
      const distance = step.distance; // km

      const batteryConsumptionPercentage = this.calculateBatteryConsumption(distance, calculatedAutonomyReal);
      batteryPercentageAfterTrip = Math.max(batteryPercentageAfterTrip - batteryConsumptionPercentage, 0);

      if (batteryPercentageAfterTrip <= 0) {
        return { canCompleteTrip: false, batteryPercentageAfterTrip: 0 };
      }
    }

    return {
      canCompleteTrip: batteryPercentageAfterTrip > 0,
      batteryPercentageAfterTrip: Math.max(batteryPercentageAfterTrip, 0)
    };
  }
  // Submétodos para modularizar a lógica de cálculo da bateria

  getBatteryHealth(selectedVehicle: any, batteryHealth: number): number {
    if (!batteryHealth) {
      const currentYear = new Date().getFullYear();
      const vehicleYear = selectedVehicle.year;
      const yearsOfUse = currentYear - vehicleYear;
      return Math.max(100 - (yearsOfUse * 2.3), 0); // Garante que a saúde da bateria não fique negativa
    }
    return batteryHealth;
  }

  getConsumptionEnergetic(selectedVehicle: any): number {
    return Number(selectedVehicle.userVehicle.consumptionEnergetic); // MJ/km
  }

  getBatteryCapacity(selectedVehicle: any, batteryHealth: number): number {
    if (selectedVehicle.userVehicle.batteryCapacity !== null) {
      return selectedVehicle.userVehicle.batteryCapacity;
    } else {
      return (this.getConsumptionEnergetic(selectedVehicle) * selectedVehicle.userVehicle.autonomyElectricMode * (batteryHealth / 100)) / 3.6; // kWh
    }
  }

  calculateRealAutonomy(batteryCapacity: number, consumptionEnergetic: number): number {
    return 3.6 * (batteryCapacity / consumptionEnergetic); // Autonomia em km
  }

  calculateBatteryConsumption(distance: number, calculatedAutonomyReal: number): number {
    const consumption = (distance / calculatedAutonomyReal) * 100;
    return consumption > 0 ? consumption : 0;  // Retorna 0 se o consumo for negativo ou zero
  }

}