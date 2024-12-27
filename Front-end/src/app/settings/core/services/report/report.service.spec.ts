import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from './report.service';
import { environment } from '../../../../../environments/environment';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa o módulo para testar HTTP
      providers: [ReportService] // Fornece o serviço a ser testado
    });

    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController); // Fornece o controlador de requisições HTTP
  });

  afterEach(() => {
    // Verifica se há requisições pendentes
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the most registered cars report', () => {
    // Defina o comportamento esperado para a requisição
    const mockResponse = new Blob(); // Mock da resposta do tipo Blob
    const reportUrl = `${environment.apiUrl}/api/v1/reports/most-registered-cars`;

    // Chama o método que faz a requisição
    service.generateReport('most-registered-cars').subscribe(response => {
      expect(response).toEqual(mockResponse); // Verifica se a resposta é a esperada
    });

    // Simula a resposta da requisição HTTP
    const req = httpMock.expectOne(reportUrl);
    expect(req.request.method).toBe('GET'); // Verifica se o método da requisição é GET
    req.flush(mockResponse); // Responde com o mock de Blob
  });

  it('should handle error response correctly', () => {
    const errorMessage = 'Erro na requisição';

    service.generateReport('most-registered-cars').subscribe({
      next: () => fail('Esperado erro, mas a resposta foi bem-sucedida'),
      error: (error) => {
        expect(error.status).toBe(500); // Verifica o status do erro
        expect(error.statusText).toBe(errorMessage); // Verifica a mensagem do erro
      }
    });

    // Simula uma resposta de erro HTTP
    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/reports/most-registered-cars`);
    req.flush(errorMessage, { status: 500, statusText: errorMessage });
  });
});
