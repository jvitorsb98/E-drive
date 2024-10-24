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
  
  async calculateChargingStations(
    selectedVehicle: any,
    remainingBattery: number,
    batteryHealth: number,
    stepsArray: Step[],
  ): Promise<{ 
      chargingStations: any[], 
      canCompleteTrip: boolean, 
      canCompleteWithoutStops: boolean, 
      batteryPercentageAfterTrip: number 
  }> {
    const chargingStations: any[] = [];
    const visitedStations = new Set<string>(); // Para rastrear estações já visitadas
  
    batteryHealth = this.getBatteryHealth(selectedVehicle, batteryHealth);
    const consumptionEnergetic = this.getConsumptionEnergetic(selectedVehicle);
    const batteryCapacity = this.getBatteryCapacity(selectedVehicle, batteryHealth);
    const calculatedAutonomyReal = this.calculateRealAutonomy(batteryCapacity, consumptionEnergetic);
  
    let currentBatteryPercentage = remainingBattery;
    let batteryPercentageAfterTrip = currentBatteryPercentage;
    let canCompleteWithoutStops = true;
  
    // Busca todas as estações de carregamento entre o início e o fim do trajeto
    const allChargingStations = await this.findAllChargingStationsBetween(stepsArray);
    console.log('Estações de carregamento encontradas entre o ponto de partida e o destino:', allChargingStations);
  
    // Itera sobre cada passo do trajeto
    for (const step of stepsArray) {
      const stepDistance = step.distance; // Distância do passo
      console.log(`Distância do passo: ${stepDistance} km`);
  
      // Calcula o consumo de bateria para o passo
      const batteryConsumptionPercentage = this.calculateBatteryConsumption(stepDistance, calculatedAutonomyReal);
      currentBatteryPercentage = Math.max(currentBatteryPercentage - batteryConsumptionPercentage, 0);
      batteryPercentageAfterTrip = currentBatteryPercentage;
  
      // Verifica se a bateria é insuficiente para continuar
      if (currentBatteryPercentage <= 0) {
        return { 
          chargingStations: [], 
          canCompleteTrip: false, 
          canCompleteWithoutStops: false, 
          batteryPercentageAfterTrip 
        };
      }
  
      // Cálculo da distância restante nos passos seguintes
      const remainingDistance = this.calculateRemainingDistance(stepsArray, step);
      const requiredBatteryPercentage = (remainingDistance / calculatedAutonomyReal) * 100;
  
      // Verificação se a bateria é suficiente para completar a viagem sem paradas
      if (currentBatteryPercentage >= requiredBatteryPercentage) {
        console.log('Pode completar a viagem sem paradas.');
        continue; // Continua para o próximo passo
      }
  
      // Busca de postos de carregamento na lista carregada
      const chargingStation = this.findNearestChargingStationFromList(allChargingStations, step, currentBatteryPercentage, calculatedAutonomyReal);
      
      if (chargingStation && !visitedStations.has(chargingStation.place_id)) {
        // Verifica se a estação encontrada é acessível
        const distanceToChargingStation = google.maps.geometry.spherical.computeDistanceBetween(
          step.path[0],
          chargingStation.geometry.location
        ) / 1000;
  
        console.log(`Distância até a estação de carregamento: ${distanceToChargingStation} km`);
  
        if (distanceToChargingStation <= (currentBatteryPercentage / 100) * calculatedAutonomyReal) {
          chargingStations.push(chargingStation);
          visitedStations.add(chargingStation.place_id); // Marca a estação como visitada
          console.log(`Posto de carregamento encontrado: ${chargingStation.name}`);
          currentBatteryPercentage = 100; // Simula a recarga total
          canCompleteWithoutStops = false
        } else {
          console.log(`Não é possível alcançar a estação de carregamento a partir deste ponto.`);
        }
      } else {
        console.log('Nenhuma estação de carregamento encontrada neste passo.');
      }
    }
  
    return { 
      chargingStations, 
      canCompleteTrip: true, 
      canCompleteWithoutStops, 
      batteryPercentageAfterTrip 
    };
  }
  
  
  // Método para encontrar a estação de carregamento mais próxima na lista carregada
  findNearestChargingStationFromList(allChargingStations: any[], step: Step, currentBatteryPercentage: number, calculatedAutonomyReal: number): any | null {
      const maxDistanceCanTravel = (currentBatteryPercentage / 100) * calculatedAutonomyReal;
  
      let nearestStation: any | null = null;
      let nearestDistance = Number.MAX_VALUE;
  
      for (const station of allChargingStations) {
          const distanceToStation = google.maps.geometry.spherical.computeDistanceBetween(
              step.path[0],
              station.geometry.location
          ) / 1000; // Distância em km
  
          if (distanceToStation <= maxDistanceCanTravel && distanceToStation < nearestDistance) {
              nearestDistance = distanceToStation;
              nearestStation = station;
          }
      }
  
      return nearestStation;
  }

