import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneMask'
})
export class PhoneMaskPipe implements PipeTransform {

  // Retorna a máscara do telefone de acordo com o tipo de telefone selecionado (residencial ou celular)
  transform(phoneType: string): string {
    const phoneMaskMap: { [key: string]: string } = {
      'MOBILE': '(00) 00000-0000',
      'RESIDENTIAL': '(00) 0000-0000'
    };
    return phoneMaskMap[phoneType] || '';
  }
}
