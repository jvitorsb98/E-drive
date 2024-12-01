import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LgpdModalComponent } from './lgpd-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';

// Mock do MatDialogRef
class MockMatDialogRef {
  close = jest.fn();
}

describe('LgpdModalComponent', () => {
  let component: LgpdModalComponent;
  let fixture: ComponentFixture<LgpdModalComponent>;
  let dialogRefMock: MockMatDialogRef;

  beforeEach(async () => {
    dialogRefMock = new MockMatDialogRef();

    await TestBed.configureTestingModule({
      declarations: [LgpdModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            lgpds: [
              { question: 'O que é LGPD?', answer: 'Lei Geral de Proteção de Dados' },
              { question: 'Quem está sujeito à LGPD?', answer: 'Empresas e indivíduos que processam dados pessoais.' }
            ]
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LgpdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with FAQ data from MAT_DIALOG_DATA', () => {
    expect(component.lgpdFaqs.length).toBe(2);
    expect(component.lgpdFaqs[0].question).toBe('O que é LGPD?');
    expect(component.lgpdFaqs[1].answer).toBe('Empresas e indivíduos que processam dados pessoais.');
  });

  it('should call dialogRef.close with true when onConfirm is called and terms are accepted', () => {
    // Simula a aceitação dos termos
    component.acceptTermsControl.setValue(true);

    // Chama o método onConfirm
    component.onConfirm();

    // Verifica se o modal foi fechado com true
    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should not call dialogRef.close when terms are not accepted', () => {
    // Simula a não aceitação dos termos
    component.acceptTermsControl.setValue(false);

    // Chama o método onConfirm
    component.onConfirm();

    // Verifica se o modal NÃO foi fechado
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should show error if terms are not accepted and user tries to confirm', () => {
    const acceptTermsControl = component.acceptTermsControl;

    // Simula a não aceitação dos termos
    acceptTermsControl.setValue(false);

    // Chama onConfirm
    component.onConfirm();

    // O método não deve fechar o modal se os termos não foram aceitos
    expect(dialogRefMock.close).not.toHaveBeenCalled();
    expect(acceptTermsControl.invalid).toBe(true);
  });

  it('should have the terms control set to invalid if terms are not accepted', () => {
    component.acceptTermsControl.setValue(false);

    expect(component.acceptTermsControl.invalid).toBe(true);
  });

  it('should have the terms control set to valid if terms are accepted', () => {
    component.acceptTermsControl.setValue(true);

    expect(component.acceptTermsControl.valid).toBe(true);
  });
});
