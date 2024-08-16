import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { LoginRequest, ResetPasswordRequest, ResetPasswordResponse } from '../../../models/ineter-Login';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

// essa importação esta causando um warning corrigir depois
import * as jwt_decode from 'jwt-decode'; // Importe a biblioteca para decodificar o JWT

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl!: string;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}/auth/login`;
  }

  login(credential: LoginRequest): Observable<any> {
    // rever essa logica
    todo: //console.log(crede ntial); remover
    console.log("Login:", credential);
    console.log("Login API URL:", this.apiUrl);
    return this.http.post(this.apiUrl, credential)
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
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false); // Atualizar o estado do usuário deslogado
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false; // Token não existe, usuário não está logado
    }

    try {
      const decodedToken: any = (jwt_decode as any)(token);
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

  handleError(error: any){
    return throwError(() => new Error(error || 'Server Error'));
  }

  resetPassword(email: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(this.apiUrl + '/reset-password', email);
  }

}
