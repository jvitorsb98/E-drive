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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserLocation', () => {
    let mockGeolocation: Partial<Geolocation>;
    let getCurrentPositionMock: jest.Mock;

    beforeEach(() => {
      // Mock for google.maps.LatLng
      global.google = {
        maps: {
          LatLng: jest.fn((lat, lng) => ({ lat, lng })),
        },
      } as any;

      // Mock for navigator.geolocation
      getCurrentPositionMock = jest.fn();
      mockGeolocation = {
        getCurrentPosition: getCurrentPositionMock,
      };
      Object.defineProperty(global.navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });
    });

    it("should return the user's location when geolocation is supported", async () => {
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

    it('should reject with an error when obtaining the location fails', async () => {
      const mockError = new Error('User denied the location permission');
      getCurrentPositionMock.mockImplementation((_: any, errorCallback: any) =>
        errorCallback(mockError)
      );

      await expect(service.getUserLocation()).rejects.toThrow(mockError);
    });

    it('should reject with null when geolocation is not supported', async () => {
      Object.defineProperty(global.navigator, 'geolocation', { value: undefined });

      await expect(service.getUserLocation()).rejects.toBeNull();
    });
  });
});