import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalFormModelComponent } from './modal-form-model.component';
import { HttpClientModule } from '@angular/common/http';
import { ModelService } from '../../../../../core/services/model/model.service';
import { of, throwError } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
      getModels: jest.fn(() => of([])),  // Simula o método getModels retornando um observable vazio
      saveModel: jest.fn(),               // Simula o método saveModel
      update: jest.fn(() => of({})),       // Simula o método update
      register: jest.fn(() => of({}))      // Simula o método register
    };

    mockBrandService = {
      getAll: jest.fn(() => of({
        content: [
          { id: 1, name: 'Brand A' },
          { id: 2, name: 'Brand B' }
        ]
      }))  // Simula o método getAll retornando marcas
    };

    await TestBed.configureTestingModule({
      declarations: [ModalFormModelComponent],  // Use o componente diretamente
      imports: [
        HttpClientModule,
        MatDialogModule,
        MatAutocompleteModule,  // Assegure-se de que está importado
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
    fixture.detectChanges(); // Detecta mudanças para inicializar o componente
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();  
  });

  it('should load brands on init', () => {
    component.ngOnInit(); // Chama ngOnInit para carregar as marcas
    expect(mockBrandService.getAll).toHaveBeenCalled(); // Verifica se getAll foi chamado
    expect(component.brands.length).toBeGreaterThan(0); // Verifica se as marcas foram carregadas
    expect(component.brands).toEqual([
      { id: 1, name: 'Brand A' },
      { id: 2, name: 'Brand B' }
    ]);
  });
  
  it('should enable the name field when a brand is selected', () => {
    component.ngOnInit();
    component.modelForm.get('brand')?.setValue('Brand A'); // Simula a seleção de uma marca
    expect(component.modelForm.get('name')?.enabled).toBe(true); // Verifica se o campo de nome foi habilitado
  });

  it('should disable the name field when no brand is selected', () => {
    component.ngOnInit();
    component.modelForm.get('brand')?.setValue('Invalid Brand'); // Simula uma marca inválida
    expect(component.modelForm.get('name')?.enabled).toBe(false); // Verifica se o campo de nome foi desabilitado
  });
  it('should submit the form with valid data', () => {
    component.ngOnInit(); // Inicializa o componente
    component.modelForm.get('brand')?.setValue('Brand A'); // Simula a seleção da marca
    component.modelForm.get('name')?.setValue('Model Test'); // Simula a entrada no campo de nome

    // Simula o método isEditing para retornar true
    jest.spyOn(component, 'isEditing').mockReturnValue(true);

    component.onSubmit(); // Chama o método de submissão do formulário

    expect(mockModelService.update).toHaveBeenCalled(); // Verifica se o método update foi chamado
    expect(mockModelService.update).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Model Test',
      idBrand: 1 // Espera que o ID da marca selecionada seja passado
    }));
  });

  it('should handle error when submitting the form', () => {
    mockModelService.update = jest.fn(() => throwError(new Error('Error while saving'))); // Simula erro usando throwError
  
    component.ngOnInit(); // Inicializa o componente
    component.modelForm.get('brand')?.setValue('Brand A'); // Simula a seleção da marca
    component.modelForm.get('name')?.setValue('Model Test'); // Simula a entrada no campo de nome
  
    component.onSubmit(); // Chama o método de submissão do formulário
  
    expect(mockModelService.update).toHaveBeenCalled(); // Verifica se o método update foi chamado
    // Aqui você pode verificar se a função Swal.fire foi chamada com os parâmetros corretos
  });
});
