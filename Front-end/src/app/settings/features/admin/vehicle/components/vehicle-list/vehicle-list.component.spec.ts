import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleListComponent } from './vehicle-list.component';
import { VehicleService } from '../../../../../core/services/vehicle/vehicle.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertasService } from '../../../../../core/services/Alertas/alertas.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { last, of, throwError } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Vehicle } from '../../../../../core/models/vehicle';
import { Model } from '../../../../../core/models/model';
import { Category } from '../../../../../core/models/category';
import { Propulsion } from '../../../../../core/models/propulsion';
import { IAutonomyRequest } from '../../../../../core/models/autonomy';
import { Brand } from '../../../../../core/models/brand';
import { VehicleType } from '../../../../../core/models/vehicle-type'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginatedResponse } from '../../../../../core/models/paginatedResponse';
import { By } from '@angular/platform-browser';

// Mock dos serviços
class MockVehicleService {
  getAll(pageIndex: number, pageSize: number) {
    return of({ content: [], totalElements: 0 });
  }
  deactivate(vehicle: Vehicle) {
    return of({});
  }

  // Adicione o método 'activate' mockado
  activate(vehicle: Vehicle) {
    return of({});
  }
}
const brandMock: Brand = {
    id: 1,
    name: 'Tesla',
    activated: false
};
// VehicleTypeEnum.ts
const vehicleType: VehicleType = {
    id: 1,
    name: 'Gasoline',
    activated: true
  };
  
const category: Category = {
    id: 1,
    name: "SUV" // ou o valor apropriado
    ,
    activated: false
};
const mockAlertasService = {
    showError: jest.fn(),
    showSuccess: jest.fn(),
    showWarning: jest.fn().mockReturnValue(Promise.resolve(true))  // Mock do showWarning
  };
class MockAlertasService {
 showError = jest.fn();  // Tornando showError um mock
showSuccess = jest.fn();  // Tornando showSuccess um mock
  showWarning(message: string, description: string, confirmButtonText: string, cancelButtonText: string): Promise<boolean> {
    return Promise.resolve(true); // Retorna sempre 'true' para simular uma confirmação positiva
  }
  
}

class MockMatDialog {
  open() {
    return { afterClosed: () => of() };
  }
}


