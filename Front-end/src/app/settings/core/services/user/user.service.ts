import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.usersUrl = `${environment.apiUrl}/auth`;
  }

  // Método para obter os detalhes do usuário autenticado sem passar o ID explicitamente
  getAuthenticatedUserDetails(): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/user/me`);
  }

  // Método para adicionar um usuário
  addUser(user: User): Observable<any> {
    return this.http.post(`${this.usersUrl}/register`, user, { responseType: 'text' }).pipe(
      map(response => {
        return { message: response };
      }),
      catchError(e => {
        if (e.status === 400) {
          return throwError(() => e);
        }
        return throwError(() => e);
      })
    );
  }

  // Método para verificar se o email já existe
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.usersUrl}/user/exists`, {
      params: new HttpParams().set('email', email)
    }).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  // Método para atualizar os dados do usuário
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/user/update`, user).pipe(
        catchError(e => {
          return throwError(() => e);
        })
      );
  }

  // formatAndStoreUserData(countryCode: string, cellPhone: string): string {
  //   countryCode = countryCode.replace(/^\+/, '');
  //   const cleanedPhone = cellPhone.replace(/\D/g, '');

  //   if (cleanedPhone.length === 11) {
  //     const formattedPhone = cleanedPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  //     const cellPhoneWithCountryCode = `+${countryCode} ${formattedPhone}`;

  //     return cellPhoneWithCountryCode;
  //   } else {
  //     console.error('Número de telefone inválido.');
  //     return '';
  //   }
  // }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
