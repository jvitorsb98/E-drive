import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../security/services/auth/auth.service';
import { Propulsion } from '../../models/propulsion';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class PropusionService {

  baseUrl!: string;

  authToken!: string | null;

  headers!: HttpHeaders;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.baseUrl = `${environment.apiUrl}/api/v1/propulsions`;

    this.authToken = this.authService.getToken();

    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });
  }

  getAll(): Observable<PaginatedResponse<Propulsion>> {
    // page: number, size: number
    // let params = new HttpParams()
    // .set('page', page.toString())
    // .set('size', size.toString());
    // .set('headers', this.headers.toString());

    return this.http.get<PaginatedResponse<Propulsion>>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Ocorreu um erro ao buscar as propulsoes. Por favor, tente novamente mais tarde.'));
    // pt-br msg: 'Ocorreu um erro ao buscar as propulsoes. Por favor, tente novamente mais tarde.'
    // en-us msg: 'An error occurred while fetching propulsions. Please try again later.'
  }

}
