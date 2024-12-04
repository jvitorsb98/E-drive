import { Renderer2, ElementRef } from '@angular/core';
import { PasswordVisibilityToggle } from './password-visibility-toggle';

describe('PasswordVisibilityToggle', () => {
  let renderer: Renderer2;
  let elementRef: ElementRef;

  beforeEach(() => {
    // Mock do ElementRef
    const mockElement = document.createElement('div');
    mockElement.innerHTML = `
      <input type="password" class="password-input" />
      <i class="password-eye-icon"></i>
    `;
    elementRef = { nativeElement: mockElement };

    // Mock do Renderer2
    renderer = {
      listen: jest.fn(),
      setAttribute: jest.fn(),
    } as unknown as Renderer2;
  });

  it('deve alternar a visibilidade da senha corretamente', () => {
    PasswordVisibilityToggle.togglePasswordVisibility(renderer, elementRef);

    const passwordInput = elementRef.nativeElement.querySelector('.password-input');
    const passwordToggleIcon = elementRef.nativeElement.querySelector('.password-eye-icon');

    // Simula o clique no ícone de visibilidade
    const clickHandler = (renderer.listen as jest.Mock).mock.calls[0][2];
    clickHandler();

    // Verifica se o tipo do input foi alterado para texto
    expect(passwordInput.getAttribute('type')).toBe('text');
    // Verifica se o ícone foi atualizado para bi-eye
    expect(renderer.setAttribute).toHaveBeenCalledWith(passwordToggleIcon, 'class', 'bi bi-eye');

    // Simula outro clique para alternar novamente
    clickHandler();

    // Verifica se o tipo do input foi alterado para senha
    expect(passwordInput.getAttribute('type')).toBe('password');
    // Verifica se o ícone foi atualizado para bi-eye-slash-fill
    expect(renderer.setAttribute).toHaveBeenCalledWith(passwordToggleIcon, 'class', 'bi bi-eye-slash-fill');
  });

  it('não deve registrar o evento de clique se elementos não forem encontrados', () => {
    // Remove os elementos necessários
    elementRef.nativeElement.innerHTML = '';

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    PasswordVisibilityToggle.togglePasswordVisibility(renderer, elementRef);

    // Verifica se o erro foi registrado no console
    expect(consoleErrorSpy).toHaveBeenCalledWith('Não foi possível encontrar os elementos de input ou ícone.');
    expect(renderer.listen).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
