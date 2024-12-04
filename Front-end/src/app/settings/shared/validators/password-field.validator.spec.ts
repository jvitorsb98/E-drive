import { Renderer2 } from '@angular/core';
import { PasswordFieldValidator } from './password-field.validator';


describe('PasswordFieldValidator', () => {
  let mockRenderer: Renderer2;
  let mockElementRef: any;

  beforeEach(() => {
    mockRenderer = {
      listen: jasmine.createSpy('listen'),
      addClass: jasmine.createSpy('addClass'),
      removeClass: jasmine.createSpy('removeClass'),
      setAttribute: jasmine.createSpy('setAttribute'),
    } as unknown as Renderer2;

    mockElementRef = {
      nativeElement: {
        querySelector: jasmine.createSpy(),
        querySelectorAll: jasmine.createSpy(),
      },
    };
  });

  describe('Validação de Requisitos de Senha', () => {
    it('deve aplicar a classe "valid" para itens atendidos e "invalid" para itens não atendidos', () => {
      const passwordInput = document.createElement('input');
      passwordInput.className = 'password-input';
      mockElementRef.nativeElement.querySelector.and.callFake((selector: string) => {
        if (selector === '.password-input') return passwordInput;
        return null;
      });

      const requirementList = Array.from({ length: 5 }, (_, i) => {
        const li = document.createElement('li');
        li.appendChild(document.createElement('span'));
        return li;
      });

      mockElementRef.nativeElement.querySelectorAll.and.returnValue(requirementList);

      PasswordFieldValidator.initializePasswordField(mockRenderer, mockElementRef);

      // Simular o evento keyup com uma senha válida
      const event = new Event('keyup');
      Object.defineProperty(event, 'target', { value: { value: 'Passw0rd!' } });
      passwordInput.dispatchEvent(event);

      // Verificar se os requisitos foram marcados como válidos
      expect(mockRenderer.addClass).toHaveBeenCalledWith(requirementList[0], 'valid'); // Mínimo 8 caracteres
      expect(mockRenderer.addClass).toHaveBeenCalledWith(requirementList[1], 'valid'); // Pelo menos 1 número
      expect(mockRenderer.addClass).toHaveBeenCalledWith(requirementList[2], 'valid'); // Pelo menos 1 letra minúscula
      expect(mockRenderer.addClass).toHaveBeenCalledWith(requirementList[3], 'valid'); // Pelo menos 1 caractere especial
      expect(mockRenderer.addClass).toHaveBeenCalledWith(requirementList[4], 'valid'); // Pelo menos 1 letra maiúscula
    });

    it('deve remover a classe "valid" de itens não atendidos', () => {
      const passwordInput = document.createElement('input');
      passwordInput.className = 'password-input';
      mockElementRef.nativeElement.querySelector.and.callFake((selector: string) => {
        if (selector === '.password-input') return passwordInput;
        return null;
      });

      const requirementList = Array.from({ length: 5 }, (_, i) => {
        const li = document.createElement('li');
        li.appendChild(document.createElement('span'));
        return li;
      });

      mockElementRef.nativeElement.querySelectorAll.and.returnValue(requirementList);

      PasswordFieldValidator.initializePasswordField(mockRenderer, mockElementRef);

      // Simular o evento keyup com uma senha inválida
      const event = new Event('keyup');
      Object.defineProperty(event, 'target', { value: { value: 'Pass' } });
      passwordInput.dispatchEvent(event);

      // Verificar se os requisitos foram marcados como inválidos
      expect(mockRenderer.removeClass).toHaveBeenCalledWith(requirementList[0], 'valid'); // Mínimo 8 caracteres
      expect(mockRenderer.removeClass).toHaveBeenCalledWith(requirementList[1], 'valid'); // Pelo menos 1 número
    });
  });

  describe('Alternância de Visibilidade de Senha', () => {
    it('deve alternar entre "bi-eye" e "bi-eye-slash-fill" ao clicar no ícone de olho', () => {
      const passwordInput = document.createElement('input');
      const passwordEyeIcon = document.createElement('span');
      passwordInput.className = 'password-input';
      passwordEyeIcon.className = 'password-eye-icon';

      mockElementRef.nativeElement.querySelector.and.callFake((selector: string) => {
        if (selector === '.password-input') return passwordInput;
        if (selector === '.password-eye-icon') return passwordEyeIcon;
        return null;
      });

      PasswordFieldValidator.initializePasswordField(mockRenderer, mockElementRef);

      // Simular clique no ícone de olho
      passwordEyeIcon.dispatchEvent(new Event('click'));

      // Verificar alternância de classe
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(passwordEyeIcon, 'class', 'bi bi-eye-slash-fill');

      // Simular clique novamente
      passwordEyeIcon.dispatchEvent(new Event('click'));
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(passwordEyeIcon, 'class', 'bi bi-eye');
    });
  });
});
