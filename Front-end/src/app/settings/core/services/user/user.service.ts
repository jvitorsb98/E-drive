import { AuthService } from './../../security/services/auth/auth.service';
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

  constructor(private http: HttpClient, private authServise: AuthService) {
    this.usersUrl = `${environment.apiUrl}/auth`;
  }

  // Método para obter os detalhes do usuário autenticado sem passar o ID explicitamente
  getAuthenticatedUserDetails(): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/user/me`);
  }

  // Método para adicionar um usuário
  register(user: User): Observable<any> {
    return this.http.post(`${this.usersUrl}/register`, user, { responseType: 'text' }).pipe(
      map(response => {
        console.log(response+ 'oi')
        return { message: response };
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  // Método para atualizar os dados do usuário
  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/user/update`, user).pipe(
        catchError(e => {
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

  //TODO - Finalizar esse metodo de desativar o usuário
  // Método para desativar o usuário
  deactivate(id: Number): Observable<any> {
    return this.http.delete(`${this.usersUrl}/${id}`);
  }

  // pega ID do Usuario logado
  getUserID(): Number | undefined {
    return this.authServise.getUserID();
  }

  getUserEmail(): String | undefined {
    return this.authServise.getUserEmail();
  }

  getUserDetails(): Observable<any> {
    return this.authServise.getUserDetails();
  }

  logout(): void {
    this.authServise.logout();
  }

}
