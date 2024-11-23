import { TestBed } from '@angular/core/testing'; 
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AddressService } from './address.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';
import { IAddressRequest, IAddressResponse, DataAddressDetails } from '../../models/inter-Address';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { IPageable } from '../../models/pageable';

describe('AddressService', () => {
  let service: AddressService;
  let httpMock: HttpTestingController;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddressService, MatSnackBar]
    });

    service = TestBed.inject(AddressService);
    httpMock = TestBed.inject(HttpTestingController);
    snackBar = TestBed.inject(MatSnackBar);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se há requisições não resolvidas
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Teste para o método register
  it('should register an address successfully', () => {
    const mockRequest: IAddressRequest = {
      country: 'Brazil',
      zipCode: '12345-678',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      number: 1000,
      street: 'Av. Paulista',
      complement: 'Apto 101',
      hasChargingStation: true
    };

    const mockResponse: IAddressResponse = {
      id: 1,
      country: 'Brazil',
      zipCode: '12345-678',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      number: 1000,
      street: 'Av. Paulista',
      userId: 1,
      hasChargingStation: true,
      complement: 'Apto 101',
      activated: true
    };

    service.register(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse); // Envia a resposta mockada
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  // Teste para o método getById
  it('should retrieve an address by ID', () => {
    const mockResponse: IAddressResponse = {
      id: 1,
      country: 'Brazil',
      zipCode: '12345-678',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      number: 1000,
      street: 'Av. Paulista',
      userId: 1,
      hasChargingStation: true,
      complement: 'Apto 101',
      activated: true
    };

    const addressId = 1;

    service.getById(addressId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // Teste para o método getAll
  it('should retrieve all addresses', () => {
    const mockResponse = {
      content: [{
        id: 1,
        country: 'Brazil',
        zipCode: '12345-678',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Centro',
        number: 1000,
        street: 'Av. Paulista',
        userId: 1,
        hasChargingStation: true,
        complement: 'Apto 101',
        activated: true
      }],
      pageable: {
        pageNumber: 0,
        pageSize: 1,
        offset: 0,
        paged: true,
        unpaged: false,
        sort: { empty: false, sorted: true, unsorted: false } 
      } as IPageable,  
      last: true,
      totalPages: 1,
      totalElements: 1,
      first: true,
      size: 1,
      number: 0,
      numberOfElements: 1,
      empty: false
    };
  
    service.getAll().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.content.length).toBe(1);
    });
  
    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address/user`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  
  // Teste para o método update
  it('should update an address successfully', () => {
    const addressId = 1;
    const mockRequest: IAddressRequest = {
      country: 'Brazil',
      zipCode: '12345-678',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      number: 1000,
      street: 'Av. Paulista',
      complement: 'Apto 101',
      hasChargingStation: true
    };

    const mockResponse: DataAddressDetails = {
      id: 1,
      country: 'Brazil',
      zipCode: '12345-678',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      number: 1000,
      street: 'Av. Paulista',
      userId: 1,
      hasChargingStation: true,
      complement: 'Apto 101',
      activated: true
    };

    service.update(addressId, mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  // Teste para o método handleError (simulando erro)
  it('should handle errors correctly', () => {
    const errorResponse = { status: 400, statusText: 'Bad Request' };
    const errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';

    jest.spyOn(snackBar, 'open'); // Mock do método open do MatSnackBar

    service.register({ /* Dados inválidos */ } as IAddressRequest).subscribe(
      () => {},
      error => {
        expect(error).toBe(errorMessage);
        expect(snackBar.open).toHaveBeenCalledWith(errorMessage, 'Fechar', { duration: 5000 });
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address`);
    expect(req.request.method).toBe('POST');
    req.flush(null, errorResponse); 
  });

});
