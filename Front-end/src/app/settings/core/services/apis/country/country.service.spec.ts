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

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar o endpoint correto ao buscar os países', () => {
    const mockResponse = [
      { name: { common: 'Brazil' }, population: 213993437 },
      { name: { common: 'Argentina' }, population: 45376763 },
    ];

    service.getCountries().subscribe((countries) => {
      expect(countries).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://restcountries.com/v3.1/all');
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse); // Simula a resposta do servidor
  });

  it('deve lidar com erros ao buscar os países', () => {
    const errorMessage = 'Erro ao buscar os países';

    service.getCountries().subscribe(
      () => fail('Deveria ter falhado com o erro'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    );

    const req = httpMock.expectOne('https://restcountries.com/v3.1/all');
    expect(req.request.method).toBe('GET');

    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' }); // Simula erro no servidor
  });
});
