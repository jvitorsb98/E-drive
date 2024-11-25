import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostalCodeService } from './postal-code.service';

describe('PostalCodeService', () => {
  let service: PostalCodeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostalCodeService],
    });

    service = TestBed.inject(PostalCodeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no HTTP requests are pending
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchPostalCode', () => {
    it('should format the postal code, make an HTTP call, and return the expected data', () => {
      const postalCode = '12345-678'; // Postal code with mask
      const formattedPostalCode = '12345678'; // Postal code without mask
      const mockResponse = {
        cep: '12345-678',
        logradouro: 'Rua Exemplo',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP',
      };

      service.searchPostalCode(postalCode).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`https://viacep.com.br/ws/${formattedPostalCode}/json/`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should remove non-numeric characters from the postal code before making the HTTP call', () => {
      const postalCode = '12a3b4c5d6-7e8';
      const formattedPostalCode = '12345678';

      service.searchPostalCode(postalCode).subscribe();

      const req = httpMock.expectOne(`https://viacep.com.br/ws/${formattedPostalCode}/json/`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });
});