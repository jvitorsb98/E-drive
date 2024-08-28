import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { ILoginRequest, IResetPasswordRequest, IResetPasswordResponse } from '../../../models/inter-Login';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

// essa importação esta causando um warning corrigir depois
// import * as jwt_decode from 'jwt-decode'; // Importe a biblioteca para decodificar o JWT
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl!: string;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = `${environment.apiUrl}/auth`;
  }

  login(credential: ILoginRequest): Observable<any> {
    // rever essa logica
    todo: //console.log(crede ntial); remover
    return this.http.post(this.apiUrl + '/login', credential)
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token', response.token);
          this.isLoggedInSubject.next(true); // Atualizar o estado do usuário logado
        }),
        catchError(
          this.handleError
        )
      );
  }

  logout() {
    this.isLoggedInSubject.next(false);
    this.http.post(this.apiUrl + '/logout', localStorage.getItem('token'))
      .pipe(
        catchError(this.handleError)
      )
      .subscribe();
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false; // Token não existe, usuário não está logado
    }

    try {
      const decodedToken: any = (jwtDecode as any)(token);
      const currentTime = Date.now() / 1000; // Tempo atual em segundos
      return decodedToken.exp > currentTime; // Verifica se o token ainda não expirou
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return false; // Em caso de erro, consideramos o token inválido
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenReset(): string | null {
    return localStorage.getItem('token-reset-password');
  }

  handleError(error: any) {
    return throwError(() => new Error(error || 'Server Error'));
  }

  // Implemente a lógica de envio de e-mail para redefinição de senha
  // o back-end deve retornar um e-mail com um link para redefinição de senha
  // o link deve redirecionar para a rota "reset-password" com o token de troca de senha
  // o token deve expirar em 1 hora

  resetPasswordRequest(email: IResetPasswordRequest): Observable<IResetPasswordResponse> {
    return this.http.post<IResetPasswordResponse>(this.apiUrl + '/reset-password/request', email).pipe(
      tap((response: IResetPasswordResponse) => {
        localStorage.setItem('token-reset-password', response.token);
        this.router.navigate(['reset-password']);
      }),
      catchError(this.handleError)
    )
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + '/reset-password', { token, password }).pipe(
      catchError(this.handleError)
    )
  }
}
