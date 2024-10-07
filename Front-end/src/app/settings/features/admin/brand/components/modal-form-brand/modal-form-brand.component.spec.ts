// Importando dependências adicionais
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalFormBrandComponent } from './modal-form-brand.component';
import { BrandService } from '../../../../../core/services/brand/brand.service';
import { Brand } from '../../../../../core/models/brand';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

jest.mock('sweetalert2', () => ({
  fire: jest.fn(), // Mock da função Swal.fire
}));
describe('ModalFormBrandComponent', () => {
  let component: ModalFormBrandComponent;
  let fixture: ComponentFixture<ModalFormBrandComponent>;
  let mockBrandService: jest.Mocked<BrandService>;
  let dialogRef: MatDialogRef<ModalFormBrandComponent>;
  

  const mockBrand: Brand = {
    id: 1,
    name: 'Brand Name',
    activated: true,
  };

  beforeEach(async () => {
    jest.clearAllMocks(); 
    dialogRef = {
      close: jest.fn(),
    } as any;

    // Mock do BrandService
    mockBrandService = {
      register: jest.fn().mockReturnValue(of(mockBrand)), 
      update: jest.fn().mockReturnValue(of(mockBrand)), 
    } as unknown as jest.Mocked<BrandService>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDialogModule,
      ],
      declarations: [ModalFormBrandComponent],
      providers: [
        { provide: BrandService, useValue: mockBrandService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockBrand },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFormBrandComponent);
    component = fixture.componentInstance;
    component.ngOnInit(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should build the form correctly', () => {
    expect(component.brandForm).toBeTruthy();
    expect(component.brandForm.get('name')).toBeTruthy();
  });

  it('should fill the form when editing', () => {
    component.editBrand = true; // Simula que estamos editando
    component.fillForm();

    expect(component.brandForm.get('name')?.value).toEqual(mockBrand.name);
  });

  it('should close the modal', () => {
    component.closeModal();
    expect(dialogRef.close).toHaveBeenCalled();
  });


  it('should not call register method when form is invalid', () => {
    // Não preenche o formulário, tornando-o inválido
    component.brandForm.patchValue({ name: '' }); 
    expect(component.brandForm.valid).toBe(false); 

    // Chama o método onSubmit
    component.onSubmit();

    // Verifica se o método register não foi chamado
    expect(mockBrandService.register).not.toHaveBeenCalled();

    // Verifica se Swal.fire não foi chamado
    expect(Swal.fire).not.toHaveBeenCalled();
});

it('should not call register method when form is invalid', () => {
  // Não preenche o formulário, tornando-o inválido
  component.brandForm.patchValue({ name: '' });
  expect(component.brandForm.valid).toBe(false); 

  // Chama o método onSubmit
  component.onSubmit();

  // Verifica se o método register não foi chamado
  expect(mockBrandService.register).not.toHaveBeenCalled();

  // Verifica se Swal.fire não foi chamado
  expect(Swal.fire).not.toHaveBeenCalled();
});

  
  it('should call update method when editing a brand', () => {
    // Preenche o formulário para edição
    component.brandForm.patchValue({ name: 'Updated Brand' });

    // Chama o método onSubmit
    component.onSubmit();

    // Verifica se o método update foi chamado com os parâmetros corretos
    expect(mockBrandService.update).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      name: 'Updated Brand',
      activated: true // Se necessário, adicione este campo
    }));

    // Verifica se o Swal.fire foi chamado com sucesso
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Sucesso!',
      text: expect.stringContaining('A marca Updated Brand foi atualizada com sucesso.'),
      icon: 'success',
    }));
  });

 



});
