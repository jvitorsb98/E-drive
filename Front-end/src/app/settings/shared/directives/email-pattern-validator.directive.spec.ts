import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailPatternValidatorDirective } from './email-pattern-validator.directive';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';

describe('EmailPatternValidatorDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: HTMLInputElement;
  let control: FormControl;

  // Componente de teste que usa a diretiva
  @Component({
    template: `<input [formControl]="emailControl" appEmailPatternValidator />`
  })
  class TestComponent {
    emailControl = new FormControl('');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, EmailPatternValidatorDirective],
      imports: [ReactiveFormsModule], // Necessário para usar FormControl
    });

    fixture = TestBed.createComponent(TestComponent);
    inputElement = fixture.debugElement.nativeElement.querySelector('input');
    control = fixture.componentInstance.emailControl;
    fixture.detectChanges(); // Detecta mudanças após inicialização
  });

  it('should create the directive', () => {
    expect(inputElement).toBeTruthy();
  });

  it('should validate a valid email pattern', () => {
    control.setValue('valid.email@example.com'); // Define um valor válido
    fixture.detectChanges();

    expect(control.valid).toBe(true); // O controle deve ser válido
    expect(control.errors).toBeNull(); // Não deve ter erros
  });

  it('should invalidate an invalid email pattern', () => {
    control.setValue('invalid-email'); // Define um valor inválido
    fixture.detectChanges();

    expect(control.invalid).toBe(true); // O controle deve ser inválido
    expect(control.errors).toEqual({ 'invalidEmailPattern': true }); // Deve ter o erro esperado
  });

  it('should not have validation errors for an empty email', () => {
    control.setValue(''); // Define um valor vazio
    fixture.detectChanges();

    expect(control.valid).toBe(true); // O controle deve ser válido (vazio não é inválido)
    expect(control.errors).toBeNull(); // Não deve ter erros
  });
});
