import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CountryService } from './country.service';

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountryService],
    });
    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the correct endpoint when fetching countries', () => {
    const mockResponse = [
      { name: { common: 'Brazil' }, population: 213993437 },
      { name: { common: 'Argentina' }, population: 45376763 },
    ];

    service.getCountries().subscribe((countries) => {
      expect(countries).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://restcountries.com/v3.1/all');
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse); // Simulates the server response
  });

  it('should handle errors when fetching countries', () => {
    const errorMessage = 'Error fetching countries';

    service.getCountries().subscribe(
      () => fail('Should have failed with an error'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    );

    const req = httpMock.expectOne('https://restcountries.com/v3.1/all');
    expect(req.request.method).toBe('GET');

    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' }); // Simulates server error
  });
});