import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Vehicle } from '../../models/vehicle';
import { AuthService } from '../../security/services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehicleUrl!: string;
  private authToken: string | null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.vehicleUrl = `${environment.apiUrl}`;
    this.authToken = this.authService.getToken();
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

}
