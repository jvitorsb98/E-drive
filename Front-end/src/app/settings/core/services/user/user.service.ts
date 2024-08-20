import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
<<<<<<< HEAD
import { User } from '../../models/User';
=======
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../../models/user';
>>>>>>> origin/develop

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl: string;

  constructor(private http: HttpClient) {
    this.usersUrl = `${environment.apiUrl}/auth`;
  }

  // Método para obter o usuário logado
  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYW5pbG8udWJhQGhvdG1haWwuY29tIiwiaXNzIjoiQVBJIFZvbGwubWVkIiwiaWQiOjEsImV4cCI6MTcyNDExOTYwNSwiZW1haWwiOiJkYW5pbG8udWJhQGhvdG1haWwuY29tIn0.avom28z_u-AZZCAojmb70Up6OwY0ODQbLIpsHpgn3Oc';

    // Método para obter o usuário logado
    getAllUsers(): Observable<User[]> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      });

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
    return this.http.get<boolean>(`${this.usersUrl}/user/update`, {
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
}
