import { Injectable } from '@angular/core';
import { Step } from '../../../models/step';

@Injectable({
  providedIn: 'root'
})
export class FingChargingService {

  constructor() { }



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



// Método para buscar todas as estações de carregamento entre o ponto de partida e o ponto de chegada
async findAllChargingStationsBetween(stepsArray: Step[]): Promise<any[]> {
  const allChargingStations: any[] = [];
  console.log(stepsArray);

  // Cria uma lista de promessas para buscar as estações de carregamento em paralelo
  const chargingStationsPromises = stepsArray.map(async (step) => {
    const chargingStation = await this.findChargingStationWithinDistance([step], 5);

    // Verifica se encontrou uma estação de carregamento e se não há duplicata
    if (chargingStation && !allChargingStations.some(station => station.place_id === chargingStation.place_id)) {
      // Retorna a estação de carregamento com o passo correspondente
      return { station: chargingStation, step };
    }

    // Retorna null caso não encontre uma estação ou já exista duplicata
    return null;
  });

  // Aguarda a resolução de todas as promessas
  const results = await Promise.all(chargingStationsPromises);

  // Filtra os resultados para remover os valores nulos
  return results.filter(result => result !== null);
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
