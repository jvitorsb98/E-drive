import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { ILoginRequest, ILoginResponse, IRecoverAccountRequest, IRecoverAccountResponse, IRecoverPasswordRequest, IRecoverPasswordResponse, IResetPasswordRequest } from '../../../models/inter-Login';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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
          console.log(response)
          if (response && response.token) {
            localStorage.setItem('token', response.token);

            this.isLoggedInSubject.next(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    //TODO - Udo temporario emquando não resolve o back-end
    const token = this.getToken(); // Retrieve stored token
    localStorage.removeItem('token'); // Clear token from storage
    this.isLoggedInSubject.next(false); // Update logged-in state
    localStorage.clear();
    this.router.navigate(['']);
    //TODO - Notificar o back-end Só retorna bad request tem que resolver esse erro de logout
    // Notifica ao back-end que o usuário deslogou
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post<any>(this.apiUrl + '/logout', {}, { headers })
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
  // Metodo para obter os detalhes do usuário autenticado via token
  getUserID(): Number | undefined {
    const token = localStorage.getItem('token');
    if (!token) {
      return undefined;
    }
    const decodedToken: any = (jwtDecode as any)(token);
    return decodedToken.id;
  }

  getUserEmail(): String | undefined {
    const token = localStorage.getItem('token');
    if (!token) {
      return undefined;
    }
    const decodedToken: any = (jwtDecode as any)(token);
    return decodedToken.email;
  }

  getUserDetails(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Token inválido. Por favor, tente novamente.'));
    }
    const decodedToken: any = (jwtDecode as any)(token);
    return decodedToken;

  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenReset(): string | null {
    return localStorage.getItem('token-reset-password');
  }


  recoverPasswordRequest(email: IRecoverPasswordRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/reset-password/request`, { email }, { responseType: 'text' });
  }
  

  resetPassword(request: IResetPasswordRequest): Observable<any> {
    // const header = new HttpHeaders().set('Authorization', `Bearer ${request.token}`);
    // return this.http.put(`${this.apiUrl}/reset-password/reset`, request, { headers: header })
    return this.http.put(`${this.apiUrl}/reset-password/reset`, request , { responseType: 'text' });
  }

  recoverAccountRequest(email: IRecoverAccountRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/reactivate-account/request`, { email }, { responseType: 'text' });
  }

  confirmAccount(token: string): Observable<any> {

    return this.http.put(`${this.apiUrl}/reactivate?token=${token}`, null, { responseType: 'text' });

  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    // let errorMessage = 'An unexpected error occurred'; // en-us
    let errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.'; // pt-br
    // Verifica o status do erro e define uma mensagem personalizada
    if (error.status === 400) {
      errorMessage = error.error; 
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
