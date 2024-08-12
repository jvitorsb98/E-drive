import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Renderer2, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[appPasswordField]'
})
export class PasswordFieldDirective implements AfterViewInit {
  isBrowser: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID)
    private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initializePasswordField(this.renderer, this.el);
    }
  }

  private initializePasswordField(renderer: Renderer2, el: ElementRef): void {
    const passwordInput = el.nativeElement.querySelector(".password-input") as HTMLInputElement | null;
    const confirmPasswordInput = el.nativeElement.querySelector(".confirm-password-input") as HTMLInputElement | null;
    const passwordEyeIcon = el.nativeElement.querySelector(".password-eye-icon") as HTMLElement | null;
    const confirmPasswordEyeIcon = el.nativeElement.querySelector(".confirm-password-eye-icon") as HTMLElement | null;
    const requirementList = el.nativeElement.querySelectorAll(".requirement-list li");

    const requirements = [
      { regex: /.{8,}/, index: 0 },
      { regex: /[0-9]/, index: 1 },
      { regex: /[a-z]/, index: 2 },
      { regex: /[^A-Za-z0-9]/, index: 3 },
      { regex: /[A-Z]/, index: 4 },
    ];

    if (passwordInput) {
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
    } else {
      console.error('Password input não encontrado.');
    }

    if (passwordEyeIcon) {
      // Lógica para o campo 'password'
      renderer.listen(passwordEyeIcon, 'click', () => {
        if (passwordInput) {
          const isHidden = passwordInput.classList.toggle("hidden-text");
          renderer.setAttribute(passwordEyeIcon, 'class', `bi ${isHidden ? "bi-eye-slash-fill" : "bi-eye"}`);
        }
      });
    } else {
      console.error('Password eye icon não encontrado.');
    }

    if (confirmPasswordEyeIcon) {
      // Lógica para o campo 'confirmPassword'
      renderer.listen(confirmPasswordEyeIcon, 'click', () => {
        if (confirmPasswordInput) {
          const isHidden = confirmPasswordInput.classList.toggle("hidden-text");
          renderer.setAttribute(confirmPasswordEyeIcon, 'class', `bi ${isHidden ? "bi-eye-slash-fill" : "bi-eye"}`);
        }
      });
    } else {
      console.error('Confirm password eye icon não encontrado.');
    }

    if (requirementList.length === 0) {
      console.error('Requirement list não encontrada.');
    }
  }
}
