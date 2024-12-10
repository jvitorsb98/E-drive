import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AddressService } from './address.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';
import { IAddressRequest, IAddressResponse, DataAddressDetails } from '../../models/inter-Address';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { IPageable } from '../../models/pageable';
import { HttpErrorResponse } from '@angular/common/http';

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

  // Teste para o método selectAddress
it('should set the selected address', () => {
  const mockAddress = {
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

  service.selectAddress(mockAddress);

  service.selectedAddress$.subscribe(address => {
    expect(address).toEqual(mockAddress);
  });
});

// Teste para o método clearSelectedAddress
it('should clear the selected address', () => {
  service.clearSelectedAddress();

  service.selectedAddress$.subscribe(address => {
    expect(address).toBeNull();
  });
});

  // Teste para o método setTitle
it('should set the page title', () => {
  const title = 'Cadastrar endereço';

  service.setTitle(title);

  service.selectedTitle$.subscribe(currentTitle => {
    expect(currentTitle).toBe(title);
  });
});

// Teste para o método clearTitle
it('should reset the page title', () => {
  service.clearTitle();

  service.selectedTitle$.subscribe(currentTitle => {
    expect(currentTitle).toBe('Registrar endereço');
  });
});

// Teste para o método handleError com erro 404
it('should handle 404 error correctly', () => {
  const errorResponse = { status: 404, statusText: 'Not Found' };
  const errorMessage = 'Endereço não encontrado.';

  jest.spyOn(snackBar, 'open'); // Mock do método open do MatSnackBar

  service.getById(999).subscribe(
    () => {},
    error => {
      expect(error).toBe(errorMessage);
      expect(snackBar.open).toHaveBeenCalledWith(errorMessage, 'Fechar', { duration: 5000 });
    }
  );

  const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address/999`);
  expect(req.request.method).toBe('GET');
  req.flush(null, errorResponse);
});

 // Teste para o método listAll
it('should retrieve paginated addresses', () => {
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

  const page = 1;
  const size = 1;

  service.listAll(page, size).subscribe(response => {
    expect(response).toEqual(mockResponse);
    expect(response.content.length).toBe(1);
  });

  const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address/user?page=1&size=1&sort=city`);
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});

// Teste para o método disable
it('should disable an address successfully', () => {
  const addressId = 1;

  service.disable(addressId).subscribe(response => {
    expect(response).toBeUndefined(); // ou expect(response).toBeNull(); dependendo da sua API
  });

  const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address/1`);
  expect(req.request.method).toBe('DELETE');
  req.flush(null); // ou req.flush({}); dependendo da sua API
});

// Teste para o método disable com erro
it('should handle error when disabling an address', () => {
  const addressId = 999;
  const errorResponse = { status: 404, statusText: 'Not Found' };
  const errorMessage = 'Endereço não encontrado.';

  jest.spyOn(snackBar, 'open');

  service.disable(addressId).subscribe(
    () => {},
    error => {
      expect(error).toBe(errorMessage);
      expect(snackBar.open).toHaveBeenCalledWith(errorMessage, 'Fechar', { duration: 5000 });
    }
  );

  const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address/999`);
  expect(req.request.method).toBe('DELETE');
  req.flush(null, errorResponse);
});

// Teste para o método handleError com erro 401
it('should handle 401 error correctly', () => {
  const errorResponse = { status: 401, statusText: 'Unauthorized' };
  const errorMessage = 'Não autorizado. Faça login e tente novamente.';

  jest.spyOn(snackBar, 'open');

  // Simula uma requisição que retorna erro 401
  service.getById(999).subscribe(
    () => {},
    error => {
      expect(error).toBe(errorMessage);
      expect(snackBar.open).toHaveBeenCalledWith(errorMessage, 'Fechar', { duration: 5000 });
    }
  );

  const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address/999`);
  expect(req.request.method).toBe('GET');
  req.flush(null, errorResponse);
});

// Teste para o método handleError com erro 403
it('should handle 403 error correctly', () => {
  const errorResponse = { status: 403, statusText: 'Forbidden' };
  const errorMessage = 'Acesso proibido. Você não tem permissão para realizar esta ação.';

  jest.spyOn(snackBar, 'open');

  // Simula uma requisição que retorna erro 403 (Forbidden)
  // Escolha um método do seu serviço que possa retornar 403
  service.update(1, {} as IAddressRequest).subscribe(
    () => {},
    error => {
      expect(error).toBe(errorMessage);
      expect(snackBar.open).toHaveBeenCalledWith(errorMessage, 'Fechar', { duration: 5000 });
    }
  );

  const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address/1`);
  expect(req.request.method).toBe('PUT');
  req.flush(null, errorResponse);
});

// Teste para o método handleError com erro 500 (ou outro não mapeado)
it('should handle 500 error (or other unmapped errors) correctly', () => {
  const errorResponse = { status: 500, statusText: 'Internal Server Error' };
  const errorMessage = 'Ocorreu um erro. Por favor, tente novamente mais tarde.';

  jest.spyOn(snackBar, 'open');

  // Simula uma requisição que retorna erro 500
  service.getAll().subscribe(
    () => {},
    error => {
      expect(error).toBe(errorMessage);
      expect(snackBar.open).toHaveBeenCalledWith(errorMessage, 'Fechar', { duration: 5000 });
    }
  );

  const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address/user`);
  expect(req.request.method).toBe('GET');
  req.flush(null, errorResponse);
});

it('should set default title when title is empty', () => {
  service.setTitle(''); // Chama setTitle com string vazia

  service.selectedTitle$.subscribe(currentTitle => {
    expect(currentTitle).toBe('Registrar endereço'); // Verifica se o título padrão foi definido
  });
});

it('should handle ErrorEvent correctly', () => {
  const errorEvent = new ErrorEvent('test error');
  jest.spyOn(snackBar, 'open');

  // Simula uma requisição que gera um erro
  service.getById(999).subscribe(
    () => {},
    error => {
      expect(snackBar.open).toHaveBeenCalledWith(`Erro: ${errorEvent.message}`, 'Fechar', { duration: 5000 });
    }
  );

  // Configura o httpMock para retornar um erro com ErrorEvent
  const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/address/999`);
  expect(req.request.method).toBe('GET');
  req.error(errorEvent);
});

});
