import { AbstractControl } from "@angular/forms";

export function futureYearValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const minYear = 1901;

  // Verifica se o valor está fora do intervalo permitido (menor que 1901 ou maior que o próximo ano)
  if (control.value && (control.value < minYear || control.value > nextYear)) {
    return { 'invalidYear': true }; // Retorna o erro se o ano for inválido
  }
  return null; // Se o ano for válido, retorna null
}
