import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function numberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    // Verifica se o valor é um número inteiro sem ponto decimal
    const isInteger = /^-?\d+$/.test(value);
    return isInteger ? null : { notANumber: true };
  };
}
