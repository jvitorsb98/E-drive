import { Autonomy } from './../../models/autonomy';
import { Injectable } from '@angular/core';
import { Step } from '../../models/step';

@Injectable({
  providedIn: 'root'
})
export class TripPlannerMapsService {

  constructor() { }

  // Método principal que chama os métodos separados
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
    return (distance / calculatedAutonomyReal) * 100; // Porcentagem de consumo de bateria
  }

  // Método modularizado para calcular a distância da rota

  calculateRouteDistance(startLocation: google.maps.LatLng, destination: google.maps.LatLng): Promise<{ steps: Step[], totalDistance: string }> {
    return new Promise((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route({
        origin: startLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      }).then(response => {
        const { stepsArray, totalDistanceInKm } = this.extractStepsFromRoute(response);
        const totalDistanceText = `Distância total: ${totalDistanceInKm.toFixed(2)} km`;

        resolve({ steps: stepsArray, totalDistance: totalDistanceText });
      }).catch(error => {
        console.error('Erro ao calcular a rota:', error);
        reject('Erro ao calcular a rota');
      });
    });
  }

  // Submétodo para extrair e modularizar as etapas da rota
  extractStepsFromRoute(response: any): { stepsArray: Step[], totalDistanceInKm: number } {
    const route = response.routes[0];
    const legs = route.legs[0];

    const stepsArray: Step[] = [];

    legs.steps.forEach((step: any) => {
      const stepInfo = this.createStepInfo(step);
      stepsArray.push(stepInfo);
    });

    const totalDistanceInKm = legs.distance.value / 1000;
    return { stepsArray, totalDistanceInKm };
  }

  // Submétodo para criar as informações de cada etapa da rota
  createStepInfo(step: any): Step {
    let roadType = 'cidade';
    const roadName = step.instructions.toLowerCase();

    if (this.isHighwayOrExpressway(roadName) || this.isHighwayManeuver(step.maneuver)) {
      roadType = 'estrada';
    }

    const distanceInKm = this.parseDistance(step.distance?.text);

    return {
      distance: distanceInKm,
      duration: step.duration!.text,
      instructions: step.instructions,
      travelMode: step.travel_mode,
      path: step.path,
      maneuver: step.maneuver || 'unknown',
      roadType: roadType
    };
  }

  // Submétodo auxiliar para verificar se é rodovia
  isHighwayOrExpressway(roadName: string): boolean {
    return roadName.includes("rodovia") || roadName.includes("br") || roadName.includes("ba")
      || roadName.includes("estrada") || roadName.includes("autoestrada") || roadName.includes("via expressa");
  }

  // Submétodo auxiliar para verificar manobra de rodovia
  isHighwayManeuver(maneuver: string): boolean {
    return (maneuver.includes('merge') || maneuver.includes('ramp') || maneuver.includes('highway') || maneuver.includes('exit'));
  }

  // Submétodo auxiliar para converter distância
  parseDistance(distanceText: string): number {
    if (distanceText.includes('km')) {
      return parseFloat(distanceText.replace('km', '').trim());
    } else if (distanceText.includes('m')) {
      return parseFloat(distanceText.replace('m', '').trim()) / 1000;
    }
    return 0;
  }
}
