import { Injectable } from '@angular/core';
import { Step } from '../../models/step';

@Injectable({
  providedIn: 'root'
})
export class TripPlannerMapsService {

  constructor() { }

  calculateBatteryStatus(
    selectedVehicle: any,
    remainingBattery: number,
    batteryHealth: number,
    stepsArray: any[]
  ): { canCompleteTrip: boolean, batteryPercentageAfterTrip: number } {
    let batteryPercentageAfterTrip = remainingBattery;

    // Se a saúde da bateria não estiver definida, calculamos com base na idade do veículo
    if (!batteryHealth) {
      const currentYear = new Date().getFullYear();
      const vehicleYear = selectedVehicle.year;
      const yearsOfUse = currentYear - vehicleYear;
      batteryHealth = Math.max(100 - (yearsOfUse * 2.3), 0); // Garante que a saúde da bateria não fique negativa
    }

    // Capacidade da bateria (em MJ), ajustada pela saúde da bateria
    const batteryCapacity = (Number(selectedVehicle.userVehicle.batteryCapacity) * 3.6) * (batteryHealth / 100); // kWh para MJ
    const consumptionEnergetic = Number(selectedVehicle.userVehicle.consumptionEnergetic); // MJ/km

    for (const step of stepsArray) {
      const distance = step.distance; // km

      // Cálculo da autonomia em km com base na capacidade da bateria e no consumo energético
      const calculatedAutonomy = batteryCapacity / consumptionEnergetic; // Autonomia em km

      // Cálculo da porcentagem de consumo da bateria
      const batteryConsumptionPercentage = (distance / calculatedAutonomy) * 100;
      batteryPercentageAfterTrip -= batteryConsumptionPercentage;

      if (batteryPercentageAfterTrip <= 0) {
        return {
          canCompleteTrip: false,
          batteryPercentageAfterTrip: 0
        };
      }
    }

    return {
      canCompleteTrip: batteryPercentageAfterTrip > 0,
      batteryPercentageAfterTrip: Math.max(batteryPercentageAfterTrip, 0) // Garante que não fique negativo
    };
  }

  calculateRouteDistance(startLocation: google.maps.LatLng, destination: google.maps.LatLng): Promise<{steps: Step[], totalDistance: string}> {
    return new Promise((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route({
        origin: startLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      }).then(response => {
        const route = response.routes[0];
        const legs = route.legs[0];

        const stepsArray: Step[] = [];

        legs.steps.forEach(step => {
          let roadType = 'cidade';
          const roadName = step.instructions.toLowerCase();

          if (roadName.includes("rodovia") || roadName.includes("br") || roadName.includes("ba") || roadName.includes("estrada") || roadName.includes("autoestrada") || roadName.includes("via expressa")) {
            roadType = 'estrada';
          }

          if (step.maneuver && (step.maneuver.includes('merge') || step.maneuver.includes('ramp') || step.maneuver.includes('highway') || step.maneuver.includes('exit'))) {
            roadType = 'estrada';
          }

          const distanceText = step.distance?.text;
          let distanceInKm = 0;

          if (distanceText) {
            if (distanceText.includes('km')) {
              distanceInKm = parseFloat(distanceText.replace('km', '').trim());
            } else if (distanceText.includes('m')) {
              distanceInKm = parseFloat(distanceText.replace('m', '').trim()) / 1000;
            }
          }

          const stepInfo: Step = {
            distance: distanceInKm,
            duration: step.duration!.text,
            instructions: step.instructions,
            travelMode: step.travel_mode,
            path: step.path,
            maneuver: step.maneuver || 'unknown',
            roadType: roadType
          };

          stepsArray.push(stepInfo);
        });

        const totalDistanceInKm = legs.distance!.value / 1000;
        const totalDistanceText = `Distância total: ${totalDistanceInKm.toFixed(2)} km`;

        resolve({ steps: stepsArray, totalDistance: totalDistanceText });
      }).catch(error => {
        console.error('Erro ao calcular a rota:', error);
        reject('Erro ao calcular a rota');
      });
    });
  }


}
