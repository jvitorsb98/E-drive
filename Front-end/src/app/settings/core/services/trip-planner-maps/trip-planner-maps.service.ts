import { FingChargingService } from './findCharging/fing-charging.service';
import { Injectable } from '@angular/core';
import { Step } from '../../models/step';
import { BatteryService } from './baterry/battery.service';

@Injectable({
  providedIn: 'root'
})
export class TripPlannerMapsService {

  constructor(
    private batteryService: BatteryService,
    private findCharging: FingChargingService
  ) { }

  // Função principal para calcular as estações de carregamento
  async calculateChargingStations(
    selectedVehicle: any,
    remainingBattery: number,
    batteryHealth: number,
    stepsArray: Step[],
  ): Promise<{ 
    chargingStationsMap: Map<any, number>, 
    canCompleteTrip: boolean, 
    canCompleteWithoutStops: boolean, 
    batteryPercentageAfterTrip: number 
  }> {
    const chargingStationsMap = new Map<any, number>();
    const visitedStations = new Set<string>(); 
    console.log(selectedVehicle.propulsion); // Verifica o tipo de propulsion

    // Obtém os dados da bateria e consumo
    batteryHealth = this.batteryService.getBatteryHealth(selectedVehicle, batteryHealth);
    const consumptionEnergetic = this.batteryService.getConsumptionEnergetic(selectedVehicle);
    const batteryCapacity = this.batteryService.getBatteryCapacity(selectedVehicle, batteryHealth);
    const calculatedAutonomyReal = this.batteryService.calculateRealAutonomy(batteryCapacity, consumptionEnergetic);

    let currentBatteryPercentage = remainingBattery;
    let batteryPercentageAfterTrip = currentBatteryPercentage;
    let canCompleteWithoutStops = true;

    // Calcula a distância restante no percurso
    let distanciaRestante: number = stepsArray.reduce((total, step) => total + step.distance, 0);
    console.log("Distância restante: " + distanciaRestante);
    console.log("Autonomia real calculada: " + calculatedAutonomyReal);

    // Cálculo do consumo total de bateria para a viagem
    const totalBatteryConsumption = this.batteryService.calculateBatteryConsumption(distanciaRestante, calculatedAutonomyReal);

    // Verifica se a bateria é suficiente para completar a viagem sem parar
    if ((currentBatteryPercentage - totalBatteryConsumption) > 15) {
      console.log("A viagem pode ser completada sem paradas.");
      return { 
        chargingStationsMap: new Map(), 
        canCompleteTrip: true, 
        canCompleteWithoutStops: true, 
        batteryPercentageAfterTrip: currentBatteryPercentage - totalBatteryConsumption 
      };
    }

    // Busca todas as estações de carregamento entre o início e o fim do trajeto
    const allChargingStations = await this.findCharging.findAllChargingStationsBetween(stepsArray);
    console.log(allChargingStations)
    console.log('Estações de carregamento encontradas entre o ponto de partida e o destino:', allChargingStations);

    if (allChargingStations.length > 0) {
      const firstChargingStationStep = allChargingStations[0].step;
      let firstChargingStationIndex = stepsArray.indexOf(firstChargingStationStep);

      // Calcula o consumo de bateria para os passos até a primeira estação de carregamento
      for (let j = 0; j < firstChargingStationIndex; j++) {
        const currentStep = stepsArray[j];
        const currentStepDistance = currentStep.distance;
        distanciaRestante -= currentStepDistance;
        console.log("Distância restante até a primeira estação: " + distanciaRestante);

        const batteryConsumptionPercentage = this.batteryService.calculateBatteryConsumption(currentStepDistance, calculatedAutonomyReal);
        currentBatteryPercentage = Math.max(currentBatteryPercentage - batteryConsumptionPercentage, 0);
        batteryPercentageAfterTrip = currentBatteryPercentage;

        // Verifica se a bateria acabou antes de alcançar a primeira estação
        if (currentBatteryPercentage <= 0) {
          return { 
            chargingStationsMap: new Map(), 
            canCompleteTrip: false, 
            canCompleteWithoutStops: false, 
            batteryPercentageAfterTrip 
          };
        }
      }
    }

    // Itera sobre as estações de carregamento encontradas no trajeto
    for (let i = 0; i < allChargingStations.length; i++) {
      console.log("Distância restante: " + distanciaRestante);
      const { station, step } = allChargingStations[i];
      const stepDistance = step.distance;
      console.log(`Distância do passo: ${stepDistance} km`);

      // Função para verificar se é possível alcançar o destino sem mais paradas
      const canReachDestination = (): boolean =>
        currentBatteryPercentage - this.batteryService.calculateBatteryConsumption(distanciaRestante, calculatedAutonomyReal) > 15;

      if (canReachDestination()) {
        batteryPercentageAfterTrip = currentBatteryPercentage - this.batteryService.calculateBatteryConsumption(distanciaRestante, calculatedAutonomyReal);
        console.log('Pode completar a viagem sem mais paradas.');
        break;
      }

      // Calcula o consumo de bateria para o passo
      const batteryConsumptionPercentage = this.batteryService.calculateBatteryConsumption(stepDistance, calculatedAutonomyReal);
      currentBatteryPercentage = Math.max(currentBatteryPercentage - batteryConsumptionPercentage, 0);
      batteryPercentageAfterTrip = currentBatteryPercentage;

      // Verifica se a bateria acabou antes de alcançar a estação
      if (currentBatteryPercentage <= 0) {
        return { 
          chargingStationsMap: new Map(), 
          canCompleteTrip: false, 
          canCompleteWithoutStops: false, 
          batteryPercentageAfterTrip 
        };
      }

      // Verifica se há uma próxima estação
      const nextStation = i < allChargingStations.length - 1 ? allChargingStations[i + 1] : null;

      // Calcula a distância até a estação de carregamento
      const distanceToChargingStation = google.maps.geometry.spherical.computeDistanceBetween(
        step.path[0],
        station.geometry.location
      ) / 1000;

      console.log(`Distância até a estação de carregamento: ${distanceToChargingStation} km`);

      // Verifica se a estação de carregamento é acessível
      if (distanceToChargingStation <= (currentBatteryPercentage / 100) * calculatedAutonomyReal && !visitedStations.has(station.place_id)) {
        // Antes de adicionar a estação, verifica se podemos alcançar a próxima estação
        if (nextStation) {
          const distanceToNextStation = google.maps.geometry.spherical.computeDistanceBetween(
            step.path[0],
            nextStation.station.geometry.location
          ) / 1000;
          distanciaRestante -= distanceToNextStation;

          // Calcula o consumo para chegar à próxima estação
          const batteryConsumptionForNextStation = this.batteryService.calculateBatteryConsumption(distanceToNextStation, calculatedAutonomyReal);

          // Verifica se ainda temos bateria suficiente para alcançar a próxima estação com a margem de segurança de 15%
          const batteryAfterReachingNextStation = currentBatteryPercentage - batteryConsumptionForNextStation;
          const safetyMargin = 15;  // Margem de segurança de 15%

          if (batteryAfterReachingNextStation > safetyMargin) {
            currentBatteryPercentage = batteryAfterReachingNextStation;
            console.log(`Podemos alcançar a próxima estação, não parando em ${station.name}, estou com ${currentBatteryPercentage}% de bateria`);
            continue; // Pula para a próxima estação sem parar
          } else {
            console.log(`Não podemos alcançar a próxima estação com a margem de segurança de 15%. Parando em ${station.name}`);
          }
        }

        // Adiciona a estação se for necessário
        chargingStationsMap.set(station, currentBatteryPercentage); // Adiciona a estação e o nível de bateria ao Map
        visitedStations.add(station.place_id); // Marca a estação como visitada
        console.log("Parando com " + currentBatteryPercentage + "% de bateria");
        console.log(`Posto de carregamento encontrado: ${station.name}`);
        currentBatteryPercentage = 100; // Simula a recarga total
        canCompleteWithoutStops = false;
      } else {
        console.log(`Não é possível alcançar a estação de carregamento a partir deste passo.`);
      }
    }
    return { 
      chargingStationsMap, 
      canCompleteTrip: true, 
      canCompleteWithoutStops, 
      batteryPercentageAfterTrip 
    };
  }
}
