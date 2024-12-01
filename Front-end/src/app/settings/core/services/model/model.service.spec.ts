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
    httpMock.verify();  // Verifica se não há requisições pendentes
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
  
    // Ajustar a URL esperada para incluir o parâmetro 'sort=name'
    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models?page=0&size=1&sort=name`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  
  

  // Teste para o método getModelsByBrandId
  it('should retrieve models by brand id', () => {
    const mockModels: Model[] = [
      { id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true },
      { id: 2, name: 'Model 2', brand: { id: 1, name: 'Brand 1', activated: true }, activated: false }
    ];

    const brandId = 1;

    service.getModelsByBrandId(brandId).subscribe(response => {
      expect(response.length).toBe(2);
      expect(response[0].name).toBe('Model 1');
      expect(response[1].name).toBe('Model 2');
      expect(response[0].brand.name).toBe('Brand 1');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/brand/${brandId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockModels);
  });

  // Teste para o método register
  it('should register a new model', () => {
    const newModel: Model = { id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true };

    service.register(newModel).subscribe(response => {
      expect(response.name).toBe('Model 1');
      expect(response.id).toBe(1);
      expect(response.brand.name).toBe('Brand 1');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newModel);
    req.flush(newModel);
  });

  // Teste para o método update
  it('should update an existing model', () => {
    const updatedModel: Model = { id: 1, name: 'Updated Model', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true };

    service.update(updatedModel).subscribe(response => {
      expect(response.name).toBe('Updated Model');
      expect(response.brand.name).toBe('Brand 1');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedModel);
    req.flush(updatedModel);
  });

  // Teste para o método delete
  it('should delete a model', () => {
    const modelId = 1;

    service.delete(modelId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Teste para o método activated
  it('should activate a model', () => {
    const modelId = 1;

    service.activated(modelId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/1/activate`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should handle error when retrieving paginated models', () => {
    const errorMessage = 'Failed to load models';
  
    service.getAllPaginated(0, 1).subscribe({
      next: () => fail('Expected error, but got success'),
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      }
    });
  
    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models?page=0&size=1&sort=name`);
    expect(req.request.method).toBe('GET');
    req.flush('', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error when retrieving models by brand id', () => {
    const brandId = 1;
    const errorMessage = 'Failed to load models by brand';
  
    service.getModelsByBrandId(brandId).subscribe({
      next: () => fail('Expected error, but got success'),
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      }
    });
  
    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/brand/${brandId}`);
    expect(req.request.method).toBe('GET');
    req.flush('', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error when retrieving all models', () => {
    const errorMessage = 'Failed to load all models';
  
    service.getAll().subscribe({
      next: () => fail('Expected error, but got success'),
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      }
    });
  
    const firstRequest = httpMock.expectOne(`${environment.apiUrl}/api/v1/models?page=0&size=1&sort=name`);
    firstRequest.flush('', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error when registering a new model', () => {
    const newModel: Model = { id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true };
    const errorMessage = 'Failed to register model';
  
    service.register(newModel).subscribe({
      next: () => fail('Expected error, but got success'),
      error: (error) => {
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
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      }
    });
  
    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/1`);
    expect(req.request.method).toBe('PUT');
    req.flush('', { status: 500, statusText: 'Internal Server Error' });
  });
  
  it('should handle error when deleting a model', () => {
    const modelId = 1;
    const errorMessage = 'Failed to delete model';
  
    service.delete(modelId).subscribe({
      next: () => fail('Expected error, but got success'),
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      }
    });
  
    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush('', { status: 500, statusText: 'Internal Server Error' });
  });
  
  it('should handle error when activating a model', () => {
    const modelId = 1;
    const errorMessage = 'Failed to activate model';
  
    service.activated(modelId).subscribe({
      next: () => fail('Expected error, but got success'),
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      }
    });
  
    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/models/1/activate`);
    expect(req.request.method).toBe('PUT');
    req.flush('', { status: 500, statusText: 'Internal Server Error' });
  });
  
  
});
