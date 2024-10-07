import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ModalFormVehicleComponent } from './modal-form-vehicle.component';
import { BrandService } from '../../../../../core/services/brand/brand.service';
import { CategoryService } from '../../../../../core/services/category/category.service';
import { ModelService } from '../../../../../core/services/model/model.service';
import { PropusionService } from '../../../../../core/services/propusion/propusion.service';
import { TypeVehicleService } from '../../../../../core/services/typeVehicle/type-vehicle.service';
import { VehicleService } from '../../../../../core/services/vehicle/vehicle.service';
import Swal from 'sweetalert2';
import { Vehicle } from '../../../../../core/models/vehicle';
import { Category } from '../../../../../core/models/category';
import { Model } from '../../../../../core/models/model';

describe('ModalFormVehicleComponent', () => {
  let component: ModalFormVehicleComponent;
  let fixture: ComponentFixture<ModalFormVehicleComponent>;
  let brandServiceMock: Partial<BrandService>;
  let categoryServiceMock: Partial<CategoryService>;
  let modelServiceMock: Partial<ModelService>;
  let propulsionServiceMock: Partial<PropusionService>;
  let typeVehicleServiceMock: Partial<TypeVehicleService>;
  let vehicleServiceMock: Partial<VehicleService>;

  const mockVehicle: Vehicle = {
    id: 1,
    motor: 'Motor A',
    version: 'Version A',
    model: { id: 1, name: 'Model A', brand: { id: 1, name: 'Brand A', activated: true }, activated: true },
    category: { id: 1, name: 'Category A', activated: true },
    type: { id: 1, name: 'Type A', activated: true },
    propulsion: { id: 1, name: 'Propulsion A', activated: true },
    autonomy: {
      mileagePerLiterCity: 10,
      mileagePerLiterRoad: 12,
      consumptionEnergetic: 15,
      autonomyElectricMode: 20,
    },
    year: 2022,
    activated: true,
  };

  beforeEach(async () => {
    // Mock dos serviços
    brandServiceMock = {
      getAll: jest.fn().mockReturnValue(of({ content: [{ id: 1, name: 'Brand A' }] })),
    };

    categoryServiceMock = {
      getAll: jest.fn().mockReturnValue(of({ content: [{ id: 1, name: 'Category A' }] })),
    };

    modelServiceMock = {
      getModelsByBrandId: jest.fn().mockReturnValue(of({ content: [{ id: 1, name: 'Model A' }] })),
    };

    propulsionServiceMock = {
      getAll: jest.fn().mockReturnValue(of({ content: [{ id: 1, name: 'Propulsion A' }] })),
    };

    typeVehicleServiceMock = {
      getAll: jest.fn().mockReturnValue(of({ content: [{ id: 1, name: 'Type A' }] })),
    };

    vehicleServiceMock = {
      register: jest.fn(),
      update: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ModalFormVehicleComponent],
      providers: [
        { provide: BrandService, useValue: brandServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: ModelService, useValue: modelServiceMock },
        { provide: PropusionService, useValue: propulsionServiceMock },
        { provide: TypeVehicleService, useValue: typeVehicleServiceMock },
        { provide: VehicleService, useValue: vehicleServiceMock },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { motor: '', version: '', model: {}, category: {}, type: {}, propulsion: {}, autonomy: {}, year: 2022, activated: true } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFormVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form correctly', () => {
    component.ngOnInit();
    expect(component.vehicleForm).toBeTruthy();
    expect(component.vehicleForm.get('motor')).toBeTruthy();
  });

  it('should load brands on init', () => {
    component.ngOnInit();
    expect(brandServiceMock.getAll).toHaveBeenCalled();
    expect(component.brands.length).toBeGreaterThan(0);
  });

  it('should load categories on init', () => {
    component.ngOnInit();
    expect(categoryServiceMock.getAll).toHaveBeenCalled();
    expect(component.categories.length).toBeGreaterThan(0);
  });

  it('should load models when a brand is selected', () => {
    component.ngOnInit();
    component.vehicleForm.get('brand')?.setValue('Brand A');
    expect(modelServiceMock.getModelsByBrandId).toHaveBeenCalledWith(1); // Verifique se o ID da marca está correto
  });

  it('should submit the form and call register', async () => {
    component.ngOnInit();
    component.vehicleForm.patchValue({
      motor: 'Motor A',
      version: 'Version A',
      brand: 'Brand A',
      model: 'Model A',
      category: 'Category A',
      type: 'Type A',
      propulsion: 'Propulsion A',
      mileagePerLiterCity: 10,
      mileagePerLiterRoad: 12,
      consumptionEnergetic: 15,
      autonomyElectricMode: 20,
      year: 2022,
    });

    jest.spyOn(vehicleServiceMock, 'register').mockReturnValue(of(mockVehicle)); // Simule sucesso na resposta

    await component.submitForm();

    expect(vehicleServiceMock.register).toHaveBeenCalled();
  });

  it('should close the dialog on reset', () => {
    component.closeModal();
    expect(TestBed.inject(MatDialogRef).close).toHaveBeenCalled();
  });
});
