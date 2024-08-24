import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDynamicMask]'
})
export class DynamicMaskDirective {
  private regex: RegExp = new RegExp(/^\d{0,2}(\.\d{0,1})?$/);  // Aceita até dois dígitos antes e um após o ponto
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    let value = input.value;

    // Remove caracteres que não correspondem à regex
    if (!this.regex.test(value)) {
      value = this.cleanValue(value);
      input.value = value;
      // Atualiza o valor no controle do formulário
      this.updateFormControl();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const input = this.el.nativeElement;
    const cursorPos = input.selectionStart ?? 0; // Posições do cursor
    const current: string = input.value;
    const next: string = current.slice(0, cursorPos) + event.key + current.slice(input.selectionEnd ?? cursorPos);

    if (next && !this.regex.test(next)) {
      event.preventDefault();
    }
  }

  private cleanValue(value: string): string {
    // Remove caracteres inválidos e corrige a formatação
    const parts = value.split('.');
    if (parts.length > 2) {
      // Remove caracteres extras após o segundo ponto
      parts.splice(2);
    }
    let integerPart = parts[0];
    let decimalPart = parts[1] || '';

    // Limita a parte inteira a 2 dígitos e a parte decimal a 1 dígito
    integerPart = integerPart.slice(0, 2);
    decimalPart = decimalPart.slice(0, 1);

    return integerPart + (decimalPart ? '.' + decimalPart : '');
  }

  private updateFormControl() {
    // Atualiza o valor no controle do formulário
    const eventInput = new Event('input', { bubbles: true });
    this.el.nativeElement.dispatchEvent(eventInput);
  }
}
