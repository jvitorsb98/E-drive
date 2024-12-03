import { TestBed } from '@angular/core/testing';
import { RouteService } from './route.service';
import { Step } from '../../../models/step';

describe('RouteService', () => {
  let service: RouteService;

  // Mock do Google Maps API
  const mockGoogleMaps = {
    DirectionsService: jest.fn().mockImplementation(() => ({
      route: jest.fn()
    })),
  };

  beforeEach(() => {
    // Fornecendo o mock do Google Maps
    global['google'] = mockGoogleMaps as any;

    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteService);
  });

  describe('calculateRouteDistance', () => {
    it('should calculate the route distance and steps', async () => {
      const startLocation = new google.maps.LatLng(10, 20);
      const destination = new google.maps.LatLng(30, 40);

      // Mock da resposta do Google Maps
      const mockResponse = {
        routes: [
          {
            legs: [
              {
                distance: { value: 100000 }, // 100 km em metros
                steps: [
                  {
                    distance: { text: '10 km' },
                    duration: { text: '10 minutes' },
                    instructions: 'Go straight',
                    travel_mode: 'DRIVING',
                    path: [],
                    maneuver: 'turn-left',
                  },
                  {
                    distance: { text: '20 km' },
                    duration: { text: '20 minutes' },
                    instructions: 'Turn left',
                    travel_mode: 'DRIVING',
                    path: [],
                    maneuver: 'merge',
                  },
                ],
              },
            ],
          },
        ],
      };

      // Simulando a chamada ao método route
      mockGoogleMaps.DirectionsService.mockImplementationOnce((params, callback) => {
        callback(mockResponse, 'OK');
      });

      const result = await service.calculateRouteDistance(startLocation, destination);

      // Esperando o resultado correto
      expect(result.totalDistance).toBe('Distância total: 100.00 km');
      expect(result.steps.length).toBe(2);
      expect(result.steps[0].distance).toBe(10);
      expect(result.steps[1].distance).toBe(20);
    });

    it('should handle errors and reject promise', async () => {
      const startLocation = new google.maps.LatLng(10, 20);
      const destination = new google.maps.LatLng(30, 40);

      // Simulando erro no Google Maps
      mockGoogleMaps.DirectionsService.mockImplementationOnce((params, callback, errorCallback) => {
        errorCallback('Error');
      });

      try {
        await service.calculateRouteDistance(startLocation, destination);
      } catch (error) {
        expect(error).toBe('Erro ao calcular a rota');
      }
    });
  });

  describe('extractStepsFromRoute', () => {
    it('should extract steps from a route response', () => {
      const mockResponse = {
        routes: [
          {
            legs: [
              {
                distance: { value: 100000 }, // 100 km
                steps: [
                  {
                    distance: { text: '10 km' },
                    duration: { text: '10 minutes' },
                    instructions: 'Go straight',
                    travel_mode: 'DRIVING',
                    path: [],
                    maneuver: 'left',
                  },
                  {
                    distance: { text: '20 km' },
                    duration: { text: '20 minutes' },
                    instructions: 'Turn left',
                    travel_mode: 'DRIVING',
                    path: [],
                    maneuver: 'merge',
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = service.extractStepsFromRoute(mockResponse);

      expect(result.stepsArray.length).toBe(2);
      expect(result.stepsArray[0].distance).toBe(10);
      expect(result.stepsArray[1].distance).toBe(20);
    });
  });

  describe('createStepInfo', () => {
    it('should create step information correctly', () => {
      const step = {
        distance: { text: '10 km' },
        duration: { text: '10 minutes' },
        instructions: 'Go straight',
        travel_mode: 'DRIVING',
        path: [],
        maneuver: 'left',
      };

      const result = service.createStepInfo(step);

      expect(result.distance).toBe(10);
      expect(result.duration).toBe('10 minutes');
      expect(result.instructions).toBe('Go straight');
      expect(result.roadType).toBe('cidade');
    });

    it('should detect highway as road type', () => {
      const step = {
        distance: { text: '10 km' },
        duration: { text: '10 minutes' },
        instructions: 'Go on BR-101',
        travel_mode: 'DRIVING',
        path: [],
        maneuver: 'left',
      };

      const result = service.createStepInfo(step);

      expect(result.roadType).toBe('estrada');
    });
  });
});
