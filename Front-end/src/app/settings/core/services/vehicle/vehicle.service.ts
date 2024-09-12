import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
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

    return this.http.get<PaginatedResponse<Vehicle>>(`${this.vehicleUrl}/api/v1/vehicles`, { params: params });
  }

  register(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.vehicleUrl}/api/v1/vehicles`, vehicle, { headers: this.headers });
  }

  update(id: number, vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.vehicleUrl}/api/v1/vehicles/${id}`, vehicle, { headers: this.headers });
  }

  activate(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}` // Utilize o token mockado ou real
    });
    return this.http.get<any>(`${this.vehicleUrl}/api/v1/vehicles/activate`, { headers });
  }

  deactivate(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}` // Utilize o token mockado ou real
    });
    return this.http.get<any>(`${this.vehicleUrl}/api/v1/vehicles/deactivate`, { headers });
  }

}
