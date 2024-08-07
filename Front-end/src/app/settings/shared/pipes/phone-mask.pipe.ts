import { Pipe, PipeTransform } from '@angular/core';
import { PhoneTypeEnum } from '../../core/enums/phone-type.enum';


@Pipe({
  name: 'phoneMask'
})
export class PhoneMaskPipe implements PipeTransform {

  // Retorna a máscara do telefone de acordo com o tipo de telefone selecionado (residencial ou celular)
  transform(phoneType: number): string {
    console.log('PhoneMaskPipe');
    const phoneMaskMap: { [key in PhoneTypeEnum]: string } = {
      [PhoneTypeEnum.RESIDENTIAL]: '+00 00 0000-0000',
      [PhoneTypeEnum.MOBILE]: '+00 00 00000-0000'
    };
    return phoneMaskMap[phoneType as PhoneTypeEnum];
  }

}