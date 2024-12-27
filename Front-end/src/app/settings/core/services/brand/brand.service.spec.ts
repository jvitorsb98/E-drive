import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BrandService } from './brand.service';
import { environment } from '../../../../../environments/environment';
import { Brand } from '../../models/brand';

describe('BrandService', () => {
  let service: BrandService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/api/v1/brands`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BrandService],
    });

    service = TestBed.inject(BrandService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all brands from paginated API', () => {
    const initialResponse = { content: [], totalElements: 2 };
    const finalResponse = {
      content: [
        { id: 1, name: 'Brand 1', activated: true },
        { id: 2, name: 'Brand 2', activated: true }
      ]
    };

    service.getAll().subscribe(response => {
      expect(response.length).toBe(2);
      expect(response[0].name).toBe('Brand 1');
      expect(response[1].name).toBe('Brand 2');
    });

    const initialRequest = httpMock.expectOne(`${apiUrl}?page=0&size=1`);
    expect(initialRequest.request.method).toBe('GET');
    initialRequest.flush(initialResponse);

    const finalRequest = httpMock.expectOne(`${apiUrl}?page=0&size=2`);
    expect(finalRequest.request.method).toBe('GET');
    finalRequest.flush(finalResponse);
  });

  it('should handle error when fetching all brands (specifically in the inner request)', () => {
    const initialResponse = { content: [], totalElements: 2 };
    const initialRequest = httpMock.expectOne(`${apiUrl}?page=0&size=1`);
    expect(initialRequest.request.method).toBe('GET');
    initialRequest.flush(initialResponse);

    const finalRequest = httpMock.expectOne(`${apiUrl}?page=0&size=2`);
    expect(finalRequest.request.method).toBe('GET');
    finalRequest.flush(null, { status: 500, statusText: 'Internal Server Error' });

    service.getAll().subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.message).toBe('Failed to load all brands');
      }
    });
  });

  it('should retrieve paginated brands', () => {
    const mockResponse = {
      content: [{ id: 1, name: 'Brand 1', activated: true }],
      totalElements: 1,
      totalPages: 1,
      size: 1,
      number: 0
    };
    const pageIndex = 0;
    const pageSize = 1;
    const statusFilter = 'activated';

    service.getAllPaginated(pageIndex, pageSize, statusFilter).subscribe(response => {
      expect(response.content.length).toBe(1);
      expect(response.content[0].name).toBe('Brand 1');
    });

    const req = httpMock.expectOne(`${apiUrl}?page=0&size=1&activated=activated`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should retrieve brand details', () => {
    const brandId = 1;
    const mockBrand: Brand = { id: brandId, name: 'Brand 1', activated: true };

    service.getBrandDetails(brandId).subscribe(response => {
      expect(response).toEqual(mockBrand);
    });

    const req = httpMock.expectOne(`${apiUrl}/${brandId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBrand);
  });

  it('should register a brand', () => {
    const newBrand: Brand = { id: 1, name: 'New Brand', activated: true };

    service.register(newBrand).subscribe(response => {
      expect(response).toEqual(newBrand);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newBrand);
    req.flush(newBrand);
  });

  it('should handle error when registering a brand', () => {
    const newBrand: Brand = { id: 1, name: 'New Brand', activated: true };
    const errorResponse = { status: 400, statusText: 'Bad Request' };

    service.register(newBrand).subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
      }
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({}, errorResponse);
  });

  it('should update a brand', () => {
    const updatedBrand: Brand = { id: 1, name: 'Updated Brand', activated: true };

    service.update(updatedBrand).subscribe(response => {
      expect(response).toEqual(updatedBrand);
    });

    const req = httpMock.expectOne(`${apiUrl}/${updatedBrand.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedBrand);
    req.flush(updatedBrand);
  });

  it('should handle error from HTTP PUT request', () => {
    const validBrand: Brand = { id: 1, name: 'Updated Brand', activated: true };

    service.update(validBrand).subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/${validBrand.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush('Error occurred', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should delete a brand', () => {
    const brandId = 1;

    service.delete(brandId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/${brandId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should fail to delete a brand if not found', () => {
    const brandId = 1;

    service.delete(brandId).subscribe({
      next: () => fail('expected error'),
      error: (error) => {
        expect(error.message).toBe(`Http failure response for ${apiUrl}/${brandId}: 404 Not Found`);
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/${brandId}`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should activate a brand', () => {
    const brandId = 1;

    service.activated(brandId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/${brandId}/activate`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should handle error when activating a brand', () => {
    const brandId = 1;
    const errorResponse = { status: 400, statusText: 'Bad Request' };

    service.activated(brandId).subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/${brandId}/activate`);
    expect(req.request.method).toBe('PUT');
    req.flush({}, errorResponse);
  });

  it('should handle error when getting brand details', () => {
    const brandId = 1;
    const errorResponse = { status: 404, statusText: 'Not Found' };

    service.getBrandDetails(brandId).subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/${brandId}`);
    expect(req.request.method).toBe('GET');
    req.flush({}, errorResponse);
  });

  it('should throw an error if brand data is insufficient', () => {
    const invalidBrand: Brand = { id: 0, name: '', activated: false };

    service.update(invalidBrand).subscribe({
      next: () => fail('expected an error'),
      error: (error) => {
        expect(error.message).toBe('Dados da marca são insuficientes para atualização.');
      },
    });

    httpMock.expectNone(`${apiUrl}/`);
  });
});
