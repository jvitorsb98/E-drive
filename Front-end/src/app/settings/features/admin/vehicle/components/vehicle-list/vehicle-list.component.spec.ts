import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleListComponent } from './vehicle-list.component';
import { VehicleService } from '../../../../../core/services/vehicle/vehicle.service';
import { AlertasService } from '../../../../../core/services/Alertas/alertas.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { of, throwError } from 'rxjs';
import { PaginatedResponse } from '../../../../../core/models/paginatedResponse';
import { Vehicle } from '../../../../../core/models/vehicle';
import { HttpErrorResponse } from '@angular/common/http';
import { IAutonomyRequest } from '../../../../../core/models/autonomy';

// Mocks para VehicleType e Propulsion
const vehicleTypeMock = { id: 1, name: 'SEDAN', activated: true };
const propulsionMock = { id: 1, name: 'PETROL', activated: true };

describe('VehicleListComponent', () => {
  let component: VehicleListComponent;
  let fixture: ComponentFixture<VehicleListComponent>;
  let vehicleService: jest.Mocked<VehicleService>;
  let alertService: jest.Mocked<AlertasService>;
  let dialog: jest.Mocked<MatDialog>;

  const vehicleMock: Vehicle = {
    id: 1,
    type: vehicleTypeMock,  // Usando o mock correto
    motor: '1.0',
    version: 'Versão 1',
    year: 2020,
    autonomy: {
      mileagePerLiterRoad: 15,
      mileagePerLiterCity: 10,
      consumptionEnergetic: 2,
      autonomyElectricMode: 100,
    } as IAutonomyRequest,
    propulsion: propulsionMock,  // Usando o mock correto
    model: { id: 1, name: 'Modelo 1', brand: { id: 1, name: 'Marca 1', activated: true }, activated: true },
    category: { id: 1, name: 'Categoria 1', activated: true },
    activated: true,
  };

  const paginatedResponseMock: PaginatedResponse<Vehicle> = {
    content: [vehicleMock],
    totalElements: 1,
    pageable: {
      pageNumber: 0,
      pageSize: 5,
      offset: 0,
      sort: {
        empty: false,
        sorted: false,
        unsorted: true,
      },
      paged: true,
      unpaged: false,
    },
    numberOfElements: 1,
    size: 5,
    sort: { active: '', direction: '' },  // Usando o MatSort correto
    totalPages: 1,
    last: true,
    first: true,
    number: 0,
    empty: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleListComponent],
      providers: [
        { provide: VehicleService, useValue: { getAll: jest.fn(), activate: jest.fn(), deactivate: jest.fn() } },
        { provide: AlertasService, useValue: { showError: jest.fn(), showSuccess: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn().mockReturnValue({ afterClosed: jest.fn().mockReturnValue(of(true)) }) } },
        { provide: MatPaginator, useValue: {} },
        { provide: MatSort, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleListComponent);
    component = fixture.componentInstance;
    vehicleService = TestBed.inject(VehicleService) as jest.Mocked<VehicleService>;
    alertService = TestBed.inject(AlertasService) as jest.Mocked<AlertasService>;
    dialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;

    // Mock para o método getAll do serviço VehicleService
    jest.spyOn(vehicleService, 'getAll').mockReturnValue(of(paginatedResponseMock));
    
    component.ngOnInit(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the list of vehicles on init', () => {
    component.getList(0, 5);
    expect(vehicleService.getAll).toHaveBeenCalledWith(0, 5);
    expect(component.dataSource.data).toEqual([vehicleMock]);
  });


  it('should activate a vehicle', () => {
    jest.spyOn(vehicleService, 'activate').mockReturnValue(of({}));

    component.activate(vehicleMock);
    expect(vehicleService.activate).toHaveBeenCalledWith(vehicleMock.id);
    expect(alertService.showSuccess).toHaveBeenCalledWith("Sucesso !!", "Ativado com sucesso");
  });

  it('should deactivate a vehicle', () => {
    jest.spyOn(vehicleService, 'deactivate').mockReturnValue(of({}));

    component.deactivate(vehicleMock);
    expect(vehicleService.deactivate).toHaveBeenCalledWith(vehicleMock.id);
    expect(alertService.showSuccess).toHaveBeenCalledWith("Sucesso !!", "Desativado com sucesso");
  });

  it('should open the add vehicle modal', () => {
    component.openModalAdd();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should open the edit vehicle modal', () => {
    component.openModalEdit(vehicleMock);
    expect(dialog.open).toHaveBeenCalledWith(expect.anything(), {
      width: '99%',
      height: '80%',
      data: vehicleMock,
    });
  });
  it('should fetch the list of vehicles on successful response', () => {
    jest.spyOn(vehicleService, 'getAll').mockReturnValue(of(paginatedResponseMock));

    component.getList(0, 5);

    expect(vehicleService.getAll).toHaveBeenCalledWith(0, 5);
    expect(component.dataSource.data).toEqual([vehicleMock]); // Verifica se a dataSource está correta
    expect(component.totalVehicles).toBe(1); // Verifica se totalVehicles está correto
  });

 

});
