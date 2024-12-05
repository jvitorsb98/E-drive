import { Renderer2, ElementRef } from '@angular/core';
import { PasswordVisibilityToggle } from './password-visibility-toggle';

describe('PasswordVisibilityToggle', () => {
  let renderer: Renderer2;
  let elementRef: ElementRef;
  let passwordInput: any;
  let passwordToggleIcon: any;

  beforeEach(() => {
    passwordInput = {
      getAttribute: jest.fn(),
      setAttribute: jest.fn(),
    };

    passwordToggleIcon = {};

    renderer = {
      listen: jest.fn((element, event, callback) => {
        if (event === 'click') {
          callback(); // Simula o clique no momento da configuração do evento
        }
      }),
      setAttribute: jest.fn(),
    } as unknown as Renderer2;

    elementRef = {
      nativeElement: {
        querySelector: jest.fn((selector: string) => {
          if (selector === '.password-input') return passwordInput;
          if (selector === '.password-eye-icon') return passwordToggleIcon;
          return null;
        }),
      },
    } as unknown as ElementRef;
  });

  it('should toggle password visibility to text on click', () => {
    // Configurar o comportamento inicial
    passwordInput.getAttribute.mockReturnValueOnce('password');

    PasswordVisibilityToggle.togglePasswordVisibility(renderer, elementRef);

    // Verificar que o evento de clique foi configurado corretamente
    expect(renderer.listen).toHaveBeenCalledWith(
      passwordToggleIcon,
      'click',
      expect.any(Function)
    );

    // Verificar alterações após o clique
    expect(passwordInput.setAttribute).toHaveBeenCalledWith('type', 'text');
    expect(renderer.setAttribute).toHaveBeenCalledWith(passwordToggleIcon, 'class', 'bi bi-eye');
  });

  it('should toggle password visibility to password on click again', () => {
    // Configurar o comportamento inicial
    passwordInput.getAttribute
      .mockReturnValueOnce('password') // Primeira chamada retorna "password"
      .mockReturnValueOnce('text'); // Segunda chamada retorna "text"
  
    PasswordVisibilityToggle.togglePasswordVisibility(renderer, elementRef);
  
    // Verificar que o evento de clique foi configurado corretamente
    expect(renderer.listen).toHaveBeenCalledWith(
      passwordToggleIcon,
      'click',
      expect.any(Function)
    );
  
    // Simular o primeiro clique
    const clickHandler = (renderer.listen as jest.Mock).mock.calls[0][2];
    clickHandler(); // Simular troca para "text"
  
    expect(passwordInput.setAttribute).toHaveBeenCalledWith('type', 'text');
    expect(renderer.setAttribute).toHaveBeenCalledWith(passwordToggleIcon, 'class', 'bi bi-eye');
  
    // Atualizar o retorno do mock para simular o segundo clique
    passwordInput.getAttribute.mockReturnValue('text'); // Atualizar para o estado atual "text"
    clickHandler(); // Simular troca para "password"
  
    // Verificar alterações após o segundo clique
    expect(passwordInput.setAttribute).toHaveBeenCalledWith('type', 'password');
    expect(renderer.setAttribute).toHaveBeenCalledWith(passwordToggleIcon, 'class', 'bi bi-eye-slash-fill');
  });
  

  it('should log an error if elements are not found', () => {
    console.error = jest.fn();

    // Simular ausência de elementos
    elementRef.nativeElement.querySelector = jest.fn().mockReturnValue(null);

    PasswordVisibilityToggle.togglePasswordVisibility(renderer, elementRef);

    expect(console.error).toHaveBeenCalledWith('Não foi possível encontrar os elementos de input ou ícone.');
  });

  it('should toggle password visibility correctly on multiple clicks', () => {
    passwordInput.getAttribute
      .mockReturnValueOnce('password') // Primeiro estado
      .mockReturnValueOnce('text') // Segundo estado
      .mockReturnValueOnce('password'); // Terceiro estado
  
    PasswordVisibilityToggle.togglePasswordVisibility(renderer, elementRef);
  
    const clickHandler = (renderer.listen as jest.Mock).mock.calls[0][2];
  
    // Primeiro clique (para "text")
    clickHandler();
    expect(passwordInput.setAttribute).toHaveBeenCalledWith('type', 'text');
    expect(renderer.setAttribute).toHaveBeenCalledWith(passwordToggleIcon, 'class', 'bi bi-eye');
  
    // Segundo clique (para "password")
    clickHandler();
    expect(passwordInput.setAttribute).toHaveBeenCalledWith('type', 'password');
    expect(renderer.setAttribute).toHaveBeenCalledWith(passwordToggleIcon, 'class', 'bi bi-eye-slash-fill');
  
    // Terceiro clique (de volta para "text")
    clickHandler();
    expect(passwordInput.setAttribute).toHaveBeenCalledWith('type', 'text');
    expect(renderer.setAttribute).toHaveBeenCalledWith(passwordToggleIcon, 'class', 'bi bi-eye');
    expect(renderer.listen).toHaveBeenCalledTimes(1);

  });
  
});
