import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleListComponent } from './vehicle-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { VehicleService } from '../../../../../core/services/vehicle/vehicle.service';
import { AlertasService } from '../../../../../core/services/Alertas/alertas.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('VehicleListComponent', () => {
  let component: VehicleListComponent;
  let fixture: ComponentFixture<VehicleListComponent>;
  let vehicleServiceMock: any;
  let alertasServiceMock: any;
  let dialogMock: any;
  let paginatorMock: any;

  beforeEach(async () => {
    // Mock do serviço VehicleService
    vehicleServiceMock = {
        getAll: jest.fn().mockReturnValue(of({
          content: [{ id: 1, name: 'Toyota Corolla', mark: 'Toyota', model: 'Corolla', version: '2020', activated: true }], 
          totalElements: 1,
        })),
        deactivate: jest.fn().mockReturnValue(of({})),
        activate: jest.fn().mockReturnValue(of({})),
      };
      

    // Mock do serviço AlertasService
    alertasServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
      showWarning: jest.fn().mockResolvedValue(true),
    };

    // Mock do MatDialog
    dialogMock = {
      open: jest.fn().mockReturnValue({ afterClosed: () => of(true) }),
    };

    // Mock do MatPaginator
    paginatorMock = {
      page: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatTableModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatIconModule,
        MatSortModule,
      ],
      declarations: [VehicleListComponent],
      providers: [
        { provide: MatPaginator, useValue: paginatorMock },
        { provide: VehicleService, useValue: vehicleServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Adiciona o NO_ERRORS_SCHEMA aqui
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open a modal to add a vehicle and reload data after closing', () => {
    component.openModalAdd();

    // Verifica se o modal foi aberto
    expect(dialogMock.open).toHaveBeenCalled();
    
    // Espera o método getAll ser chamado para recarregar a lista de veículos
    expect(vehicleServiceMock.getAll).toHaveBeenCalled();
  });

  it('should apply filter and update table data', () => {
    const filterEvent = new Event('input') as InputEvent;
    Object.defineProperty(filterEvent, 'target', {
      value: { value: 'Toyota' },
    });

    component.applyFilter(filterEvent);

    // Espera que o serviço `getAll` seja chamado após o filtro
    expect(vehicleServiceMock.getAll).toHaveBeenCalled();
    
    // Espera que a tabela de dados tenha sido atualizada
    expect(component.dataSource.data.length).toBeGreaterThan(0);
  });
});