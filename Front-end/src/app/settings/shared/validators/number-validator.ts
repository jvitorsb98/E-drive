import { AbstractControl, ValidationErrors } from "@angular/forms";

export function numberValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value !== null && value !== '') {
    const isNumber = /^[0-9]*$/.test(value);
    return isNumber ? null : { notANumber: true };
  }
  return null; // Retorna null se o campo estiver vazio
}