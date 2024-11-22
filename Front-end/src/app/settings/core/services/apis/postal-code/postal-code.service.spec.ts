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
    httpMock.verify(); // Verifica se nenhuma solicitação HTTP ficou pendente
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('searchPostalCode', () => {
    it('deve formatar o CEP, fazer uma chamada HTTP e retornar os dados esperados', () => {
      const postalCode = '12345-678'; // CEP com máscara
      const formattedPostalCode = '12345678'; // CEP sem máscara
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

    it('deve remover caracteres não numéricos do CEP antes de fazer a chamada HTTP', () => {
      const postalCode = '12a3b4c5d6-7e8';
      const formattedPostalCode = '12345678';

      service.searchPostalCode(postalCode).subscribe();

      const req = httpMock.expectOne(`https://viacep.com.br/ws/${formattedPostalCode}/json/`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });
});
