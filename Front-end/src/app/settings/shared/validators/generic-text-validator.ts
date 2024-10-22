import { AbstractControl, ValidatorFn } from '@angular/forms';

// Validador genérico para campos de texto
export function genericTextValidator(minLength: number, maxLength: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = control.value;

    // Verifica se o campo está vazio (caso não seja obrigatório)
    if (!value) {
      return null; // Se não for obrigatório, não retorna erro
    }

    // Validação de tamanho
    if (value.length < minLength || value.length > maxLength) {
      return { 'invalidLength': true }; // Retorna erro se o tamanho for inválido
    }

    // Validação de formato (apenas letras, números e espaços permitidos)
    const pattern = /^[a-zA-Z0-9\s]+$/;
    if (!pattern.test(value)) {
      return { 'invalidFormat': true }; // Retorna erro se o formato for inválido
    }

    return null; // Retorna null se for válido
  };
}
