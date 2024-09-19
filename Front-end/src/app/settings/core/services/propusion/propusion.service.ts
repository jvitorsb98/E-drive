import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Propulsion } from '../../models/propulsion';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class PropusionService {

  propulsionUrl!: string;

  constructor(private http: HttpClient) {
    this.propulsionUrl = `${environment.apiUrl}/api/v1/propulsions`;
  }

  getAll(): Observable<PaginatedResponse<Propulsion>> {
    return this.http.get<PaginatedResponse<Propulsion>>(this.propulsionUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Ocorreu um erro ao buscar as propulsoes. Por favor, tente novamente mais tarde.'));
    // pt-br msg: 'Ocorreu um erro ao buscar as propulsoes. Por favor, tente novamente mais tarde.'
    // en-us msg: 'An error occurred while fetching propulsions. Please try again later.'
  }

}
