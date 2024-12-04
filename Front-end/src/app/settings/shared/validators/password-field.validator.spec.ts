import { Renderer2, ElementRef } from '@angular/core';
import { PasswordFieldValidator } from './password-field.validator';

describe('PasswordFieldValidator', () => {
  let renderer: Renderer2;
  let elementRef: ElementRef;

  beforeEach(() => {
    // Mock do Renderer2
    renderer = {
      listen: jest.fn(),
      addClass: jest.fn(),
      removeClass: jest.fn(),
      setAttribute: jest.fn(),
    } as unknown as Renderer2;

    // Mock do ElementRef
    const mockElement = document.createElement('div');
    mockElement.innerHTML = `
      <input class="password-input" />
      <input class="confirm-password-input" />
      <i class="password-eye-icon"></i>
      <i class="confirm-password-eye-icon"></i>
      <ul class="requirement-list">
        <li><span></span> Mínimo de 8 caracteres</li>
        <li><span></span> Pelo menos 1 número</li>
        <li><span></span> Pelo menos 1 letra minúscula</li>
        <li><span></span> Pelo menos 1 caractere especial</li>
        <li><span></span> Pelo menos 1 letra maiúscula</li>
      </ul>
    `;
    elementRef = { nativeElement: mockElement } as ElementRef;
  });

  it('deve validar os requisitos da senha corretamente', () => {
    PasswordFieldValidator.initializePasswordField(renderer, elementRef);

    const passwordInput = elementRef.nativeElement.querySelector('.password-input');
    const requirementItems = elementRef.nativeElement.querySelectorAll('.requirement-list li');

    // Simula o estado inicial do DOM
    requirementItems.forEach((item: { classList: { remove: (arg0: string) => void; }; firstElementChild: any; }) => {
      item.classList.remove('valid');
      renderer.setAttribute(item.firstElementChild, 'class', 'bi bi-bag-x-fill');
    });

    // Simula a digitação de uma senha válida
    const event = new KeyboardEvent('keyup', { bubbles: true });
    passwordInput.value = 'Senha123!';
    passwordInput.dispatchEvent(event);

    // Verifica se os requisitos foram validados
    expect(renderer.addClass).toHaveBeenNthCalledWith(1, requirementItems[0], 'valid'); // 8 caracteres
    expect(renderer.addClass).toHaveBeenNthCalledWith(2, requirementItems[1], 'valid'); // Pelo menos 1 número
    expect(renderer.addClass).toHaveBeenNthCalledWith(3, requirementItems[2], 'valid'); // Pelo menos 1 letra minúscula
    expect(renderer.addClass).toHaveBeenNthCalledWith(4, requirementItems[3], 'valid'); // Pelo menos 1 caractere especial
    expect(renderer.addClass).toHaveBeenNthCalledWith(5, requirementItems[4], 'valid'); // Pelo menos 1 letra maiúscula
  });

  it('deve alternar a visibilidade da senha corretamente', () => {
    PasswordFieldValidator.initializePasswordField(renderer, elementRef);

    const passwordInput = elementRef.nativeElement.querySelector('.password-input');
    const passwordEyeIcon = elementRef.nativeElement.querySelector('.password-eye-icon');

    // Simula o estado inicial do DOM
    passwordInput.classList.add('hidden-text'); // Inicia com senha oculta
    renderer.setAttribute(passwordEyeIcon, 'class', 'bi bi-eye');

    // Simula o clique no ícone de olho
    passwordEyeIcon.dispatchEvent(new Event('click'));

    // Verifica se a classe de visibilidade foi alterada
    expect(passwordInput.classList.contains('hidden-text')).toBeFalsy(); // Deve remover a classe
    expect(renderer.setAttribute).toHaveBeenCalledWith(passwordEyeIcon, 'class', 'bi bi-eye');

    // Simula outro clique no ícone de olho
    passwordInput.classList.remove('hidden-text');
    passwordEyeIcon.dispatchEvent(new Event('click'));

    // Verifica se a classe de visibilidade foi alternada novamente
    expect(passwordInput.classList.contains('hidden-text')).toBeTruthy(); // Deve adicionar a classe
    expect(renderer.setAttribute).toHaveBeenCalledWith(passwordEyeIcon, 'class', 'bi bi-eye-slash-fill');
  });

  it('deve alternar a visibilidade da confirmação de senha corretamente', () => {
    PasswordFieldValidator.initializePasswordField(renderer, elementRef);

    const confirmPasswordInput = elementRef.nativeElement.querySelector('.confirm-password-input');
    const confirmPasswordEyeIcon = elementRef.nativeElement.querySelector('.confirm-password-eye-icon');

    // Simula o estado inicial do DOM
    confirmPasswordInput.classList.add('hidden-text'); // Inicia com senha oculta
    renderer.setAttribute(confirmPasswordEyeIcon, 'class', 'bi bi-eye');

    // Simula o clique no ícone de olho para confirmação de senha
    confirmPasswordEyeIcon.dispatchEvent(new Event('click'));

    // Verifica se a classe de visibilidade foi alterada
    expect(confirmPasswordInput.classList.contains('hidden-text')).toBeFalsy();
    expect(renderer.setAttribute).toHaveBeenCalledWith(confirmPasswordEyeIcon, 'class', 'bi bi-eye');

    // Simula outro clique no ícone de olho para confirmação de senha
    confirmPasswordInput.classList.remove('hidden-text');
    confirmPasswordEyeIcon.dispatchEvent(new Event('click'));

    // Verifica se a classe de visibilidade foi alternada novamente
    expect(confirmPasswordInput.classList.contains('hidden-text')).toBeTruthy();
    expect(renderer.setAttribute).toHaveBeenCalledWith(confirmPasswordEyeIcon, 'class', 'bi bi-eye-slash-fill');
  });

});
