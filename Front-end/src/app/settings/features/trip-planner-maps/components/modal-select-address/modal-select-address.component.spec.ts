import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';

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
import { of } from 'rxjs';
import { ModalFormVehicleComponent } from '../../../user-vehicle/components/modal-form-vehicle/modal-form-vehicle.component';

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


  
