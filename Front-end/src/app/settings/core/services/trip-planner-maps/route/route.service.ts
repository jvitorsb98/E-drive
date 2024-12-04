import { Injectable } from '@angular/core';
import { Step } from '../../../models/step';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  
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