import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VersionService } from './version.service';
import { environment } from '../../../../../environments/environment';

describe('VersionService', () => {
  let service: VersionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VersionService]
    });
    service = TestBed.inject(VersionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se não há requisições HTTP pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getVersionsByModelId', () => {
    it('should retrieve versions by model ID (successful response)', () => {
      const modelId = 1;
      const mockResponse = ['Version 1', 'Version 2'];

      service.getVersionsByModelId(modelId).subscribe((versions) => {
        expect(versions).toEqual(mockResponse);
        expect(versions.length).toBe(2);
      });

      // Verifica a requisição HTTP GET e responde com o mock
      const req = httpMock.expectOne(`${environment.apiUrl}/vehicle/model/${modelId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error when API returns an error', () => {
      const modelId = 1;
      const errorMessage = 'An error occurred while fetching versions.';

      service.getVersionsByModelId(modelId).subscribe(
        () => fail('expected an error, not versions'),
        (error) => {
          expect(error).toBeTruthy();
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/vehicle/model/${modelId}`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
