import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { environment } from '../../../../../environments/environment';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { Category } from '../../models/category';
import { IPageable } from '../../models/pageable';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve paginated categories on success', () => {
    const mockResponse = {
      content: [{ id: 1, name: 'Category 1', activated: true }],
      pageable: {
        pageNumber: 0,
        pageSize: 1,
        sort: { empty: false, sorted: true, unsorted: false },
        offset: 0,
        paged: true,
        unpaged: false
      } as IPageable,
      last: true,
      totalPages: 1,
      totalElements: 1,
      first: true,
      size: 1,
      number: 0,
      sort: { empty: false, sorted: true, unsorted: false },
      numberOfElements: 1,
      empty: false
    };
  
    service.getAll().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.content.length).toBe(1);
      expect(response.content[0].name).toBe('Category 1');
    });
  
    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  

  it('should return an error message on HTTP failure', () => {
    const errorMessage = 'Ocorreu um erro ao buscar as categorias. Por favor, tente novamente mais tarde.';

    service.getAll().subscribe({
      next: () => fail('expected an error, but got a response'),
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/categories`);
    expect(req.request.method).toBe('GET');

    // Simula um erro HTTP 500
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});