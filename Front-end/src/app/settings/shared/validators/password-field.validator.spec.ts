import { Renderer2, ElementRef } from '@angular/core';
import { PasswordFieldValidator } from './password-field.validator';

describe('PasswordFieldValidator', () => {
  let renderer: Renderer2;
  let elementRef: ElementRef;

  beforeEach(() => {
    // Mock do ElementRef com estrutura HTML
    const mockElement = document.createElement('div');
    mockElement.innerHTML = `
      <input type="password" class="password-input" />
      <input type="password" class="confirm-password-input" />
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
    elementRef = { nativeElement: mockElement };

    // Mock do Renderer2
    renderer = {
      listen: jest.fn((_, __, handler) => handler),
      setAttribute: jest.fn(),
      addClass: jest.fn(),
      removeClass: jest.fn(),
    } as unknown as Renderer2;
  });

  it('deve validar os requisitos da senha ao digitar', () => {
    PasswordFieldValidator.initializePasswordField(renderer, elementRef);

    const passwordInput = elementRef.nativeElement.querySelector('.password-input');
    const requirementList = elementRef.nativeElement.querySelectorAll('.requirement-list li');

    // Simula a digitação na senha
    const keyupHandler = (renderer.listen as jest.Mock).mock.calls.find(call => call[1] === 'keyup')[2];
    passwordInput.value = 'Abc1@xyz';
    keyupHandler({ target: passwordInput });

    // Verifica se os requisitos foram validados
    expect(renderer.addClass).toHaveBeenCalledWith(requirementList[0], 'valid'); // Mínimo de 8 caracteres
    expect(renderer.addClass).toHaveBeenCalledWith(requirementList[1], 'valid'); // Pelo menos 1 número
    expect(renderer.addClass).toHaveBeenCalledWith(requirementList[2], 'valid'); // Pelo menos 1 letra minúscula
    expect(renderer.addClass).toHaveBeenCalledWith(requirementList[3], 'valid'); // Pelo menos 1 caractere especial
    expect(renderer.addClass).toHaveBeenCalledWith(requirementList[4], 'valid'); // Pelo menos 1 letra maiúscula
  });

  it('deve validar os requisitos da senha corretamente', () => {
    PasswordFieldValidator.initializePasswordField(renderer, elementRef);

    const passwordInput = elementRef.nativeElement.querySelector('.password-input');
    const requirementItems = elementRef.nativeElement.querySelectorAll('.requirement-list li');

    // Simula a digitação no campo de senha
    const keyupHandler = (renderer.listen as jest.Mock).mock.calls.find(call => call[0] === passwordInput && call[1] === 'keyup')[2];

    // Mock do evento keyup com valor que NÃO atende os requisitos
    keyupHandler({ target: { value: 'abc' } });

    // Verifica se as classes 'valid' foram REMOVIDAS dos requisitos inválidos
    expect(renderer.removeClass).toHaveBeenCalledWith(requirementItems[0], 'valid'); // 8 caracteres
    expect(renderer.removeClass).toHaveBeenCalledWith(requirementItems[1], 'valid'); // Pelo menos 1 número
    expect(renderer.removeClass).toHaveBeenCalledWith(requirementItems[4], 'valid'); // Pelo menos 1 letra maiúscula

    // Verifica se os ícones foram alterados para 'bi-bag-x-fill'
    expect(renderer.setAttribute).toHaveBeenCalledWith(
      requirementItems[0].firstElementChild,
      'class',
      'bi bi-bag-x-fill'
    );
    expect(renderer.setAttribute).toHaveBeenCalledWith(
      requirementItems[1].firstElementChild,
      'class',
      'bi bi-bag-x-fill'
    );
    expect(renderer.setAttribute).toHaveBeenCalledWith(
      requirementItems[4].firstElementChild,
      'class',
      'bi bi-bag-x-fill'
    );

    // Mock do evento keyup com valor que ATENDE os requisitos
    keyupHandler({ target: { value: 'Abc123$%' } });

    // Verifica se as classes 'valid' foram ADICIONADAS aos requisitos válidos
    expect(renderer.addClass).toHaveBeenCalledWith(requirementItems[0], 'valid'); // 8 caracteres
    expect(renderer.addClass).toHaveBeenCalledWith(requirementItems[1], 'valid'); // Pelo menos 1 número
    expect(renderer.addClass).toHaveBeenCalledWith(requirementItems[4], 'valid'); // Pelo menos 1 letra maiúscula

    // Verifica se os ícones foram alterados para 'bi-check-circle-fill'
    expect(renderer.setAttribute).toHaveBeenCalledWith(
      requirementItems[0].firstElementChild,
      'class',
      'bi bi-check-circle-fill'
    );
    expect(renderer.setAttribute).toHaveBeenCalledWith(
      requirementItems[1].firstElementChild,
      'class',
      'bi bi-check-circle-fill'
    );
    expect(renderer.setAttribute).toHaveBeenCalledWith(
      requirementItems[4].firstElementChild,
      'class',
      'bi bi-check-circle-fill'
    );
  });


  it('deve alternar a visibilidade da senha', () => {
    PasswordFieldValidator.initializePasswordField(renderer, elementRef);

    const passwordInput = elementRef.nativeElement.querySelector('.password-input');
    const passwordEyeIcon = elementRef.nativeElement.querySelector('.password-eye-icon');

    // Simula o clique no ícone de visibilidade
    const clickHandler = (renderer.listen as jest.Mock).mock.calls.find(call => call[1] === 'click')[2];
    passwordInput.classList.toggle = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);

    clickHandler();
    expect(passwordInput.classList.toggle).toHaveBeenCalledWith('hidden-text');
    expect(renderer.setAttribute).toHaveBeenCalledWith(passwordEyeIcon, 'class', 'bi bi-eye-slash-fill');

    clickHandler();
    expect(passwordInput.classList.toggle).toHaveBeenCalledWith('hidden-text');
    expect(renderer.setAttribute).toHaveBeenCalledWith(passwordEyeIcon, 'class', 'bi bi-eye');
  });

  it('deve alternar a visibilidade da confirmação de senha', () => {
    PasswordFieldValidator.initializePasswordField(renderer, elementRef);

    const confirmPasswordInput = elementRef.nativeElement.querySelector('.confirm-password-input');
    const confirmPasswordEyeIcon = elementRef.nativeElement.querySelector('.confirm-password-eye-icon');

    // Simula o clique no ícone de visibilidade
    const clickHandler = (renderer.listen as jest.Mock).mock.calls.find(call => call[0] === confirmPasswordEyeIcon && call[1] === 'click')[2];
    confirmPasswordInput.classList.toggle = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);

    // Primeiro clique
    clickHandler();
    expect(confirmPasswordInput.classList.toggle).toHaveBeenCalledWith('hidden-text');
    expect(renderer.setAttribute).toHaveBeenCalledWith(confirmPasswordEyeIcon, 'class', 'bi bi-eye-slash-fill');

    // Segundo clique
    clickHandler();
    expect(confirmPasswordInput.classList.toggle).toHaveBeenCalledWith('hidden-text');
    expect(renderer.setAttribute).toHaveBeenCalledWith(confirmPasswordEyeIcon, 'class', 'bi bi-eye');
  });
});
