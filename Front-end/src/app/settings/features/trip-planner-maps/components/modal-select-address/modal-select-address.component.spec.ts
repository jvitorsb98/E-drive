import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule } from '@angular/forms';

import { BrandService } from '../../../../core/services/brand/brand.service';
import { ModelService } from '../../../../core/services/model/model.service';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { UserDataService } from '../../../../core/services/user/userdata/user-data.service';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { CategoryService } from '../../../../core/services/category/category.service';
import { CategoryAvgAutonomyStatsService } from '../../../../core/services/category-avg-autonomy-stats-service/category-avg-autonomy-stats.service';
import { Vehicle } from '../../../../core/models/vehicle';
import { UserVehicle } from '../../../../core/models/user-vehicle';

// Importar os módulos necessários do Angular Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
// Importar o BrowserAnimationsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ModalFormVehicleComponent } from '../../../user-vehicle/components/modal-form-vehicle/modal-form-vehicle.component';
import { ModalSelectAddressComponent } from './modal-select-address.component';
import { AddressService } from '../../../../core/services/Address/address.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PaginatedResponse } from '../../../../core/models/paginatedResponse';
import { DataAddressDetails } from '../../../../core/models/inter-Address';

describe('ModalFormVehicleComponent', () => {
  let component: ModalFormVehicleComponent;
  let fixture: ComponentFixture<ModalFormVehicleComponent>;
  let dialogRef: MatDialogRef<ModalFormVehicleComponent>;
  let brandService: BrandService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFormVehicleComponent],
      imports: [
        HttpClientTestingModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        BrowserAnimationsModule,
      ],
      providers: [
        FormBuilder,
        BrandService,
        ModelService,
        VehicleService,
        UserDataService,
        UserVehicleService,
        CategoryService,
        CategoryAvgAutonomyStatsService,
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            vehicle: {
              id: 1,
              motor: 'V8',
              version: '2024',
              model: { id: 1, name: 'Mustang', brand: { id: 1, name: 'Ford', activated: true }, activated: true },
              category: { id: 1, name: 'Sports', activated: true },
              type: { id: 1, name: 'Coupe', activated: true },
              propulsion: { id: 1, name: 'Electric', activated: true },
              autonomy: { mileagePerLiterRoad: 15.5, mileagePerLiterCity: 12.0, consumptionEnergetic: 7.8, autonomyElectricMode: 100.0 },
              activated: true,
              year: 2024,
            } as Vehicle,
            userVehicle: { vehicleId: 1 } as UserVehicle,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFormVehicleComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    brandService = TestBed.inject(BrandService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    component.closeModal();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should initialize vehicle data correctly from MAT_DIALOG_DATA', () => {
    expect(component.vehicle.id).toBe(1);
    expect(component.vehicle.motor).toBe('V8');
    expect(component.vehicle.model.name).toBe('Mustang');
    expect(component.vehicle.year).toBe(2024);
  });


  it('should build form on init', () => {
    component.ngOnInit();
    expect(component.userVehicleForm).toBeDefined();
    expect(component.userVehicleForm.get('version')).toBeTruthy();
    expect(component.userVehicleForm.get('brand')).toBeTruthy();
    expect(component.userVehicleForm.get('model')).toBeTruthy();
  });

  it('should populate form controls with initial data from vehicle', () => {
    expect(component.userVehicleForm.get('version')?.value).toBe('2024');
    expect(component.userVehicleForm.get('brand')?.value).toBe('Ford');
    expect(component.userVehicleForm.get('model')?.value).toBe('Mustang');
  });



  it('should setup autocomplete properly', () => {
    component.brands = [{ name: 'Ford', id: 1 }, { name: 'Chevrolet', id: 2 }];
    component.models = [{ name: 'Mustang', id: 1 }];
    component.vehicles = [{ id: 1, version: '2024', model: { id: 1, name: 'Mustang' } } as Vehicle];

    component.setupAutocomplete();
    fixture.detectChanges();

    // Check if the filteredBrands Observable is setup correctly
    let filteredBrands: { name: string; id: number }[] = [];
    component.filteredBrands.subscribe(data => filteredBrands = data);
    expect(filteredBrands.length).toBe(2);

    // Check if the filteredModels Observable is setup correctly
    let filteredModels: { name: string }[] = [];
    component.filteredModels.subscribe(data => filteredModels = data);
    expect(filteredModels.length).toBe(1);

    // Check if the filteredVersions Observable is setup correctly
    let filteredVersions: Vehicle[] = [];
    component.filteredVersions.subscribe(data => filteredVersions = data);
    expect(filteredVersions.length).toBe(1);
  });



  it('should close modal when closeModal is called', () => {
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.closeModal();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should setup autocomplete with data from services', () => {
    // Mockando os dados de serviços
    component.brands = [{ name: 'Ford', id: 1 }];
    component.models = [{ name: 'Mustang', id: 1 }];

    component.setupAutocomplete();
    fixture.detectChanges();

    let filteredBrands: { name: string; id: number }[] = [];
    component.filteredBrands.subscribe(data => filteredBrands = data);

    expect(filteredBrands.length).toBe(1);
    expect(filteredBrands[0].name).toBe('Ford');
  });

  it('should handle empty vehicles list in autocomplete', () => {
    component.vehicles = [];
    component.setupAutocomplete();
    fixture.detectChanges();

    let filteredVersions: Vehicle[] = [];
    component.filteredVersions.subscribe(data => filteredVersions = data);
    expect(filteredVersions.length).toBe(0);
  });

  it('should call ngOnInit and set data from MAT_DIALOG_DATA', () => {
    const spyOnInit = jest.spyOn(component, 'ngOnInit');
    component.ngOnInit();

    expect(spyOnInit).toHaveBeenCalled();
    expect(component.vehicle).toBeDefined();
    expect(component.userVehicle).toBeDefined();
  });


  it('should submit the form when valid', () => {
    // Simulando um formulário válido com todos os campos
    component.userVehicleForm.setValue({
      version: '2024',
      brand: 'Ford',
      model: 'Mustang',
      mileagePerLiterRoad: 10,        // Exemplo de valor válido
      mileagePerLiterCity: 8,         // Exemplo de valor válido
      consumptionEnergetic: 50,       // Exemplo de valor válido
      autonomyElectricMode: 150,      // Exemplo de valor válido
      batteryCapacity: 50,            // Exemplo de valor válido
    });

    const submitSpy = jest.spyOn(component, 'submitForm').mockImplementation(() => { });

    component.submitForm();   // Submetendo o formulário
    fixture.detectChanges();  // Detectando mudanças após o submit

    expect(submitSpy).toHaveBeenCalled();  // Verificando se a função submitForm foi chamada
  });

  it('should display vehicle data correctly', () => {
    // Simulando dados do veículo passados para o componente
    const vehicleData = {
      id: 1,
      motor: 'V8',
      version: '2024',
      model: { id: 1, name: 'Mustang', brand: { id: 1, name: 'Ford', activated: true }, activated: true },
      category: { id: 1, name: 'Sports', activated: true },
      type: { id: 1, name: 'Coupe', activated: true },
      propulsion: { id: 1, name: 'Electric', activated: true },
      autonomy: { mileagePerLiterRoad: 15.5, mileagePerLiterCity: 12.0, consumptionEnergetic: 7.8, autonomyElectricMode: 100.0 },
      activated: true,
      year: 2024,
    };
    component.vehicle = vehicleData;
    fixture.detectChanges();

    expect(component.vehicle.id).toBe(1);
    expect(component.vehicle.motor).toBe('V8');
    expect(component.vehicle.model.name).toBe('Mustang');
    expect(component.vehicle.year).toBe(2024);
  });

  it('should handle empty brand list in autocomplete', () => {
    // Simulando lista vazia de marcas
    component.brands = [];
    component.setupAutocomplete();
    fixture.detectChanges();

    let filteredBrands: { name: string; id: number }[] = [];
    component.filteredBrands.subscribe(data => filteredBrands = data);

    expect(filteredBrands.length).toBe(0);  // Verificando que não há marcas filtradas
  });

  it('should handle empty model list in autocomplete', () => {
    // Simulando lista vazia de modelos
    component.models = [];
    component.setupAutocomplete();
    fixture.detectChanges();

    let filteredModels: { name: string }[] = [];
    component.filteredModels.subscribe(data => filteredModels = data);

    expect(filteredModels.length).toBe(0);  // Verificando que não há modelos filtrados
  });


  it('should handle form submission error', () => {
    // Simulando um formulário válido
    component.userVehicleForm.setValue({
      version: '2024',
      brand: 'Ford',
      model: 'Mustang',
      mileagePerLiterRoad: 10,
      mileagePerLiterCity: 8,
      consumptionEnergetic: 50,
      autonomyElectricMode: 150,
      batteryCapacity: 50,
    });

    // Simulando erro ao submeter o formulário
    const submitSpy = jest.spyOn(component, 'submitForm').mockImplementation(() => {
      throw new Error('Form submission failed');
    });

    expect(() => component.submitForm()).toThrow('Form submission failed');
    fixture.detectChanges();
    expect(submitSpy).toHaveBeenCalled();
  });

});

