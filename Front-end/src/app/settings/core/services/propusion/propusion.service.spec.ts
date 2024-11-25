import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { Propulsion } from '../../models/propulsion';
import { PropusionService } from './propusion.service';


describe('PropulsionService', () => {
  let service: PropusionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PropusionService]
    });
    service = TestBed.inject(PropusionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se não há requisições pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should retrieve all propulsions (successful response)', () => {
      const mockResponse = {
        content: [
          { id: 1, name: 'Electric', activated: true },
          { id: 2, name: 'Hybrid', activated: true }
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 2,
          offset: 0,
          paged: true,
          unpaged: false,
          sort: { empty: false, sorted: true, unsorted: false }
        },
        totalElements: 2,
        last: true,
        totalPages: 1,
        first: true,
        number: 0,
        size: 2,
        numberOfElements: 2,
        empty: false,
        sort: { empty: false, sorted: true, unsorted: false }
      };

      service.getAll().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.content.length).toBe(2);
      });

      const req = httpMock.expectOne(service.propulsionUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error when API returns an error', () => {
      const errorMessage = 'Ocorreu um erro ao buscar as propulsoes. Por favor, tente novamente mais tarde.';

      service.getAll().subscribe(
        () => fail('expected an error, not propulsions'),
        (error: Error) => {
          expect(error.message).toBe(errorMessage);
        }
      );

      const req = httpMock.expectOne(service.propulsionUrl);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});