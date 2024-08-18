import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  formatAndStoreUserData(countryCode: string, cellPhone: string): string {
    countryCode = countryCode.replace(/^\+/, '');
    const cleanedPhone = cellPhone.replace(/\D/g, '');

    if (cleanedPhone.length === 11) {
      const formattedPhone = cleanedPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      const cellPhoneWithCountryCode = `+${countryCode} ${formattedPhone}`;

      return cellPhoneWithCountryCode;
    } else {
      console.error('Número de telefone inválido.');
      return '';
    }
  }
  
  getVehicleTypeDisplay(type: string): string {
    return type === 'CAR' ? 'Carro' : this.capitalizeWords(type);
  }

  capitalizeWords(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

}