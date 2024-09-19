import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { VehicleType } from '../../models/vehicle-type';

@Injectable({
  providedIn: 'root'
})
export class TypeVehicleService {
  vehicleTypeUrl!: string;

  constructor(private http: HttpClient) {
    this.vehicleTypeUrl = `${environment.apiUrl}/api/v1/vehicleTypes`;
  }

  getAll(): Observable<VehicleType[]> {
    // page: number, size: number
    // let params = new HttpParams()
    // .set('page', page.toString())
    // .set('size', size.toString());
    // .set('headers', this.headers.toString());

    return this.http.get<VehicleType[]>(this.vehicleTypeUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Ocorreu um erro ao buscar as categorias. Por favor, tente novamente mais tarde.'));
    // pt-br msg: 'Ocorreu um erro ao buscar as categorias. Por favor, tente novamente mais tarde.'
    // en-us msg: 'An error occurred while fetching categories. Please try again later.'
  }

}
