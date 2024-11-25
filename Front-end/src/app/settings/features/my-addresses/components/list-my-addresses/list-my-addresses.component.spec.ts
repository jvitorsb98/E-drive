import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMyAddressesComponent } from './list-my-addresses.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddressService } from '../../../../core/services/Address/address.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginatedResponse } from '../../../../core/models/paginatedResponse';
import { DataAddressDetails } from '../../../../core/models/inter-Address';

describe('ListMyAddressesComponent', () => {
  let component: ListMyAddressesComponent;
  let fixture: ComponentFixture<ListMyAddressesComponent>;
  let addressService: jest.Mocked<AddressService>;
  let alertasService: jest.Mocked<AlertasService>;
  let dialog: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    const addressServiceMock = {
      listAll: jest.fn().mockReturnValue(of()), 
      selectAddress: jest.fn(), 
      disable: jest.fn().mockReturnValue(of(void 0))
    };
    const alertasServiceMock = {
      showError: jest.fn(),
      showWarning: jest.fn(),
      showSuccess: jest.fn()
    };
    const dialogMock = {
      open: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ListMyAddressesComponent],
      imports: [
        MatDialogModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AddressService, useValue: addressServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMyAddressesComponent);
    component = fixture.componentInstance;
    addressService = TestBed.inject(AddressService) as jest.Mocked<AddressService>;
    alertasService = TestBed.inject(AlertasService) as jest.Mocked<AlertasService>;
    dialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load addresses on init', async () => {
    const paginatedResponse: PaginatedResponse<DataAddressDetails> = {
      content: [{
        city: 'City', neighborhood: 'Neighborhood', state: 'State', id: 1,
        country: '',
        zipCode: '',
        number: 0,
        street: '',
        userId: 0,
        hasChargingStation: false,
        complement: '',
        activated: false
      }],
      totalElements: 1,
      pageable: {
        pageNumber: 0,
        pageSize: 0,
        sort: {
          empty: false,
          sorted: false,
          unsorted: false
        },
        offset: 0,
        paged: false,
        unpaged: false
      },
      last: true,
      totalPages: 1,
      size: 5,
      number: 0,
      sort: {
        active: 'city',
        direction: 'asc'
      },
      first: true,
      numberOfElements: 1,
      empty: false
    };

    addressService.listAll.mockReturnValue(of(paginatedResponse));

    await component.ngOnInit(); // Espera a execução do método assíncrono

    expect(addressService.listAll).toHaveBeenCalledWith(0, 5);
    expect(component.dataSource.data.length).toBe(1);
  });

  it('should handle error when loading addresses', async () => {
    const errorResponse = new HttpErrorResponse({ error: 'test 404 error', status: 404 });
    addressService.listAll.mockReturnValue(throwError(() => errorResponse));
  
    await component.ngOnInit(); // Espera a execução do método assíncrono
  
    expect(alertasService.showError).toHaveBeenCalledWith('Erro ao carregar endereços', 'Ocorreu um erro ao carregar os endereços.');
  });

  it('should apply filter', async () => {
    const paginatedResponse: PaginatedResponse<DataAddressDetails> = {
      content: [
        {
          city: 'City', neighborhood: 'Neighborhood', state: 'State', id: 1,
          country: '', zipCode: '', number: 0, street: '', userId: 0,
          hasChargingStation: false, complement: '', activated: false
        },
        {
          city: 'Another City', neighborhood: 'Another Neighborhood', state: 'State', id: 2,
          country: '', zipCode: '', number: 0, street: '', userId: 0,
          hasChargingStation: false, complement: '', activated: false
        }
      ],
      totalElements: 2,
      pageable: {
        pageNumber: 0,
        pageSize: 0,
        sort: {
          empty: false,
          sorted: false,
          unsorted: false
        },
        offset: 0,
        paged: false,
        unpaged: false
      },
      last: true,
      totalPages: 1,
      size: 5,
      number: 0,
      sort: {
        active: 'city',
        direction: 'asc'
      },
      first: true,
      numberOfElements: 2,
      empty: false
    };

    addressService.listAll.mockReturnValue(of(paginatedResponse));

    await component.ngOnInit(); // Espera a execução do método assíncrono
    component.applyFilter({ target: { value: 'Another' } } as any);

    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].city).toBe('Another City');
  });

  it('should handle page change', async () => {
    jest.spyOn(component, 'loadAddresses');

    const event = { pageIndex: 1, pageSize: 10 };
    component.onPageChange(event);

    expect(component.pageSize).toBe(10);
    expect(component.currentPage).toBe(1);
    expect(component.loadAddresses).toHaveBeenCalledWith(1, 10);
  });

  it('should open modal to add address', () => {
    // Mockando o MatDialogRef
    const mockMatDialogRef = {
      afterClosed: jest.fn().mockReturnValue(of(null)), // Mock do retorno de afterClosed()
      _ref: {},
      _containerInstance: {},
      componentInstance: {},
      componentRef: {},
    };
  
    dialog.open.mockReturnValue(mockMatDialogRef as any);  // Casando o tipo de MatDialogRef
  
    component.openModalAddAddress(); // Chama o método que deve abrir o modal
  
    expect(dialog.open).toHaveBeenCalled(); // Verifica se o modal foi aberto
    expect(mockMatDialogRef.afterClosed).toHaveBeenCalled(); // Verifica se afterClosed foi chamado
  });

  it('should open modal to edit address', () => {
    const address = { city: 'City', neighborhood: 'Neighborhood', state: 'State', id: 1 };
    const mockMatDialogRef = {
      afterClosed: jest.fn().mockReturnValue(of(null)), // Mock de afterClosed retornando um observable
    };
  
    dialog.open.mockReturnValue(mockMatDialogRef as any);
  
    component.openModalEditAddress(address as any);
  
    expect(dialog.open).toHaveBeenCalled();
    expect(mockMatDialogRef.afterClosed).toHaveBeenCalled();
  });
  

  it('should delete address and reload addresses', async () => {
    const address = { city: 'City', neighborhood: 'Neighborhood', state: 'State', id: 1 };
    alertasService.showWarning.mockResolvedValue(true); // Simula a resolução da confirmação
    addressService.disable.mockReturnValue(of<void>(undefined));
  
    jest.spyOn(component, 'loadAddresses');
  
    await component.deleteAddress(address as any); // Espera a execução do método assíncrono
  
    expect(addressService.disable).toHaveBeenCalledWith(address.id);
    expect(alertasService.showSuccess).toHaveBeenCalledWith('Endereço deletado', 'O endereço foi deletado com sucesso.');
    expect(component.loadAddresses).toHaveBeenCalled();
  });
  

});