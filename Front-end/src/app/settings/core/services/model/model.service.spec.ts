import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ModelService } from './model.service';
import { Model } from '../../models/model';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { environment } from '../../../../../environments/environment';

describe('ModelService', () => {
  let service: ModelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ModelService]
    });

    service = TestBed.inject(ModelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all models', () => {
    const mockResponse: Model[] = [
      {
        id: 1,
        name: 'Model 1',
        brand: { id: 1, name: 'Brand 1', activated: true },
        activated: true
      }
    ];

    service.getAll().subscribe(response => {
      expect(response.length).toBe(1);
      expect(response[0].name).toBe('Model 1');
      expect(response[0].brand.name).toBe('Brand 1');
    });

    const req1 = httpMock.expectOne(`${environment.apiUrl}/api/v1/models?page=0&size=1&sort=name`);
    expect(req1.request.method).toBe('GET');
    req1.flush({ totalElements: 1 });

    const req2 = httpMock.expectOne(`${environment.apiUrl}/api/v1/models?page=0&size=1&sort=name`);
    expect(req2.request.method).toBe('GET');
    req2.flush(mockResponse);
  });

  it('should retrieve models by brand ID', () => {
    const brandId = 1;
    const mockResponse: Model[] = [
      { id: 1, name: 'Model 1', brand: { id: brandId, name: 'Brand 1', activated: true }, activated: true }
    ];

    service.getModelsByBrandId(brandId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/brand/${brandId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });


  it('should handle error when retrieving models by brand ID', () => {
    const brandId = 1;
    const errorMessage = 'Failed to retrieve models by brand ID';

    service.getModelsByBrandId(brandId).subscribe({
      next: () => fail('Expected error, but got success'),
      error: error => {
        expect(error.message).toContain('Http failure response');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/brand/${brandId}`);
    req.flush('', { status: 500, statusText: 'Internal Server Error' });
  });


  it('should handle error when getting all models', () => {
    const errorMessage = 'Failed to load all models';

    service.getAll().subscribe({
      next: () => fail('Expected error, but got success'),
      error: error => {
        expect(error.message).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models?page=0&size=1&sort=name`);
    req.flush('', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should retrieve paginated models with status filter', () => {
    const page = 0;
    const size = 10;
    const statusFilter = 'true';
    const mockResponse: PaginatedResponse<Model> = {
      content: [],
      pageable: {
        pageNumber: page,
        pageSize: size,
        offset: 0,
        paged: true,
        unpaged: false,
        sort: { empty: false, sorted: true, unsorted: false },
      },
      last: true,
      totalPages: 1,
      totalElements: 0,
      first: true,
      size: size,
      number: page,
      sort: { active: 'name', direction: 'asc' },
      numberOfElements: 0,
      empty: true,
    };

    service.getAllPaginated(page, size, statusFilter).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/v1/models?page=${page}&size=${size}&sort=name&activated=${statusFilter}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });


  it('should throw error when updating a model without id or name', () => {
    const invalidModel = { brand: { id: 1, name: 'Brand 1', activated: true }, activated: true } as Model;

    service.update(invalidModel).subscribe({
      next: () => fail('Expected error, but got success'),
      error: error => {
        expect(error.message).toBe('Dados do modelo são insuficientes para atualização.');
      }
    });
  });

  it('should register a new model', () => {
    const newModel: Model = { id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true };

    service.register(newModel).subscribe(response => {
      expect(response).toEqual(newModel);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models`);
    expect(req.request.method).toBe('POST');
    req.flush(newModel);
  });

  it('should update an existing model', () => {
    const updatedModel: Model = { id: 1, name: 'Updated Model', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true };

    service.update(updatedModel).subscribe(response => {
      expect(response).toEqual(updatedModel);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedModel);
  });

  it('should delete a model', () => {
    const modelId = 1;

    service.delete(modelId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle error when deleting a model', () => {
    const modelId = 1;
    const errorMessage = 'Failed to delete model';

    service.delete(modelId).subscribe({
      next: () => fail('Expected error, but got success'),
      error: error => {
        expect(error.message).toContain('Http failure response');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/${modelId}`);
    req.flush('', { status: 500, statusText: 'Internal Server Error' });
  });


  it('should activate a model', () => {
    const modelId = 1;

    service.activated(modelId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/1/activate`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should handle error when activating a model', () => {
    const modelId = 1;
    const errorMessage = 'Failed to activate model';

    service.activated(modelId).subscribe({
      next: () => fail('Expected error, but got success'),
      error: error => {
        expect(error.message).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/1/activate`);
    expect(req.request.method).toBe('PUT');
    req.flush('', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error when registering a new model', () => {
    const newModel: Model = { id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true };
    const errorMessage = 'Failed to register model';

    service.register(newModel).subscribe({
      next: () => fail('Expected error, but got success'),
      error: error => {
        expect(error.message).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models`);
    expect(req.request.method).toBe('POST');
    req.flush('', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error when updating a model', () => {
    const updatedModel: Model = { id: 1, name: 'Updated Model', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true };
    const errorMessage = 'Failed to update model';

    service.update(updatedModel).subscribe({
      next: () => fail('Expected error, but got success'),
      error: error => {
        expect(error.message).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/1`);
    expect(req.request.method).toBe('PUT');
    req.flush('', { status: 500, statusText: 'Internal Server Error' });
  });
});
