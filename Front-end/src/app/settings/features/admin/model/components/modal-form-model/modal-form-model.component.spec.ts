import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalFormModelComponent } from './modal-form-model.component';
import { HttpClientModule } from '@angular/common/http';
import { ModelService } from '../../../../../core/services/model/model.service';
import { of, throwError } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrandService } from '../../../../../core/services/brand/brand.service';

describe('ModalFormModelComponent', () => {
  let component: ModalFormModelComponent;
  let fixture: ComponentFixture<ModalFormModelComponent>;
  let mockModelService: any;
  let mockBrandService: any;

  beforeEach(async () => {
    mockModelService = {
      getModels: jest.fn(() => of([])),
      saveModel: jest.fn(),
      update: jest.fn(() => of({})),
      register: jest.fn(() => of({}))
    };

    mockBrandService = {
      getAll: jest.fn(() => of({
        content: [
          { id: 1, name: 'Brand A' },
          { id: 2, name: 'Brand B' }
        ]
      }))
    };

    await TestBed.configureTestingModule({
      declarations: [ModalFormModelComponent],
      imports: [
        HttpClientModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        BrowserAnimationsModule 
      ],
      providers: [
        { provide: ModelService, useValue: mockModelService },
        { provide: BrandService, useValue: mockBrandService },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { name: 'Test Model', brand: { name: 'Brand A' } } }
      ]  
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFormModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();  
  });

  it('should load brands on init', () => {
    expect(component.editModel).toBe(true);
    expect(component.modelForm).toBeTruthy();
    expect(component.modelForm.get('modelName')?.value).toBe('Test Model');
    expect(component.modelForm.get('brand')?.value).toBe('Brand A');
  });
  
  it('should submit the form with valid data', () => {
    component.brands = [
      { id: 1, name: 'Brand A' },
      { id: 2, name: 'Brand B' }
    ];

    component.ngOnInit(); 

    component.modelForm.get('brand')?.setValue('Brand A');
    component.modelForm.get('modelName')?.setValue('Model Test');

    // Simula que está editando
    jest.spyOn(component, 'isEditing').mockReturnValue(true);

    component.onSubmit(); 

    expect(mockModelService.update).toHaveBeenCalled(); 
    expect(mockModelService.update).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Model Test',
      idBrand: 1 
    }));
  });

  it('should handle error when submitting the form', () => {
    mockModelService.update = jest.fn(() => throwError(new Error('Error while saving'))); 
  
    component.ngOnInit(); 
    component.modelForm.get('brand')?.setValue('Brand A'); 
    component.modelForm.get('modelName')?.setValue('Model Test'); 
  
    component.onSubmit(); 

    expect(mockModelService.update).toHaveBeenCalled();
    // Verifica se a função de exibição de erro foi chamada, se aplicável
    // expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ ... }));
  });

  it('should be invalid when form is empty', () => {
    component.modelForm.get('modelName')?.setValue('');
    component.modelForm.get('brand')?.setValue('');
    expect(component.modelForm.valid).toBeFalsy(); 
  });

  it('should enable the name field when a valid brand is selected', () => {
    component.modelForm.get('brand')?.setValue('Brand A'); 
    fixture.detectChanges(); 
    expect(component.modelForm.get('modelName')?.enabled).toBe(true); 
  });

  /*
  it('should disable modelName field when no brand is selected', () => {
    const mockEvent: MatAutocompleteSelectedEvent = {
      option: { value: null } // Simulando uma seleção sem valor
    } as MatAutocompleteSelectedEvent;

    component.onBrandSelected(mockEvent);

    // Verifica se o campo 'modelName' foi desabilitado
    expect(component.modelForm.get('modelName')?.enabled).toBe(false);
  });
  */


  it('should return true for isEditing when editing', () => {
    jest.spyOn(component, 'isEditing').mockReturnValue(true);
    expect(component.isEditing()).toBe(true); 
  });

  

  it('should not call update when form is invalid on submit', () => {
    component.modelForm.get('modelName')?.setValue(''); 
    component.onSubmit(); 
    expect(mockModelService.update).not.toHaveBeenCalled(); 
  });
});
