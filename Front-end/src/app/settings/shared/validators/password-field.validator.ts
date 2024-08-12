import { Renderer2, ElementRef } from '@angular/core';

export class PasswordFieldValidator {
  static initializePasswordField(renderer: Renderer2, el: ElementRef): void {
    const passwordInput = el.nativeElement.querySelector(".password-input");
    const confirmPasswordInput = el.nativeElement.querySelector(".confirm-password-input");
    const passwordEyeIcon = el.nativeElement.querySelector(".password-eye-icon");
    const confirmPasswordEyeIcon = el.nativeElement.querySelector(".confirm-password-eye-icon");
    const requirementList = el.nativeElement.querySelectorAll(".requirement-list li");

    const requirements = [
      { regex: /.{8,}/, index: 0 },
      { regex: /[0-9]/, index: 1 },
      { regex: /[a-z]/, index: 2 },
      { regex: /[^A-Za-z0-9]/, index: 3 },
      { regex: /[A-Z]/, index: 4 },
    ];

    // Lógica para os requisitos da senha
    renderer.listen(passwordInput, 'keyup', (e) => {
      requirements.forEach(item => {
        const isValid = item.regex.test(e.target.value);
        const requirementItem = requirementList[item.index];
        if (isValid) {
          renderer.addClass(requirementItem, 'valid');
          renderer.setAttribute(requirementItem.firstElementChild, 'class', 'bi bi-check-circle-fill');
        } else {
          renderer.removeClass(requirementItem, 'valid');
          renderer.setAttribute(requirementItem.firstElementChild, 'class', 'bi bi-bag-x-fill');
        }
      });
    });

    // Lógica para o campo 'password'
    renderer.listen(passwordEyeIcon, 'click', () => {
      const isHidden = passwordInput.classList.toggle("hidden-text");
      renderer.setAttribute(passwordEyeIcon, 'class', `bi ${isHidden ? "bi-eye-slash-fill" : "bi-eye"}`);
    });

    // Lógica para o campo 'confirmPassword'
    renderer.listen(confirmPasswordEyeIcon, 'click', () => {
      const isHidden = confirmPasswordInput.classList.toggle("hidden-text");
      renderer.setAttribute(confirmPasswordEyeIcon, 'class', `bi ${isHidden ? "bi-eye-slash-fill" : "bi-eye"}`);
    });
  }
}
