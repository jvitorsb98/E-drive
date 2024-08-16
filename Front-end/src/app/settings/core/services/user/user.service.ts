import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl: string;

  constructor(private http: HttpClient) {
    this.usersUrl = `${environment.apiUrl}/auth`;
  }

  // Método para obter o usuário logado
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}/user/me`)
      .pipe(
        catchError(e => {
          console.error('Erro ao buscar usuários:', e);
          return throwError(() => e);
        })
      );
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
    return this.http.get<boolean>(`${this.usersUrl}/user/update`, {
      params: new HttpParams().set('email', email)
    }).pipe(
      catchError(e => {
        console.error('Erro ao verificar e-mail:', e);
        return throwError(() => e);
      })
    );
  }

  // Método para atualizar um usuário
  updateUser(user: User): Observable<any> {
    return this.http.put(`${this.usersUrl}/user/${user.email}`, user, { responseType: 'text' })
      .pipe(
        map(response => {
          return { message: 'Usuário atualizado com sucesso.' };
        }),
        catchError(e => {
          if (e.status === 400) {
            return throwError(() => e);
          }
          console.error('Erro ao atualizar usuário:', e);
          return throwError(() => e);
        })
      );
  }
}
