import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { LoginRequest, ResetPasswordRequest, ResetPasswordResponse } from '../../../models/ineter-Login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl!: string;


  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}/users`;
  }

  login(credential: LoginRequest): Observable<any> {
    // rever essa logica
    todo: //console.log(crede ntial); remover
    return this.http.post(this.apiUrl, credential, { observe: 'response' });
  }

  resetPassword(email: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(this.apiUrl + '/reset-password', email);
  }

}
