import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { User } from '../../models/user';
import { AuthService } from '../../security/services/auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl: string;
  private authToken: string | null;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
    this.usersUrl = `${environment.apiUrl}/auth`;

    this.authToken = this.authService.getToken();
  }

  // Método para obter o usuário logado
  getAllUsers(): Observable<User[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });

    todo:// trocar por um interceptor para adicionar o token ao cabecalho
    return this.http.get<User[]>(`${this.usersUrl}/user/me`, { headers });
  }

  // Método para obter os detalhes do usuário autenticado sem passar o ID explicitamente
  getAuthenticatedUserDetails(): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });

    return this.http.get<User>(`${this.usersUrl}/user/me`, { headers });
  }

  // Método para adicionar um usuário
  addUser(user: User): Observable<any> {
    return this.http.post(`${this.usersUrl}/register`, user, { responseType: 'text' })
      .pipe(
        map(response => {
          return { message: response };
        }),
        catchError(e => {
          if (e.status === 400) {
            return throwError(() => e);
          }
          console.error('Erro ao cadastrar usuário:', e);
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
        console.error('Erro ao verificar e-mail:', e);
        return throwError(() => e);
      })
    );
  }

  // Método para atualizar os dados do usuário
  updateUser(user: User): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<User>(`${this.usersUrl}/user/update`, user, { headers })
      .pipe(
        catchError(e => {
          console.error('Erro ao atualizar os dados do usuário:', e);
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

  // getToken(): string | null {
  //   return localStorage.getItem('authToken');
  // }

  // setToken(token: string): void {
  //   localStorage.setItem('authToken', token);
  // }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
