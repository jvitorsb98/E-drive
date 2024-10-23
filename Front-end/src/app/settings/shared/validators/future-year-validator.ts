import { AbstractControl } from "@angular/forms";

export function futureYearValidator(control: AbstractControl): { [key: string]: any } | null {
  const currentYear = new Date().getFullYear();
  const minYear = 1901;

  // Verifica se o valor está fora do intervalo permitido (menor que 1901 ou maior que o próximo ano)
  if (control.value && (control.value < minYear || control.value > currentYear)) {
    // Retorna o erro com informações adicionais
    return { 
      'invalidYear': true, 
      'currentYear': currentYear 
    };
  }
  return null; // Se o ano for válido, retorna null
}
