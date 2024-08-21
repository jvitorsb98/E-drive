import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { ILoginRequest, IResetPasswordRequest, IResetPasswordResponse } from '../../../interface/inter-Login';
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
    this.apiUrl = `${environment.apiUrl}/auth`;
  }

  login(credential: ILoginRequest): Observable<any> {
    // rever essa logica
    todo: //console.log(crede ntial); remover
    console.log("Login:", credential);
    console.log("Login API URL:", this.apiUrl);
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
    this.isLoggedInSubject.next(false); // Atualizar o estado do usuário deslogado
    todo://descomentar essa parte quando o back-end for implementado
    // this.http.post(this.apiUrl + '/logout', localStorage.getItem('token'))
    // .pipe(
    //   catchError(this.handleError)
    // )
    // .subscribe();
    localStorage.removeItem('token');
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

  resetPassword(email: IResetPasswordRequest): Observable<IResetPasswordResponse> {
    return this.http.post<IResetPasswordResponse>(this.apiUrl + '/reset-password', email);
  }

}
