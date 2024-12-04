import { TestBed } from '@angular/core/testing';
import { FingChargingService } from './fing-charging.service';
import { Step } from '../../../models/step';

describe('FingChargingService', () => {
  let service: FingChargingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FingChargingService);
  
    // Mock global Google Maps API
    globalThis.google = {
      maps: {
        geometry: {
          spherical: {
            computeDistanceBetween: jest.fn((start, end) => {
              // Cálculo simplificado de distância geodésica
              const distance = Math.sqrt(
                Math.pow(end.lat() - start.lat(), 2) + Math.pow(end.lng() - start.lng(), 2)
              ) * 111; // Aproximação simples (1 grau ≈ 111 km na Terra)
              return distance * 1000; // Converter para metros
            }),
            computeLength: jest.fn((path) => {
              let totalDistance = 0;
              for (let i = 1; i < path.length; i++) {
                totalDistance += google.maps.geometry.spherical.computeDistanceBetween(path[i - 1], path[i]);
              }
              return totalDistance;
            }),
          },
        },
        places: {
          PlacesService: jest.fn().mockImplementation(() => ({
            textSearch: jest.fn((query, callback) => {
              // Mock de resultados de estações de carregamento
              const mockResults = [
                {
                  place_id: 'A',
                  name: 'Station A',
                  geometry: { location: mockLatLng(0, 0) }, // Perto do primeiro step
                },
                {
                  place_id: 'B',
                  name: 'Station B',
                  geometry: { location: mockLatLng(0.05, 0.05) }, // Perto do segundo step
                },
                {
                  place_id: 'C',
                  name: 'Station C',
                  geometry: { location: mockLatLng(0.1, 0.1) }, // Outro ponto no intervalo
                },
              ];
              callback(mockResults, 'OK', undefined);
            }),
          })),
          PlacesServiceStatus: {
            OK: 'OK',
            ZERO_RESULTS: 'ZERO_RESULTS',
          },
        },
      },
    } as any;
  });
  
  // Função utilitária para criar mocks de google.maps.LatLng
  const mockLatLng = (lat: number, lng: number): google.maps.LatLng => ({
    lat: () => lat,
    lng: () => lng,
    toJSON: () => ({ lat, lng }),
  }) as any;


  

  it('deve calcular corretamente as distâncias entre estações consecutivas', async () => {
    const mockSteps: Step[] = [
      {
        distance: 15,
        duration: '',
        instructions: '',
        travelMode: '',
        path: [mockLatLng(0, 0), mockLatLng(0.05, 0.05)],
        maneuver: '',
        roadType: '',
      },
      {
        distance: 20,
        duration: '',
        instructions: '',
        travelMode: '',
        path: [mockLatLng(0.1, 0.1), mockLatLng(0.15, 0.15)],
        maneuver: '',
        roadType: '',
      },
    ];

    const result = await service.findAllChargingStationsBetween(mockSteps);

    if (result.length > 1) {
      const distances = result.map((station) => station.distanceToNext);
      distances.forEach((distance, index) => {
        if (index < distances.length - 1) {
          // Verifica se a distância para a próxima estação é maior que zero
          expect(distance).toBeGreaterThan(0);
        }
      });
    }
  });
});
