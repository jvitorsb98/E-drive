import { AbstractControl } from '@angular/forms';

export function engineValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;

  // Se o valor não for preenchido, retorna null (válido)
  if (!value) {
    return null;
  }

  // Validação de comprimento (2 a 20 caracteres)
  if (value.length < 2 || value.length > 20) {
    return { 'invalidLength': true }; // Erro de comprimento
  }

  // Validação de formato (apenas letras, números e espaços)
  const motorPattern = /^[a-zA-Z0-9\s]+$/;
  if (!motorPattern.test(value)) {
    return { 'invalidMotor': true }; // Erro de formato
  }

  return null; // Validação passou
}
