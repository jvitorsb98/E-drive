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
  register(user: User): Observable<any> {
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

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.clear();
    this.router.navigate(['e-driver/login']);
  }

}
