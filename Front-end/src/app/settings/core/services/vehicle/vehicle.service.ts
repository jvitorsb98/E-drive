import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Vehicle } from '../../models/vehicle';
import { AuthService } from '../../security/services/auth/auth.service';
import { PaginatedResponse } from '../../models/paginatedResponse';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehicleUrl!: string;
  private authToken: string | null;
  private headers!: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.vehicleUrl = `${environment.apiUrl}`;
    this.authToken = this.authService.getToken();

    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}` // Utilize o token mockado ou real
    });
  }

  // Método para obter todos os veiculos reais
  getAllVehicle(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.vehicleUrl);
    // return of(this.vehicle);
  }

  getVehicleDetails(id: number): Observable<Vehicle> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}` // Utilize o token mockado ou real
    });

    return this.http.get<Vehicle>(`${this.vehicleUrl}/api/v1/vehicles/${id}`, { headers });
  }

  getVehiclesByModel(modelId: number): Observable<Vehicle[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}` // Utilize o token mockado ou real
    });
    return this.http.get<Vehicle[]>(`${this.vehicleUrl}/api/v1/vehicles/model/${modelId}`, { headers });
  }

  getAll(page: number, size: number): Observable<PaginatedResponse<Vehicle>> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', 'year');

    return this.http.get<PaginatedResponse<Vehicle>>(`${this.vehicleUrl}/api/v1/vehicles`, { params: params }).pipe(
      catchError(this.handleError)
    );
  }

  register(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.vehicleUrl}/api/v1/vehicles`, vehicle, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.vehicleUrl}/api/v1/vehicles/${id}`, vehicle, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  activate(id: number): Observable<any> {
    return this.http.put<any>(`${this.vehicleUrl}/api/v1/vehicles/enable/${id}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  deactivate(id: number): Observable<any> {
    return this.http.delete<any>(`${this.vehicleUrl}/api/v1/vehicles/${id}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // cadastro de Autonomia
  registerAutonomy(autonomy: any): Observable<any> {
    return this.http.post<any>(`${this.vehicleUrl}/api/v1/vehicles/autonomy`, autonomy, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    //NOTE - Adicione as mensagens de erro personalizadas conforme necessário
    // let errorMessage = 'An unexpected error occurred'; // en-us
    let errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.'; // pt-br

     if (error.status === 400) {
      // errorMessage = 'Unauthorized. Please check your credentials.'; // en-us
      errorMessage = 'Acesso não autorizado. Verifique suas credenciais.'; // pt-br
      // errorMessage = error.error.message;
    } else if (error.status === 500) {
      // errorMessage = 'Internal server error. Please try again later.'; // en-us
      errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.'; // pt-br
      // errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }

}