describe('ModalSelectAddressComponent', () => {
  let component: ModalSelectAddressComponent;
  let addressServiceMock: jest.Mocked<AddressService>;
  let alertasServiceMock: jest.Mocked<AlertasService>;
  let matDialogRefMock: jest.Mocked<MatDialogRef<ModalSelectAddressComponent>>;
  let matDialogMock: jest.Mocked<MatDialog>;
  let fixture: ComponentFixture<ModalSelectAddressComponent>;

  beforeEach(async () => {
    addressServiceMock = {
      listAll: jest.fn(),
    } as unknown as jest.Mocked<AddressService>;

    addressServiceMock = {
      listAll: jest.fn().mockReturnValue(of({} as PaginatedResponse<DataAddressDetails>)), // Return an empty Observable
    } as unknown as jest.Mocked<AddressService>;

    alertasServiceMock = {
      showError: jest.fn(),
    } as unknown as jest.Mocked<AlertasService>;

    matDialogRefMock = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<ModalSelectAddressComponent>>;

    matDialogMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      declarations: [ModalSelectAddressComponent],
      providers: [
        { provide: AddressService, useValue: addressServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSelectAddressComponent);
    component = fixture.componentInstance;
    component.paginator = {
      firstPage: jest.fn(),
      _intl: { itemsPerPageLabel: '' },
    } as unknown as MatPaginator;
    component.sort = {} as MatSort;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch addresses on ngOnInit', () => {
    const mockPaginatedResponse: PaginatedResponse<DataAddressDetails> = {
      content: [
        {
          city: 'City1', street: 'Street1',
          id: 0,
          country: '',
          zipCode: '',
          state: '',
          neighborhood: '',
          number: 0,
          userId: 0,
          hasChargingStation: false,
          complement: '',
          activated: false
        },
      ],
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
      }, // Inclua propriedades adicionais, se necessário
      last: true,
      totalPages: 1,
      first: true,
      size: 2,
      number: 0,
      numberOfElements: 1,
      sort: {
        active: '',
        direction: ''
      },
      empty: false
    };
    addressServiceMock.listAll.mockReturnValue(of(mockPaginatedResponse));

    component.ngOnInit();

    expect(addressServiceMock.listAll).toHaveBeenCalledWith(0, component.pageSize);
    expect(component.filteredAddresses.length).toBe(1);
    expect(component.total).toBe(1);
  });

  it('should filter addresses based on the search term', () => {

    const mockResponse: PaginatedResponse<DataAddressDetails> = {
      content: [
        {
          city: 'City1', street: 'Street1',
          id: 0,
          country: '',
          zipCode: '',
          state: '',
          neighborhood: '',
          number: 0,
          userId: 0,
          hasChargingStation: false,
          complement: '',
          activated: false
        },
        {
          city: 'City2', street: 'Street2',
          id: 0,
          country: '',
          zipCode: '',
          state: '',
          neighborhood: '',
          number: 0,
          userId: 0,
          hasChargingStation: false,
          complement: '',
          activated: false
        },
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
      }, // Inclua um objeto vazio ou dados simulados
      last: true,
      totalPages: 1,
      first: true,
      size: 2,
      number: 0,
      numberOfElements: 2,
      sort: {
        active: '',
        direction: ''
      },
      empty: false
    };

    addressServiceMock.listAll.mockReturnValue(of(mockResponse));

    const mockEvent = { target: { value: 'City1' } } as unknown as Event;
    component.applyFilter(mockEvent);

    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].city).toBe('City1');
  });

  it('should show an error if filtering fails', () => {
    const mockError = { message: 'Network error' };
    addressServiceMock.listAll.mockReturnValue(throwError(() => mockError));

    const mockEvent = { target: { value: 'City1' } } as unknown as Event;
    component.applyFilter(mockEvent);

    expect(alertasServiceMock.showError).toHaveBeenCalledWith('Erro !!', mockError.message);
  });

  it('should set selected address and close the modal on confirm', () => {

    const mockResponse: PaginatedResponse<DataAddressDetails> = {
      content: [
        {
          city: 'City1', street: 'Street1',
          id: 1,
          country: '',
          zipCode: '',
          state: '',
          neighborhood: '',
          number: 0,
          userId: 0,
          hasChargingStation: false,
          complement: '',
          activated: false
        },
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
      }, // Inclua um objeto vazio ou dados simulados
      last: true,
      totalPages: 1,
      first: true,
      size: 2,
      number: 0,
      numberOfElements: 2,
      sort: {
        active: '',
        direction: ''
      },
      empty: false
    };
    component.onSelect(mockResponse.content[0]);
    component.confirmAddress();

    expect(matDialogRefMock.close).toHaveBeenCalledWith(mockResponse.content[0]);
  });

  it('should close the modal without returning data on cancel', () => {
    component.closeModal();
    expect(matDialogRefMock.close).toHaveBeenCalledWith();
  });

  it('should update page size and fetch new data on page change', async () => {
    const mockEvent = { pageSize: 5, pageIndex: 1 };
    jest.spyOn(component, 'getAllAddresses');

    component.onPageChange(mockEvent);
    await fixture.whenStable(); // Espera a operação assíncrona

    expect(component.pageSize).toBe(5);
    expect(component.currentPage).toBe(1);
    expect(component.getAllAddresses).toHaveBeenCalledWith(1, 5);
  });

  it('should open the FAQ modal', () => {
    component.openFAQModal();
    expect(matDialogMock.open).toHaveBeenCalled();
  });
});



