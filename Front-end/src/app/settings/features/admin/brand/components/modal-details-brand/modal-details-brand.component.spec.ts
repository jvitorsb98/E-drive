import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDetailsBrandComponent } from './modal-details-brand.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Brand } from '../../../../../core/models/brand';

// Mock do MatDialogRef
class MockMatDialogRef {
  close() {}
}

describe('ModalDetailsBrandComponent', () => {
  let component: ModalDetailsBrandComponent;
  let fixture: ComponentFixture<ModalDetailsBrandComponent>;
  const mockBrand: Brand = { id: 1, name: 'Brand Name', activated: true }; // Exemplo de marca mockada

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDetailsBrandComponent],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialogRef }, // Mock do dialog ref
        { provide: MAT_DIALOG_DATA, useValue: mockBrand } // Mock dos dados
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailsBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize brand from data', () => {
    expect(component.brand).toEqual(mockBrand);
  });

  it('should close modal when closeModal is called', () => {
    const dialogRef = TestBed.inject(MatDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');
    
    component.closeModal();
    
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should display "Ativo" when brand is activated', () => {
    component.brand.activated = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.check').textContent).toContain('Ativa');
  });

  it('should display "Desativado" when brand is not activated', () => {
    component.brand.activated = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.error').textContent).toContain('Desativada');
  });
});