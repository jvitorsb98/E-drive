import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GeocodingService } from './geocoding.service';
import { environment } from '../../../../../../environments/environment';
import { GeocodingResponse } from '../../../models/geocoding-response';

describe('GeocodingService', () => {
  let service: GeocodingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeocodingService],
    });
    service = TestBed.inject(GeocodingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that there are no pending requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the correct endpoint when geocoding an address', () => {
    const mockResponse: GeocodingResponse = {
      results: [
        {
          formatted_address: '1600 Amphitheatre Parkway, Mountain View, CA',
          geometry: {
            location: { lat: 37.4224764, lng: -122.0842499 },
          },
          place_id: 'ChIJ2eUgeAK6j4ARbn5u_wAGqWA',
        },
      ],
      status: 'OK',
    };

    const address = '1600 Amphitheatre Parkway, Mountain View, CA';
    const apiKey = environment.googleMapsApiKey;
    const expectedUrl = `/api/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    service.geocode(address).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse); // Simulates server response
  });

  it('should handle errors when geocoding an address', () => {
    const address = 'Invalid Address';
    const apiKey = environment.googleMapsApiKey;
    const expectedUrl = `/api/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const errorMessage = 'Error while geocoding the address';

    service.geocode(address).subscribe(
      () => fail('Should have failed with an error'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(errorMessage, { status: 404, statusText: 'Not Found' }); // Simulates server error
  });
});