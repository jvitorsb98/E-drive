import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalFormVehicleComponent } from './modal-form-vehicle.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { BrandService } from '../../../../../core/services/brand/brand.service';
import { VehicleService } from '../../../../../core/services/vehicle/vehicle.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockService } from 'ng-mocks';
import Swal from 'sweetalert2';
import { Vehicle } from '../../../../../core/models/vehicle';

// Mock do BrandService
class MockBrandService {
  getAll() {
    return of({ content: [{ id: 1, name: 'Brand 1' }, { id: 2, name: 'Brand 2' }] });
  }
}

// Mock do VehicleService
class MockVehicleService {
  register(vehicleData: any) {
    return of({}); // Simule a resposta do registro
  }

  update(id: number, vehicleData: any) {
    return of({}); // Simule a resposta da atualização
  }
}

// Mock do MatDialogRef
class MockMatDialogRef {
  close() {}
}

// Dados do mock do diálogo
const mockDialogData = {
  motor: 'V8',
  version: '2023',
  model: { brand: { name: 'Brand 1' }, name: 'Model 1' },
  category: { name: 'Category 1' },
  type: { name: 'Type 1' },
  propulsion: { name: 'Propulsion 1' },
  autonomy: {
    mileagePerLiterCity: 10,
    mileagePerLiterRoad: 15,
    consumptionEnergetic: 7.8,
    autonomyElectricMode: 100,
  },
  year: 2023,
  activated: true,
};

describe('ModalFormVehicleComponent', () => {
  let component: ModalFormVehicleComponent;
  let fixture: ComponentFixture<ModalFormVehicleComponent>;
  let vehicleService: VehicleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ModalFormVehicleComponent],
      providers: [
        { provide: BrandService, useClass: MockBrandService },
        { provide: VehicleService, useClass: MockVehicleService },
        { provide: MatDialogRef, useClass: MockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFormVehicleComponent);
    component = fixture.componentInstance;
    vehicleService = TestBed.inject(VehicleService);
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });

});
