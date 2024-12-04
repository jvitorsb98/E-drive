import { Injectable } from '@angular/core';
import { Step } from '../../../models/step';

@Injectable({
  providedIn: 'root'
})
export class FingChargingService {

  constructor() { }






// Método para buscar todas as estações de carregamento entre o ponto de partida e o ponto de chegada
async findAllChargingStationsBetween(stepsArray: Step[]): Promise<any[]> {
  const allChargingStations: any[] = [];

  // Divide os steps grandes em substeps menores de no máximo 10 km
  function splitStepsIntoSubsteps(step: Step, maxDistance: number): Step[] {
    const substeps: Step[] = [];
    const path = step.path;
    let currentDistance = 0;
    let substepPath: google.maps.LatLng[] = [path[0]];

    for (let i = 1; i < path.length; i++) {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(path[i - 1], path[i]);

      if (currentDistance + distance > maxDistance * 1000) {
        substeps.push({ ...step, path: substepPath });
        substepPath = [path[i - 1]];
        currentDistance = 0;
      }

      substepPath.push(path[i]);
      currentDistance += distance;
    }

    if (substepPath.length > 1) {
      substeps.push({ ...step, path: substepPath });
    }

    return substeps;
  }

  // Quebra todos os steps em substeps
  const allSubsteps: Step[] = stepsArray.flatMap(step => splitStepsIntoSubsteps(step, 10));

  // Calcula distância acumulada corretamente para os substeps
  function calculateAccumulatedDistance(steps: Step[], currentIndex: number): number {
    let totalDistance = 0;
    for (let i = 0; i <= currentIndex; i++) {
      totalDistance += google.maps.geometry.spherical.computeLength(steps[i].path) / 1000;
    }
    return totalDistance;
  }

  // Busca estações em cada substep
  const chargingStationsPromises = allSubsteps.map(async (substep, index) => {
    const chargingStation = await this.findChargingStationWithinDistance([substep], 20);

    if (chargingStation) {
      const stationExists = allChargingStations.some(station => station.station.place_id === chargingStation.place_id);
      if (!stationExists) {
        const accumulatedDistance = calculateAccumulatedDistance(allSubsteps, index);

        allChargingStations.push({
          station: chargingStation,
          step: substep,
          accumulatedDistance,
        });
      }
    }
  });

  await Promise.all(chargingStationsPromises);

  // Ordenar as estações pela distância acumulada
// Ordena as estações pelo accumulatedDistance
  allChargingStations.sort((a, b) => a.accumulatedDistance - b.accumulatedDistance);

  // Calcula as distâncias entre as estações
  for (let i = 0; i < allChargingStations.length - 1; i++) {
    const currentStation = allChargingStations[i];
    const nextStation = allChargingStations[i + 1];
    
    // Distância até a próxima estação
    const distanceToNext = nextStation.accumulatedDistance - currentStation.accumulatedDistance;
    
    // Adiciona a distância calculada na estação atual
    currentStation.distanceToNext = distanceToNext;
  }

  // A última estação não tem próxima, define como 0 ou nulo
  if (allChargingStations.length > 0) {
    allChargingStations[allChargingStations.length - 1].distanceToNext = null;
  }
  console.log(allChargingStations);
  return allChargingStations;
}


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




}
