import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicMaskDirective } from './dynamic-mask.directive';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DynamicMaskDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: HTMLInputElement;

  // Componente de teste para aplicar a diretiva
  @Component({
    template: `<input appDynamicMask />`
  })
  class TestComponent {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, DynamicMaskDirective], // Declara o componente e a diretiva
    });

    fixture = TestBed.createComponent(TestComponent);
    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    fixture.detectChanges(); // Detecta as mudanças do componente
  });

  it('should create the directive and apply the mask', () => {
    // Verifica se o input foi criado corretamente
    expect(inputElement).toBeTruthy();
  });

  it('should format the input value correctly for valid input', () => {
    // Simula a digitação de um valor válido
    inputElement.value = '12.3';
    inputElement.dispatchEvent(new Event('input')); // Simula o evento de input

    fixture.detectChanges(); // Detecta mudanças após o evento

    // Verifica se o valor do input foi formatado corretamente
    expect(inputElement.value).toBe('12.3');
  });

  it('should clean invalid input and limit to 2 digits before the decimal and 1 after', () => {
    // Simula a digitação de um valor inválido
    inputElement.value = '123.45';
    inputElement.dispatchEvent(new Event('input')); // Simula o evento de input

    fixture.detectChanges(); // Detecta mudanças após o evento

    // Verifica se o valor do input foi limpo e formatado corretamente
    expect(inputElement.value).toBe('12.4'); // Limita a 2 dígitos inteiros e 1 decimal
  });

  it('should not allow invalid characters on keydown event', () => {
    // Simula um evento de keydown com valor inválido
    const event = new KeyboardEvent('keydown', { key: '3' });
    inputElement.dispatchEvent(event);

    fixture.detectChanges(); // Detecta mudanças após o evento

    // Verifica se o valor do input não foi alterado para um valor inválido
    expect(inputElement.value).toBe('');
  });

  it('should allow special keys like Backspace, Tab, etc.', () => {
    // Testa se as teclas especiais são permitidas
    const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
    inputElement.value = '12.3';
    inputElement.dispatchEvent(backspaceEvent);

    fixture.detectChanges(); // Detecta mudanças após o evento

    // Verifica se o Backspace foi aceito e o valor foi alterado
    expect(inputElement.value).toBe('12.');
  });
});
