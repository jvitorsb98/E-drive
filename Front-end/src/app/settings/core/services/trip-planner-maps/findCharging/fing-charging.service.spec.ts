import { TestBed } from '@angular/core/testing';
import { FingChargingService } from './fing-charging.service';
import { Step } from '../../../models/step';

// Mock de funções e objetos
const mockLatLng = (lat: number, lng: number) => ({
  lat: () => lat,
  lng: () => lng,
  equals: (other: any) => other.lat() === lat && other.lng() === lng,
  toJSON: () => ({ lat, lng }),
  toUrlValue: () => `${lat},${lng}`
});

// Mock da API Google Maps
const mockGoogleMaps = {
  maps: {
    geometry: {
      spherical: {
        computeDistanceBetween: jest.fn().mockImplementation((latLng1: any, latLng2: any) => {
          const lat1 = latLng1.lat();
          const lng1 = latLng1.lng();
          const lat2 = latLng2.lat();
          const lng2 = latLng2.lng();
          const R = 6371; // Raio da Terra em km
          const dLat = (lat2 - lat1) * (Math.PI / 180);  // converter de graus para radianos
          const dLng = (lng2 - lng1) * (Math.PI / 180);
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                    Math.sin(dLng / 2) * Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c; // Retorna a distância em km
        })
      }
    },
    places: {
      PlacesServiceStatus: {
        OK: 'OK' // Mockando o status OK
      },
      PlacesService: jest.fn()
    }
  }
};

