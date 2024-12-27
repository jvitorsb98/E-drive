import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ModalFormVehicleComponent } from './modal-form-vehicle.component';
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

describe('ModalFormVehicleComponent', () => {
  let component: ModalFormVehicleComponent;
  let fixture: ComponentFixture<ModalFormVehicleComponent>;
  let dialogRef: MatDialogRef<ModalFormVehicleComponent>;

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
  
});
