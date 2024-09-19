import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Propulsion } from '../../models/propulsion';

@Injectable({
  providedIn: 'root'
})
export class PropusionService {

  propulsionUrl!: string;

  constructor(private http: HttpClient) {
    this.propulsionUrl = `${environment.apiUrl}/api/v1/propulsions`;
  }

  getAll(): Observable<Propulsion[]> {
    // page: number, size: number
    // let params = new HttpParams()
    // .set('page', page.toString())
    // .set('size', size.toString());
    // .set('headers', this.headers.toString());

    return this.http.get<Propulsion[]>(this.propulsionUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Ocorreu um erro ao buscar as propulsoes. Por favor, tente novamente mais tarde.'));
    // pt-br msg: 'Ocorreu um erro ao buscar as propulsoes. Por favor, tente novamente mais tarde.'
    // en-us msg: 'An error occurred while fetching propulsions. Please try again later.'
  }

}
