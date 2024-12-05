import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalDetailsVehicleComponent } from './modal-details-vehicle.component';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { UserVehicle } from '../../../../core/models/user-vehicle';
import { Vehicle } from '../../../../core/models/vehicle';

describe('ModalDetailsVehicleComponent', () => {
  let component: ModalDetailsVehicleComponent;
  let fixture: ComponentFixture<ModalDetailsVehicleComponent>;
  let httpTestingController: HttpTestingController;
  let dialogRef: MatDialogRef<ModalDetailsVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDetailsVehicleComponent],
      imports: [HttpClientTestingModule],
      providers: [
        VehicleService,
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
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

    fixture = TestBed.createComponent(ModalDetailsVehicleComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    dialogRef = TestBed.inject(MatDialogRef);

    // Detecta mudanças e simula a requisição HTTP
    fixture.detectChanges();

    const mockVehicle: Vehicle = {
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

    // Espera a requisição do veículo
    const req = httpTestingController.expectOne('/api/backend/api/v1/vehicles/1');
    req.flush(mockVehicle);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    component.closeModal();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should load vehicle details correctly', () => {
    expect(component.vehicle).toBeTruthy();
    expect(component.vehicle.id).toBe(1);
    expect(component.vehicle.motor).toBe('V8');
    expect(component.vehicle.model.name).toBe('Mustang');
    expect(component.vehicle.year).toBe(2024);
  });

  it('should log an error if there is an issue loading vehicle details', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    component.loadVehicleDetails(2);
    const req = httpTestingController.expectOne('/api/backend/api/v1/vehicles/2');
    req.flush('Erro ao carregar detalhes do veículo', { status: 500, statusText: 'Server Error' });
    expect(consoleSpy).toHaveBeenCalledWith('Erro ao carregar detalhes do veículo:', expect.any(Object));
    consoleSpy.mockRestore();
  });

  it('should update vehicle details on subsequent API calls', () => {
    const mockVehicle = { id: 1, motor: 'V8', version: '2025' } as Vehicle;
    component.loadVehicleDetails(1);
    let req = httpTestingController.expectOne('/api/backend/api/v1/vehicles/1');
    req.flush(mockVehicle);
    expect(component.vehicle.version).toBe('2025');

    const updatedMockVehicle = { id: 1, motor: 'V8', version: '2026' } as Vehicle;
    component.loadVehicleDetails(1);
    req = httpTestingController.expectOne('/api/backend/api/v1/vehicles/1');
    req.flush(updatedMockVehicle);
    expect(component.vehicle.version).toBe('2026');
  });
});
