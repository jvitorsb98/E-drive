import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ModalFormVehicleBatteryComponent } from './modal-form-vehicle-battery.component';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { BatteryService } from '../../../../core/services/trip-planner-maps/baterry/battery.service';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { TripPlannerMapsService } from '../../../../core/services/trip-planner-maps/trip-planner-maps.service';
import { Vehicle } from '../../../../core/models/vehicle';
import { UserVehicle } from '../../../../core/models/user-vehicle';

import { of } from 'rxjs';

// Importar os módulos necessários do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '../../../../shared/shared.module';
import { IPageable } from '../../../../core/models/pageable';

describe('ModalFormVehicleBatteryComponent', () => {
  let component: ModalFormVehicleBatteryComponent;
  let fixture: ComponentFixture<ModalFormVehicleBatteryComponent>;
  let dialogRef: MatDialogRef<ModalFormVehicleBatteryComponent>;

  beforeEach(async () => {
    const mockData = {
      vehicle: { id: 1, motor: 'Electric', version: '2024', model: { id: 1, name: 'Model', brand: { name: 'Brand' }, activated: true }, autonomy: { autonomyElectricMode: 100, consumptionEnergetic: 7.8 } },
      userVehicle: { vehicleId: 1 },
      place: {
        selectedVehicle: null,
        bateriaRestante: 50,
        saudeBateria: 'Good',
      },
    };

    // Mock de dados para UserVehicle com todos os campos necessários
    const mockUserVehicle: UserVehicle = {
      id: 1,
      userId: 123,
      vehicleId: 1,
      mileagePerLiterRoad: 12,
      mileagePerLiterCity: 10,
      consumptionEnergetic:0.5,
      batteryCapacity: 50,
      autonomyElectricMode: 100,
      activated:true
    };

    await TestBed.configureTestingModule({
      declarations: [ModalFormVehicleBatteryComponent],
      imports: [
        HttpClientTestingModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        BrowserAnimationsModule,
        SharedModule
      ],
      providers: [
        FormBuilder,
        {
          provide: UserVehicleService,
          useValue: {
            getAllUserVehicle: jest.fn().mockReturnValue(of({
              content: [mockUserVehicle],  // Agora, o mock inclui todos os campos de UserVehicle
              pageable: {} as IPageable,  // Mock de informações de paginação
              last: true,
              totalPages: 1,
              totalElements: 1,
              number: 1,
              numberOfElements: 1,
              size: 1,
              sort: { empty: false, sorted: true, unsorted: false },
              first: true,
              empty: false,
            })), // Mock retornando um Observable do tipo IApiResponse
          },
        },
        {
          provide: BatteryService,
          useValue: {
            calculateBatteryStatus: jest.fn().mockReturnValue({
              canCompleteTrip: true,
              batteryPercentageAfterTrip: 50,
            }),
          },
        },
        {
          provide: VehicleService,
          useValue: {
            getVehicleDetails: jest.fn().mockReturnValue({
              vehicleId: 1,
              model: { name: 'Model', brand: { name: 'Brand' } },
            }),
          },
        },
        {
          provide: TripPlannerMapsService,
          useValue: {
            calculateChargingStations: jest.fn().mockResolvedValue({
              chargingStationsMap: [],
              canCompleteTrip: true,
              canCompleteWithoutStops: true,
              batteryPercentageAfterTrip: 50,
            }),
          },
        },
        {
          provide: AlertasService,
          useValue: {
            showInfo: jest.fn(),
            showError: jest.fn(),
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockData, // Mocka o valor de MAT_DIALOG_DATA aqui
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFormVehicleBatteryComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    component.closeModal();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should update place data from MAT_DIALOG_DATA', () => {
    // Verifica se os dados de MAT_DIALOG_DATA foram atribuídos corretamente
    expect(component.data.place.bateriaRestante).toBe(50);
    expect(component.data.place.saudeBateria).toBe('Good');
  });

  it('should load vehicle details and update dataSource', () => {
    const mockUserVehicle: UserVehicle = {
      id: 1,
      userId: 123,
      vehicleId: 1,
      mileagePerLiterRoad: 12,
      mileagePerLiterCity: 10,
      consumptionEnergetic: 0.5,
      batteryCapacity: 50,
      autonomyElectricMode: 100,
      activated: true,
    };
    
    const mockVehicleDetails: Vehicle = {
      id: 1,
      motor: 'Electric',
      version: '2024',
      model: {
        id: 12345,  // Substitua pelo ID correto do modelo
        name: 'Model',
        brand: {id:1 , name: 'Brand' , activated:true},
        activated: true,  // Definido conforme a interface Model
      },
      category: {
        id: 54321,  // Substitua pelo ID correto da categoria
        name: 'SUV',  // Exemplo de nome de categoria
        activated:true
      },
      type: {
        id: 9876,  // Substitua pelo ID correto do tipo
        name: 'Electric',  // Exemplo de tipo
        activated:true
      },
      propulsion: {
        id: 6789,  // Substitua pelo ID correto da propulsão
        name: 'Electric',  // Exemplo de tipo de propulsão
        activated:true
      },
      autonomy: {
        mileagePerLiterRoad: 15.5,  // Substitua com o valor correto
        mileagePerLiterCity: 12.0,  // Substitua com o valor correto
        consumptionEnergetic: 7.8,  // Substitua com o valor correto
        autonomyElectricMode: 100.0,  // Substitua com o valor correto
      },
      activated: true,
      year: 2023,
    };
    
    // Usa TestBed para acessar o serviço injetado
    const userVehicleService = TestBed.inject(UserVehicleService);
    const vehicleService = TestBed.inject(VehicleService);

    // Mocka os retornos dos serviços
    jest.spyOn(userVehicleService, 'getAllUserVehicle').mockReturnValue(of({
      content: [mockUserVehicle],
      pageable: {} as IPageable,  // Mock de informações de paginação
      last: true,
      totalPages: 1,
      totalElements: 1,
      number: 1,
      numberOfElements: 1,
      size: 1,
      sort: { empty: false, sorted: true, unsorted: false },
      first: true,
      empty: false,
    }));

    jest.spyOn(vehicleService, 'getVehicleDetails').mockReturnValue(of(mockVehicleDetails));

    // Chama o método loadVehicleDetails
    component.loadVehicleDetails();

    // Verifica se os detalhes do veículo foram carregados corretamente
    expect(component.userVehicleDetails.length).toBe(1);
    expect(component.dataSource.data.length).toBe(1);
  });


  it('should apply filter correctly', () => {
    // Prepara dados fictícios para aplicar o filtro
    component.dataSource.data = [
      {
        id: 1,  // Propriedade do tipo Vehicle
        motor: 'Electric',  // Exemplo de motor
        version: 'V1',  // Exemplo de versão
        model: { id: 1, name: 'Model A', brand: { id: 1, name: 'Brand A', activated: true }, activated: true },
        category: { id: 1, name: 'Category A', activated: true },
        type: { id: 1, name: 'Type A', activated: true },
        propulsion: { id: 1, name: 'Propulsion A', activated: true },
        autonomy: { mileagePerLiterRoad: 12, mileagePerLiterCity: 10, consumptionEnergetic: 0.5, autonomyElectricMode: 100 },
        activated: true,
        year: 2023,
        userVehicle: {
          id: 1,
          userId: 123,
          vehicleId: 1,  // Exemplo de vehicleId
          mileagePerLiterRoad: 12,
          mileagePerLiterCity: 10,
          consumptionEnergetic: 0.5,
          batteryCapacity: 50,
          autonomyElectricMode: 100,
          activated: true
        }
      },
      {
        id: 2,  // Propriedade do tipo Vehicle
        motor: 'Hybrid',  // Exemplo de motor
        version: 'V2',  // Exemplo de versão
        model: { id: 2, name: 'Model B', brand: { id: 2, name: 'Brand B', activated: true }, activated: true },
        category: { id: 2, name: 'Category B', activated: true },
        type: { id: 2, name: 'Type B', activated: true },
        propulsion: { id: 2, name: 'Propulsion B', activated: true },
        autonomy: { mileagePerLiterRoad: 15, mileagePerLiterCity: 12, consumptionEnergetic: 0.6, autonomyElectricMode: 120 },
        activated: true,
        year: 2023,
        userVehicle: {
          id: 2,
          userId: 123,
          vehicleId: 2,  // Exemplo de vehicleId
          mileagePerLiterRoad: 15,
          mileagePerLiterCity: 12,
          consumptionEnergetic: 0.6,
          batteryCapacity: 55,
          autonomyElectricMode: 120,
          activated: true
        }
      }
    ];
  
    // Simula a filtragem por um valor que deve corresponder ao vehicleId 2
    const filterValue = 'Brand A';

    // Cria um objeto de evento com a propriedade target
    const event = { target: { value: filterValue } } as unknown as InputEvent;
  
    // Chama o método applyFilter com o evento
    component.applyFilter(event);
  
  
    // Espera que o dataSource tenha apenas o item que corresponde ao filtro
    expect(component.dataSource.filteredData.length).toBe(2);
    expect(component.dataSource.filteredData[0].userVehicle.vehicleId).toBe(1);
  });
  
  
});
