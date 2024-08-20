import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl!: string;
  private users: User[] = [];

  constructor(private http: HttpClient) {
    this.usersUrl = `${environment.apiUrl}`;
  }

  // Método para obter todos os usuários reais
  getAllUsers(): Observable<User[]> {
    // return this.http.get<User[]>(this.usersUrl);
    return of(this.users);
  }

  addUser(user: User): Observable<any> {
    return this.http.post(`${this.usersUrl}/auth/register`, user, { responseType: 'text' })
      .pipe(
        map(response => {
          // Como a resposta é um texto, você pode retornar um objeto com a mensagem.
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

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.usersUrl}/auth/user/exists`, {
      params: new HttpParams().set('email', email)
    });
  }

}