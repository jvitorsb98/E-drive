import { TestBed } from '@angular/core/testing';
import { LocationService } from './location.service';

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationService],
    });
    service = TestBed.inject(LocationService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserLocation', () => {
    let mockGeolocation: Partial<Geolocation>;
    let getCurrentPositionMock: jest.Mock;

    beforeEach(() => {
      // Mock para google.maps.LatLng
      global.google = {
        maps: {
          LatLng: jest.fn((lat, lng) => ({ lat, lng })),
        },
      } as any;

      // Mock para navigator.geolocation
      getCurrentPositionMock = jest.fn();
      mockGeolocation = {
        getCurrentPosition: getCurrentPositionMock,
      };
      Object.defineProperty(global.navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });
    });

    it('deve retornar a localização do usuário quando geolocalização for suportada', async () => {
      const mockPosition = {
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };
      getCurrentPositionMock.mockImplementation((successCallback: any) =>
        successCallback(mockPosition)
      );

      const result = await service.getUserLocation();

      expect(global.google.maps.LatLng).toHaveBeenCalledWith(37.7749, -122.4194);
      expect(result).toEqual({ lat: 37.7749, lng: -122.4194 });
    });

    it('deve rejeitar com erro quando a obtenção da localização falhar', async () => {
      const mockError = new Error('Usuário negou a permissão para localização');
      getCurrentPositionMock.mockImplementation((_: any, errorCallback: any) =>
        errorCallback(mockError)
      );

      await expect(service.getUserLocation()).rejects.toThrow(mockError);
    });

    it('deve rejeitar com null quando geolocalização não for suportada', async () => {
      Object.defineProperty(global.navigator, 'geolocation', { value: undefined });

      await expect(service.getUserLocation()).rejects.toBeNull();
    });
  });
});
