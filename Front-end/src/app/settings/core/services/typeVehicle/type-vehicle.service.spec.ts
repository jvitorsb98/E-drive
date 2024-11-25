import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { TypeVehicleService } from './type-vehicle.service';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { VehicleType } from '../../models/vehicle-type';
import { environment } from '../../../../../environments/environment';

describe('TypeVehicleService', () => {
  let service: TypeVehicleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TypeVehicleService]
    });
    service = TestBed.inject(TypeVehicleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se não há requisições HTTP pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should retrieve all vehicle types (successful response)', () => {
      // Dados simulados de resposta da API
      const mockResponse = {
        content: [
          { id: 1, name: 'Sedan', activated: true },
          { id: 2, name: 'SUV', activated: true }
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
        empty: false
      };

      service.getAll().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.content.length).toBe(2);
      });


      const req = httpMock.expectOne(service.vehicleTypeUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
    
    it('should handle error when API returns an error', () => {
      const errorMessage = 'Ocorreu um erro ao buscar as categorias. Por favor, tente novamente mais tarde.';

      service.getAll().subscribe(
        () => fail('expected an error, not vehicle types'),
        (error: Error) => {
          expect(error.message).toBe(errorMessage);
        }
      );

      const req = httpMock.expectOne(service.vehicleTypeUrl);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});