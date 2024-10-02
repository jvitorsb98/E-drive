import { Renderer2, ElementRef } from '@angular/core';

export class PasswordVisibilityToggle {
  static togglePasswordVisibility(renderer: Renderer2, el: ElementRef): void {
    const passwordInput = el.nativeElement.querySelector(".password-input");
    const passwordToggleIcon = el.nativeElement.querySelector(".password-eye-icon");

    if (passwordInput && passwordToggleIcon) {
      renderer.listen(passwordToggleIcon, 'click', () => {
        const isPasswordHidden = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPasswordHidden ? 'text' : 'password');
        renderer.setAttribute(passwordToggleIcon, 'class', `bi ${isPasswordHidden ? "bi-eye" : "bi-eye-slash-fill"}`);
      });
    } else {
      console.error('Não foi possível encontrar os elementos de input ou ícone.');
    }
  }
}
