import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noNumbersValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const hasNumbers = /\d/.test(value);

  return hasNumbers ? { hasNumbers: true } : null;
}