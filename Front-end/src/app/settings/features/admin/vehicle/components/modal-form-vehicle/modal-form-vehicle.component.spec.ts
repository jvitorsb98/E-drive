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
import { Vehicle } from '../../../../../core/models/vehicle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('ModalFormVehicleComponent', () => {
  let component: ModalFormVehicleComponent;
  let fixture: ComponentFixture<ModalFormVehicleComponent>;
  let brandServiceMock: Partial<BrandService>;
  let categoryServiceMock: Partial<CategoryService>;
  let modelServiceMock: Partial<ModelService>;
  let propulsionServiceMock: Partial<PropusionService>;
  let typeVehicleServiceMock: Partial<TypeVehicleService>;
  let vehicleServiceMock: Partial<VehicleService>;
  let matDialogRefMock: MatDialogRef<ModalFormVehicleComponent>;

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
    matDialogRefMock = { close: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatAutocompleteModule],
      declarations: [ModalFormVehicleComponent],
      providers: [
        { provide: BrandService, useValue: brandServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: ModelService, useValue: modelServiceMock },
        { provide: PropusionService, useValue: propulsionServiceMock },
        { provide: TypeVehicleService, useValue: typeVehicleServiceMock },
        { provide: VehicleService, useValue: vehicleServiceMock },
        { provide: MatDialogRef, useValue: matDialogRefMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: null, // Simula criação sem dados existentes
        },
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
    expect(component.vehicleForm).toBeTruthy();
    expect(component.vehicleForm.get('motor')).toBeTruthy();
  });

  it('should load categories on init', () => {
    component.ngOnInit();
    expect(categoryServiceMock.getAll).toHaveBeenCalled();
    expect(component.categories).toEqual([{ id: 1, name: 'Category A' }]);
  });

  it('should handle errors when loading models', () => {
    jest.spyOn(modelServiceMock, 'getModelsByBrandId').mockReturnValue(throwError(() => new Error('Error loading models')));
    component.vehicleForm.get('brand')?.setValue({ id: 1, name: 'Brand A' });
    expect(component.models.length).toBe(0);
  });

  it('should call register on form submit', async () => {
    component.vehicleForm.patchValue({
      motor: 'Motor A',
      version: 'Version A',
      brand: { id: 1, name: 'Brand A' },
      model: { id: 1, name: 'Model A' },
      category: { id: 1, name: 'Category A' },
      type: { id: 1, name: 'Type A' },
      propulsion: { id: 1, name: 'Propulsion A' },
      mileagePerLiterCity: 10,
      mileagePerLiterRoad: 12,
      consumptionEnergetic: 15,
      autonomyElectricMode: 20,
      year: 2022,
    });

    jest.spyOn(vehicleServiceMock, 'register').mockReturnValue(of(mockVehicle));

    await component.submitForm();

    expect(vehicleServiceMock.register).toHaveBeenCalledWith(expect.objectContaining({ motor: 'Motor A' }));
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should close the dialog on cancel', () => {
    component.closeModal();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should mark the form as invalid if required fields are missing', () => {
    component.vehicleForm.get('motor')?.setValue('');  // Campo motor vazio
    component.vehicleForm.get('brand')?.setValue(null); // Marca não selecionada
    expect(component.vehicleForm.valid).toBeFalsy();
  });

  it('should mark the form as valid when all fields are filled correctly', () => {
    component.vehicleForm.patchValue({
      motor: 'Motor A',
      version: 'Version A',
      brand: { id: 1, name: 'Brand A' },
      model: { id: 1, name: 'Model A' },
      category: { id: 1, name: 'Category A' },
      type: { id: 1, name: 'Type A' },
      propulsion: { id: 1, name: 'Propulsion A' },
      mileagePerLiterCity: 10,
      mileagePerLiterRoad: 12,
      consumptionEnergetic: 15,
      autonomyElectricMode: 20,
      year: 2022,
    });
    expect(component.vehicleForm.valid).toBeTruthy();
  });

  it('should reset models when brand is changed', () => {
    component.vehicleForm.get('brand')?.setValue({ id: 1, name: 'Brand A' });
    component.vehicleForm.get('brand')?.setValue({ id: 2, name: 'Brand B' });
    expect(component.models.length).toBe(0);
  });

  it('should call closeModal on cancel', () => {
    jest.spyOn(component, 'closeModal');
    component.closeModal();
    expect(component.closeModal).toHaveBeenCalled();
  });

  
  it('should not submit form when form is invalid', async () => {
    component.vehicleForm.get('motor')?.setValue('');  // Motor vazio
    component.vehicleForm.get('brand')?.setValue(null); // Marca não selecionada
  
    jest.spyOn(vehicleServiceMock, 'register');
    
    await component.submitForm();
  
    expect(vehicleServiceMock.register).not.toHaveBeenCalled();
    expect(component.vehicleForm.valid).toBeFalsy();
  });
  it('should call closeModal when the modal is closed', () => {
    component.closeModal();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });
 
        
});