describe('VehicleListComponent', () => {
  let component: VehicleListComponent;
  let fixture: ComponentFixture<VehicleListComponent>;
  let vehicleService: VehicleService;
  let alertasService: AlertasService;
  let matDialog: MatDialog;

  const modelMock: Model = {
    id: 12345,
    name: 'Model X',
    brand: brandMock,
    activated: true,
  };
  
  
  const categoryMock: Category = {
      id: 54321,
      name: 'SUV',
      activated: false
  };
  
  const propulsionMock: Propulsion = {
    id: 6789,
    name: 'Electric',
    activated: true,
  };
  
  const autonomyMock: IAutonomyRequest = {
    mileagePerLiterRoad: 15.5,
    mileagePerLiterCity: 12.0,
    consumptionEnergetic: 7.8,
    autonomyElectricMode: 100.0,
  };
  
  // Agora o mock do Vehicle, com tipos corretos
  const vehicleMock: Vehicle = {
    id: 1,
    version: 'Sport',
    motor: 'V6 Turbo',
    model: modelMock,
    category: categoryMock,   // Assumindo que você tem um tipo simples para categoria
    type:  vehicleType, // Exemplo de uso de um enum VehicleType
    propulsion: propulsionMock,
    autonomy: {
      mileagePerLiterRoad: 15.5,
      mileagePerLiterCity: 12.0,
      consumptionEnergetic: 7.8,
      autonomyElectricMode: 100.0,
    },
    activated: true,
    year: 2023,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleListComponent],
      imports: [HttpClientTestingModule, MatPaginatorModule, MatSortModule,  BrowserAnimationsModule ],
      providers: [
        { provide: VehicleService, useClass: MockVehicleService },
        { provide: AlertasService, useClass: MockAlertasService },
        { provide: MatDialog, useClass: MockMatDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Impede erros de template caso algum componente não seja importado
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleListComponent);
    component = fixture.componentInstance;
    vehicleService = TestBed.inject(VehicleService);
    alertasService = TestBed.inject(AlertasService);
    matDialog = TestBed.inject(MatDialog);

    // Simula a inicialização da tabela e paginator
   component.dataSource = new MatTableDataSource<Vehicle>([]);

    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadVehicles on init', () => {
    const spy = jest.spyOn(component, 'loadVehicles');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });



  it('should update data source when vehicles are loaded', (done) => {
    const mockVehicles: Vehicle[] = [
      {
          id: 1,
          version: 'Mock Vehicle',
          motor: '2.0L',
          year: 2023,

          category: {
              id: 54321,
              name: 'SUV',
              activated: false
          },
          model: {
              id: 12345,
              name: 'Model X',
              activated: true,
              brand: {
                  id: 1,
                  name: 'Tesla',
                  activated: false
              }
          },
          propulsion: {
              id: 6789,
              name: 'Electric',
              activated: true
          },
          type: {
              id: 1,
              name: 'Gasoline',
              activated: true
          },
          autonomy: {
            mileagePerLiterRoad: 15.5,
            mileagePerLiterCity: 12.0,
            consumptionEnergetic: 7.8,
            autonomyElectricMode: 100.0,
          },
          activated: false
      }
    ];
  
    const mockResponse: PaginatedResponse<Vehicle> = {
      content: mockVehicles,
      pageable: {
          pageNumber: 0,
          pageSize: 10,
          offset: 0,
          paged: true,
          unpaged: false,
          sort: {
              empty: false,
              sorted: false,
              unsorted: false
          }
      },
      last: true,
      totalPages: 1,
      totalElements: 1,
      first: true,
      size: 10,
      number: 0,
      sort: { active: 'version', direction: 'asc' },
      numberOfElements: 1,
      empty: false
    };
  
    // Mockando o método getAll do serviço
    jest.spyOn(vehicleService, 'getAll').mockReturnValue(of(mockResponse));
  
    // Chama o método que vai carregar os veículos
    component.loadVehicles(0, 10);
  
    fixture.detectChanges();  // Atualiza a fixture após a chamada assíncrona
  
    // Verifica se a dataSource foi atualizada corretamente
    expect(component.dataSource.data).toEqual(mockVehicles);
    done();  // Finaliza o teste assíncrono
  });
  


  it('should handle filter input correctly', () => {
    const filterEvent: InputEvent = { target: { value: 'Mock Vehicle' } } as unknown as InputEvent;
    const spy = jest.spyOn(component, 'applyFilter');
    component.applyFilter(filterEvent);
    expect(spy).toHaveBeenCalled();
    expect(component.filterValueName).toBe('mock vehicle');
  });

  it('should handle page change correctly', () => {
    const pageEvent = { pageSize: 10, pageIndex: 1 };
    const spy = jest.spyOn(component, 'onPageChange');
    component.onPageChange(pageEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should open modal view on openModalView', () => {
    const vehicle = { id: 1, version: 'Mock Vehicle' };
    const dialogSpy = jest.spyOn(matDialog, 'open');
    component.openModalView(vehicleMock);
    expect(dialogSpy).toHaveBeenCalled();
  });

 it('should activate and deactivate vehicle correctly', async () => {
  // Use o mock completo do vehicle, que possui todas as propriedades do tipo Vehicle
  const vehicle = vehicleMock;

  // Mocking the deactivate and activate methods
  const spyDeactivate = jest.spyOn(vehicleService, 'deactivate').mockReturnValue(of({}));
  const spyActivate = jest.spyOn(vehicleService, 'activate').mockReturnValue(of({}));

  // Mocking the alert service methods (including showWarning)
  const alertSpy = jest.spyOn(alertasService, 'showSuccess');
  const warningSpy = jest.spyOn(alertasService, 'showWarning').mockReturnValue(Promise.resolve(true)); // Mocking showWarning

  // Test deactivate
  component.deactivate(vehicle);
  fixture.detectChanges();  // Espera a operação assíncrona de desativação
  await fixture.whenStable(); // Espera a estabilização da operação assíncrona

  expect(spyDeactivate).toHaveBeenCalledWith(vehicle.id);
  expect(alertSpy).toHaveBeenCalledWith('Sucesso !!', 'Veículo desativado com sucesso!');
  expect(warningSpy).toHaveBeenCalled();  // Verifica se showWarning foi chamado

  // Test activate
  component.activate(vehicle);
  fixture.detectChanges();  // Espera a operação assíncrona de ativação
  await fixture.whenStable(); // Espera a estabilização da operação assíncrona

  expect(spyActivate).toHaveBeenCalledWith(vehicle.id);
  expect(alertSpy).toHaveBeenCalledWith('Sucesso !!', 'Veículo ativado com sucesso!');
  expect(warningSpy).toHaveBeenCalled();  // Verifica se showWarning foi chamado
});

  
it('should handle empty response correctly', (done) => {
    const mockResponse: PaginatedResponse<Vehicle> = {
      content: [],
      pageable: {
          pageNumber: 0, pageSize: 10, offset: 0, paged: true, unpaged: false,
          sort: {
              empty: false,
              sorted: false,
              unsorted: false
          }
      },
      last: true,
      totalPages: 1,
      totalElements: 0,
      first: true,
      size: 10,
      number: 0,
      sort: { active: 'version', direction: 'asc' },
      numberOfElements: 0,
      empty: true
    };
  
    jest.spyOn(vehicleService, 'getAll').mockReturnValue(of(mockResponse));
    
    component.loadVehicles(0, 10);
    
    fixture.detectChanges();
    
    expect(component.dataSource.data.length).toBe(0); // Espera que a dataSource esteja vazia
    done();
  });
  it('should handle error response correctly', async () => {
    jest.spyOn(vehicleService, 'getAll').mockReturnValue(throwError({ message: 'Error occurred' }));
  
    // Chama o método que carrega os veículos
    component.loadVehicles(0, 10);
  
    fixture.detectChanges();
  
    await fixture.whenStable(); // Espera a operação assíncrona terminar
  
    // Verifica se o alerta de erro foi mostrado com a mensagem correta
    expect(alertasService.showError).toHaveBeenCalledWith('Erro !!', 'Error occurred');
  });
  

  
  
  it('should show error when deactivation fails', async () => {
    const vehicle = vehicleMock;
  
    // Simula falha na desativação
    jest.spyOn(vehicleService, 'deactivate').mockReturnValue(throwError({ message: 'Deactivation failed' }));
  
    component.deactivate(vehicle);
    fixture.detectChanges();
  
    await fixture.whenStable();
  
    // Verifica se o erro foi mostrado com a mensagem correta
    expect(alertasService.showError).toHaveBeenCalledWith('Erro !!', 'Deactivation failed');
  });
  
  
  it('should show error when activation fails', async () => {
    const vehicle = vehicleMock;
  
    // Simula falha na ativação
    jest.spyOn(vehicleService, 'activate').mockReturnValue(throwError({ message: 'Activation failed' }));
  
    component.activate(vehicle);
    fixture.detectChanges();
  
    await fixture.whenStable();
  
    // Verifica se o erro foi mostrado com a mensagem retornada pelo serviço
    expect(alertasService.showError).toHaveBeenCalledWith('Erro !!', 'Activation failed');
  });
  
  
  it('should initialize paginator correctly', () => {
    const paginator = fixture.debugElement.query(By.directive(MatPaginator));
    expect(paginator).toBeTruthy();
  });
  
  it('should handle paginator page changes correctly', () => {
    const pageEvent = { pageIndex: 2, pageSize: 10 };
    const spy = jest.spyOn(component, 'onPageChange');
    component.onPageChange(pageEvent);
    expect(spy).toHaveBeenCalledWith(pageEvent);
  });
  it('should not filter vehicles if filter value is empty', () => {
    const filterEvent: InputEvent = { target: { value: '' } } as unknown as InputEvent;
    component.applyFilter(filterEvent);
  
    // Aqui, esperamos que o número de veículos filtrados seja igual ao número total de veículos.
    expect(component.dataSource.filteredData.length).toBe(component.dataSource.data.length);
  });
  
  
  it('should not call activate if vehicle is already activated', async () => {
    const vehicleAlreadyActivated: Vehicle = { ...vehicleMock, activated: true };
    const spyActivate = jest.spyOn(vehicleService, 'activate');
    
    component.activate(vehicleAlreadyActivated);
    fixture.detectChanges();
  
    expect(spyActivate).not.toHaveBeenCalled();
  });
  
  it('should not call deactivate if vehicle is already deactivated', async () => {
    const vehicleAlreadyDeactivated: Vehicle = { ...vehicleMock, activated: false };
    const spyDeactivate = jest.spyOn(vehicleService, 'deactivate');
    
    component.deactivate(vehicleAlreadyDeactivated);
    fixture.detectChanges();
  
    expect(spyDeactivate).not.toHaveBeenCalled();
  });
  

  it('should display an error message if vehicle load fails', async () => {
    jest.spyOn(vehicleService, 'getAll').mockReturnValue(throwError({ message: 'Error loading vehicles' }));
  
    component.loadVehicles(0, 10);
    fixture.detectChanges();
  
    await fixture.whenStable();  // Espera a estabilidade do componente após a operação assíncrona
  
    // Verifica se o serviço de alertas foi chamado com a mensagem de erro correta
    expect(alertasService.showError).toHaveBeenCalledWith('Erro !!', 'Error loading vehicles');
  });
  
  
});

