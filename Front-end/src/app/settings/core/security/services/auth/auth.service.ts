import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { ILoginRequest, ILoginResponse, IRecoverPasswordRequest, IRecoverPasswordResponse, IResetPasswordRequest } from '../../../models/inter-Login';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

// essa importação esta causando um warning corrigir depois
// import * as jwt_decode from 'jwt-decode'; // Importe a biblioteca para decodificar o JWT
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Token } from '@angular/compiler';

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

  login(credential: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(this.apiUrl + '/login', credential)
      .pipe(
        tap((response: ILoginResponse) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);

            this.isLoggedInSubject.next(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post(this.apiUrl + '/logout', {}, { headers })
        .pipe(tap(() => {
          localStorage.removeItem('token');
          this.isLoggedInSubject.next(false);
          localStorage.clear();
        }),
          catchError(this.handleError)
        ).subscribe(); // Assinatura necessária para executar o request
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = (jwtDecode as any)(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenReset(): string | null {
    return localStorage.getItem('token-reset-password');
  }

  // TODO: Implemente a lógica de envio de e-mail para redefinição de senha
  // o back-end deve mandar um e-mail com um link para redefinição de senha
  // o link deve redirecionar para a rota "reset-password" com o token de troca de senha
  // o token deve expirar em 1 hora

  //TODO - Padronizar o retorno de Erros do back-end

  recoverPasswordRequest(email: IRecoverPasswordRequest): Observable<IRecoverPasswordResponse> {
    return this.http.put<IRecoverPasswordResponse>(`${this.apiUrl}/reset-password/request`, { email })
  }

  resetPassword(request: IResetPasswordRequest): Observable<any> {
    const header = new HttpHeaders().set('Authorization', `Bearer ${request.token}`);
    return this.http.put(`${this.apiUrl}/reset-password/reset`,request ,{ headers: header })
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // let errorMessage = 'An unexpected error occurred'; // en-us
    let errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.'; // pt-br

    // Verifica o status do erro e define uma mensagem personalizada
    if (error.status === 400) {
      // errorMessage = 'User is not activated. Please check your email for activation.'; // en-us
      errorMessage = 'O usuário não foi ativado. Verifique seu e-mail para ativar o usuário.'; // pt-br
    } else if (error.status === 401) {
      // errorMessage = 'Unauthorized. Please check your credentials.'; // en-us
      errorMessage = 'Acesso não autorizado. Verifique suas credenciais.'; // pt-br
    } else if (error.status === 500) {
      // errorMessage = 'Internal server error. Please try again later.'; // en-us
      errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.'; // pt-br
    }

    return throwError(() => new Error(errorMessage));
  }
}
