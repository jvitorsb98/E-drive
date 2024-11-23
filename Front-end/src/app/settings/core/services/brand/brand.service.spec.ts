import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrandService } from './brand.service';
import { environment } from '../../../../../environments/environment';
import { Brand } from '../../models/brand';

describe('BrandService', () => {
  let service: BrandService;
  let httpMock: HttpTestingController;

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

  it('should retrieve paginated brands', () => {
    const mockResponse: Brand[] = [{ id: 1, name: 'Brand 1', activated: true }];
    
    service.getAll().subscribe(response => {
      expect(response.length).toBe(1); // Verifica o comprimento do array de marcas
      expect(response[0].name).toBe('Brand 1'); // Verifica o nome da marca
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/brands?page=0&size=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // A resposta mockada é um array simples de marcas
  });
  
  
  

  it('should retrieve all brands', () => {
    const mockResponse = [{ id: 1, name: 'Brand 1', activated: true }];
    service.getAll().subscribe(response => {
      expect(response.length).toBe(1);
      expect(response[0].name).toBe('Brand 1');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/brands?page=0&size=1`);
    req.flush(mockResponse);
  });

  it('should retrieve brand details', () => {
    const brandId = 1;
    const mockBrand: Brand = { id: brandId, name: 'Brand 1', activated: true };

    service.getBrandDetails(brandId).subscribe(response => {
      expect(response).toEqual(mockBrand);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/brands/${brandId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBrand);
  });

  it('should register a brand', () => {
    const newBrand: Brand = { id: 1, name: 'New Brand', activated: true };

    service.register(newBrand).subscribe(response => {
      expect(response).toEqual(newBrand);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/brands`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newBrand);
    req.flush(newBrand);
  });

  it('should update a brand', () => {
    const updatedBrand: Brand = { id: 1, name: 'Updated Brand', activated: true };

    service.update(updatedBrand).subscribe(response => {
      expect(response).toEqual(updatedBrand);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/brands/${updatedBrand.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedBrand);
    req.flush(updatedBrand);
  });

  it('should delete a brand', () => {
    const brandId = 1;

    service.delete(brandId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/brands/${brandId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should activate a brand', () => {
    const brandId = 1;

    service.activated(brandId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/brands/${brandId}/activate`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});
