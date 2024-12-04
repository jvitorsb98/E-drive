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

    // Dados da bateria e consumo
    batteryHealth = this.batteryService.getBatteryHealth(selectedVehicle, batteryHealth);
    const consumptionEnergetic = this.batteryService.getConsumptionEnergetic(selectedVehicle);
    const batteryCapacity = this.batteryService.getBatteryCapacity(selectedVehicle, batteryHealth);
    const calculatedAutonomyReal = this.batteryService.calculateRealAutonomy(batteryCapacity, consumptionEnergetic);

    let currentBatteryPercentage = remainingBattery;
    let batteryPercentageAfterTrip = currentBatteryPercentage;
    let canCompleteWithoutStops = true;

    // Distância total da viagem
    const totalDistance = stepsArray.reduce((total, step) => total + step.distance, 0);
    console.log("Distância total da viagem: " + totalDistance);

    // Consumo total necessário para a viagem
    const totalBatteryConsumption = this.batteryService.calculateBatteryConsumption(totalDistance, calculatedAutonomyReal);
    console.log("Consumo total de bateria para a viagem: " + totalBatteryConsumption);

    // Verifica se a viagem pode ser completada sem paradas
    if ((currentBatteryPercentage - totalBatteryConsumption) > 15 ) {
      console.log("A viagem pode ser completada sem paradas.");
      return { 
        chargingStationsMap: new Map(), 
        canCompleteTrip: true, 
        canCompleteWithoutStops: true, 
        batteryPercentageAfterTrip: currentBatteryPercentage - totalBatteryConsumption 
      };
    }

    // Busca todas as estações de carregamento no trajeto
    const allChargingStations = await this.findCharging.findAllChargingStationsBetween(stepsArray);
    console.log("Estações de carregamento encontradas:", allChargingStations);

    if (allChargingStations.length > 0) {
      let accumulatedDistance = 0; // Distância acumulada até a última estação de parada
      let batteryBeforeNextStation;
      let lastCharger;
      // Calcula as distâncias entre estações
      for (let i = 0; i < allChargingStations.length; i++) {
        let distanceToNext;

        const currentStation = allChargingStations[i];
        console.log(`Analisando estação: ${currentStation.station.name}`);

        if (chargingStationsMap.size === 0) {
          distanceToNext = currentStation.accumulatedDistance;
        } else {
          distanceToNext = currentStation.distanceToNext || 0;
        }

        batteryBeforeNextStation = currentBatteryPercentage;
        console.log(`Distância até a próxima estação: ${distanceToNext}`);

        // Consumo de bateria até a próxima estação
        const batteryConsumptionToNextStation = this.batteryService.calculateBatteryConsumption(distanceToNext, calculatedAutonomyReal);
        currentBatteryPercentage = Math.max(currentBatteryPercentage - batteryConsumptionToNextStation, 0);
        batteryPercentageAfterTrip = currentBatteryPercentage;

        console.log(`Consumo até ${currentStation.station.name}: ${batteryConsumptionToNextStation}%. Bateria restante: ${currentBatteryPercentage}%.`);

        if (currentBatteryPercentage <= 10) {
          console.log(`Bateria insuficiente para alcançar ${currentStation.station.name}.`);
          return { 
            chargingStationsMap: new Map(), 
            canCompleteTrip: false, 
            canCompleteWithoutStops: false, 
            batteryPercentageAfterTrip 
          };
        }

        accumulatedDistance += distanceToNext;
        console.log(totalDistance - accumulatedDistance)

        // Atualiza a distância acumulada até a última estação

        // Verifica a próxima estação, se houver
        const nextStation = i < allChargingStations.length - 1 ? allChargingStations[i + 1] : null;

        if (nextStation) {
          let batteryConsumptionToNextNextStation;
          if (chargingStationsMap.size === 0) {
            batteryConsumptionToNextNextStation = this.batteryService.calculateBatteryConsumption(nextStation.accumulatedDistance || 0, calculatedAutonomyReal);
          } else {
            batteryConsumptionToNextNextStation = this.batteryService.calculateBatteryConsumption(nextStation.distanceToNext || 0, calculatedAutonomyReal);
          }
          const batteryAfterNextStation = currentBatteryPercentage - batteryConsumptionToNextNextStation;

          console.log(`Consumo de bateria até a próxima estação após a próxima: ${batteryConsumptionToNextNextStation}. Bateria restante: ${batteryAfterNextStation}`);
          console.log("batteryAfterNextStation" + batteryAfterNextStation)
          // Decide parar somente se não puder alcançar a próxima estação com mais de 15% de bateria
          if (batteryAfterNextStation <= 10 && batteryConsumptionToNextNextStation < 100) {
            console.log(`Parando para recarregar em ${currentStation.station.name}, não é possível alcançar a próxima estação com segurança.`);
            chargingStationsMap.set(currentStation.station, currentBatteryPercentage);
            visitedStations.add(currentStation.station.place_id);
            currentBatteryPercentage = 100; // Simula recarga
            canCompleteWithoutStops = false;
            lastCharger = currentStation;

            const remainingDistance = totalDistance - lastCharger.accumulatedDistance; // Distância restante até o destino
            const finalBatteryConsumption = this.batteryService.calculateBatteryConsumption(remainingDistance, calculatedAutonomyReal);
            console.log(`Distância restante até o destino: ${remainingDistance}, consumo de bateria para o destino: ${finalBatteryConsumption}`);
            if ((100 - finalBatteryConsumption) > 15) {
              console.log("A viagem pode ser completada sem mais paradas.");
              return { 
                chargingStationsMap, 
                canCompleteTrip: true, 
                canCompleteWithoutStops, 
                batteryPercentageAfterTrip: 100 - finalBatteryConsumption 
              };
            }

          } else if(batteryAfterNextStation > 10 && batteryConsumptionToNextNextStation < 100){
            console.log(`É possível alcançar a próxima estação sem parar em ${currentStation.station.name}.`);
            console.log("distancia restante" + (totalDistance - currentStation.accumulatedDistance))
          }else{
            return { 
              chargingStationsMap, 
              canCompleteTrip: false, 
              canCompleteWithoutStops, 
              batteryPercentageAfterTrip 
            };
          }
        } else{
            // Só para na última estação se necessário
            console.log(`Parando na última estação: ${currentStation.station.name}`);
            chargingStationsMap.set(currentStation.station, currentBatteryPercentage);
            currentBatteryPercentage = 100; // Simula recarga
            lastCharger = currentStation;

            const remainingDistance = totalDistance - lastCharger.accumulatedDistance; // Distância restante até o destino
            const finalBatteryConsumption = this.batteryService.calculateBatteryConsumption(remainingDistance, calculatedAutonomyReal);
            console.log(`Distância restante até o destino: ${remainingDistance}, consumo de bateria para o destino: ${finalBatteryConsumption}`);
            if ((100 - finalBatteryConsumption) > 10) {
              console.log("A viagem pode ser completada sem mais paradas.");
              return { 
                chargingStationsMap, 
                canCompleteTrip: true, 
                canCompleteWithoutStops, 
                batteryPercentageAfterTrip: 100 - finalBatteryConsumption 
              };
            }

          }
        
      }
    }

    return { 
      chargingStationsMap, 
      canCompleteTrip: false, 
      canCompleteWithoutStops, 
      batteryPercentageAfterTrip 
    };
  }

}