describe('FingChargingService', () => {
  let service: FingChargingService;

  beforeEach(() => {
    // Fornecendo o mock da API Google Maps
    global['google'] = mockGoogleMaps as any;

    TestBed.configureTestingModule({});
    service = TestBed.inject(FingChargingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('findNearestChargingStation', () => {
    it('should return the nearest charging station within the travel range', async () => {
      const step: Step = {
        distance: 50,
        duration: '50 minutes',
        instructions: 'Go straight',
        travelMode: 'DRIVING',
        path: [mockLatLng(10, 20)], // Localização do ponto de partida
        maneuver: 'Left turn',
        roadType: 'city'
      };
      const maxDistanceCanTravel = 10; // km
      const calculatedAutonomyReal = 200; // autonomia real em km
      const currentBatteryPercentage = 50; // 50% de bateria

      const mockStation1 = {
        place_id: 'station1',
        geometry: { location: mockLatLng(10, 25) } // Estação a 5 km de distância
      };
      const mockStation2 = {
        place_id: 'station2',
        geometry: { location: mockLatLng(10, 30) } // Estação a 10 km de distância
      };

      // Mock da resposta para a função findChargingStationWithinDistance
      service.findChargingStationWithinDistance = jest.fn().mockResolvedValue(mockStation1);

      // Testando a função findNearestChargingStation
      const station = await service.findNearestChargingStation([step], currentBatteryPercentage, calculatedAutonomyReal);

      expect(station).toEqual(mockStation1); // Verifica se a estação de carregamento retornada é a correta
    });

    it('should return null if no charging station is found within the travel range', async () => {
      const step: Step = {
        distance: 50,
        duration: '50 minutes',
        instructions: 'Go straight',
        travelMode: 'DRIVING',
        path: [mockLatLng(10, 20)],
        maneuver: 'Left turn',
        roadType: 'city'
      };
      const maxDistanceCanTravel = 10; // km
      const calculatedAutonomyReal = 200;
      const currentBatteryPercentage = 50;

      // Mock de resposta simulando a ausência de estações de carregamento
      service.findChargingStationWithinDistance = jest.fn().mockResolvedValue(null);

      const station = await service.findNearestChargingStation([step], currentBatteryPercentage, calculatedAutonomyReal);

      expect(station).toBeNull(); // Verifica se o retorno é null
    });
  });

  describe('findChargingStationWithinDistance', () => {
    it('should return a charging station within the specified distance', async () => {
      const step: Step = {
        distance: 50,
        duration: '50 minutes',
        instructions: 'Go straight',
        travelMode: 'DRIVING',
        path: [mockLatLng(10, 20)],
        maneuver: 'Left turn',
        roadType: 'city'
      };
      const maxDistanceCanTravel = 10;

      const mockStation = {
        place_id: 'station1',
        geometry: { location: mockLatLng(10, 25) }
      };

      const mockPlaceService = {
        textSearch: jest.fn().mockImplementation((_, callback) => {
          callback([mockStation], mockGoogleMaps.maps.places.PlacesServiceStatus.OK);
        })
      };

      global['google'].maps.places.PlacesService = jest.fn().mockImplementation(() => mockPlaceService);

      const station = await service.findChargingStationWithinDistance([step], maxDistanceCanTravel);

      expect(station).toEqual(mockStation); // Verifica se a estação mockada é retornada
    });

    it('should return null when no station is found within the specified distance', async () => {
      const step: Step = {
        distance: 50,
        duration: '50 minutes',
        instructions: 'Go straight',
        travelMode: 'DRIVING',
        path: [mockLatLng(10, 20)],
        maneuver: 'Left turn',
        roadType: 'city'
      };
      const maxDistanceCanTravel = 10;

      const mockPlaceService = {
        textSearch: jest.fn().mockImplementation((_, callback) => {
          callback([], mockGoogleMaps.maps.places.PlacesServiceStatus.OK);
        })
      };

      global['google'].maps.places.PlacesService = jest.fn().mockImplementation(() => mockPlaceService);

      const station = await service.findChargingStationWithinDistance([step], maxDistanceCanTravel);

      expect(station).toBeNull(); // Verifica se a função retorna null
    });
  });

  describe('findNearestChargingStationFromList', () => {
    it('should return the nearest station within battery range', () => {
      const step: Step = {
        distance: 50,
        duration: '50 minutes',
        instructions: 'Go straight',
        travelMode: 'DRIVING',
        path: [mockLatLng(10, 20)],
        maneuver: 'Left turn',
        roadType: 'city',
      };
  
      const currentBatteryPercentage = 50; // 50% de bateria
      const calculatedAutonomyReal = 200; // autonomia real em km
      const allChargingStations = [
        {
          place_id: 'station1',
          geometry: { location: mockLatLng(10, 25) }, // 5 km de distância
        },
        {
          place_id: 'station2',
          geometry: { location: mockLatLng(10, 30) }, // 10 km de distância
        },
        {
          place_id: 'station3',
          geometry: { location: mockLatLng(10, 35) }, // 15 km de distância
        },
      ];
  
      // Testando a função
      const nearestStation = service.findNearestChargingStationFromList(
        allChargingStations,
        step,
        currentBatteryPercentage,
        calculatedAutonomyReal
      );
  
      expect(nearestStation).toEqual(allChargingStations[0]); // Verifica se a estação mais próxima é retornada
    });
  
    it('should return null if no station is within battery range', () => {
      const step: Step = {
        distance: 50,
        duration: '50 minutes',
        instructions: 'Go straight',
        travelMode: 'DRIVING',
        path: [mockLatLng(10, 20)],
        maneuver: 'Left turn',
        roadType: 'city',
      };
    
      const currentBatteryPercentage = 1; // Apenas 1% de bateria
      const calculatedAutonomyReal = 15; // autonomia real em km
      const allChargingStations = [
        {
          place_id: 'station1',
          geometry: { location: mockLatLng(10, 25) }, // 5 km de distância
        },
        {
          place_id: 'station2',
          geometry: { location: mockLatLng(10, 30) }, // 10 km de distância
        },
      ];
    
      const nearestStation = service.findNearestChargingStationFromList(
        allChargingStations,
        step,
        currentBatteryPercentage,
        calculatedAutonomyReal
      );
    
      expect(nearestStation).toBeNull(); // Verifica se retorna null
    });
    
  });
  

});