// **Método para calcular a distância restante a ser percorrida**
calculateRemainingDistance(stepsArray: Step[], currentStep: Step): number {
    const currentIndex = stepsArray.indexOf(currentStep);
    const remainingSteps = stepsArray.slice(currentIndex + 1); // Obtém os passos restantes
    const totalRemainingDistance = remainingSteps.reduce((total, step) => total + step.distance, 0); // Soma as distâncias restantes
    return totalRemainingDistance; // Retorna a distância total restante
}

// Método para buscar todas as estações de carregamento entre o ponto de partida e o ponto de chegada
async findAllChargingStationsBetween(stepsArray: Step[]): Promise<any[]> {
    const allChargingStations: any[] = [];
    console.log(stepsArray);
    for (const step of stepsArray) {
        // Passa um array contendo o step atual
        const chargingStation = await this.findChargingStationWithinDistance([step], 5); // Busca com raio máximo de 5 km
        if (chargingStation && !allChargingStations.some(station => station.place_id === chargingStation.place_id)) {
            allChargingStations.push(chargingStation); // Adiciona apenas se não estiver duplicado
        }
    }

    return allChargingStations;
}

// Método para buscar estações de carregamento dentro de uma determinada distância
findChargingStationWithinDistance(step: Step[], maxDistance: number): Promise<any | null> {
    return new Promise((resolve, reject) => {
        const placeService = new google.maps.places.PlacesService(document.createElement('div'));

        const location = step[0].path[0];
        const radius = maxDistance * 1000; // Converte para metros
        const query = 'estação de carregamento elétrico';

        placeService.textSearch({
            query: query,
            location: location,
            radius: radius
        }, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                // Filtrar resultados para incluir apenas aqueles que estão dentro da autonomia do veículo
                const filteredResults = results.filter(station => {
                    const distanceToStation = google.maps.geometry.spherical.computeDistanceBetween(
                        location,
                        station!.geometry!.location!
                    ) / 1000; // Distância em km
                    return distanceToStation <= maxDistance; // Dentro do raio máximo
                });

                const nearestStation = filteredResults[0] || null; // Pega a primeira estação de carregamento filtrada encontrada
                resolve(nearestStation);
            } else {
                console.error('Erro ao buscar estações de carregamento:', status);
                resolve(null); // Nenhuma estação encontrada
            }
        });
    });
}

// Método para encontrar a estação de carregamento mais próxima ao longo do trajeto
async findNearestChargingStation(step: Step[], currentBatteryPercentage: number, calculatedAutonomyReal: number): Promise<any | null> {
    const maxDistanceCanTravel = (currentBatteryPercentage / 100) * calculatedAutonomyReal;
    const chargingStation = await this.findChargingStationWithinDistance(step, maxDistanceCanTravel);
    return chargingStation;
}



}
