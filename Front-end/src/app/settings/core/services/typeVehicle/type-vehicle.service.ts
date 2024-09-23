import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { VehicleType } from '../../models/vehicle-type';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class TypeVehicleService {
  vehicleTypeUrl!: string;

  constructor(private http: HttpClient) {
    this.vehicleTypeUrl = `${environment.apiUrl}/api/v1/vehicleTypes`;
  }

  getAll(): Observable<PaginatedResponse<VehicleType>> {
    return this.http.get<PaginatedResponse<VehicleType>>(this.vehicleTypeUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Ocorreu um erro ao buscar as categorias. Por favor, tente novamente mais tarde.'));
    // pt-br msg: 'Ocorreu um erro ao buscar as categorias. Por favor, tente novamente mais tarde.'
    // en-us msg: 'An error occurred while fetching categories. Please try again later.'
  }

}
