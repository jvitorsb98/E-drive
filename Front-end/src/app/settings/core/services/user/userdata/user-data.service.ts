import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private storageKey = 'user';

  constructor() { }

  formatAndStoreUserData(userData: any): void {
    let { countryCode, ...rest } = userData;

    countryCode = countryCode.replace(/^\+/, '');
    const cleanedPhone = rest.cellPhone.replace(/\D/g, '');

    if (cleanedPhone.length === 11) {
      const formattedPhone = cleanedPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      const cellPhoneWithCountryCode = `+${countryCode} ${formattedPhone}`;
      const updatedUserData = { ...rest, cellPhone: cellPhoneWithCountryCode };

      this.saveUserData(updatedUserData);
    } else {
      console.error('Número de telefone inválido.');
    }
  }

   // Metodos para guardar e recuperar dados do usuário no localStorage
   saveUserData(data: any): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getUserData(): any {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  clearUserData(): void {
    localStorage.removeItem(this.storageKey);
  }
  //-------------------------------------------------------------------
}
