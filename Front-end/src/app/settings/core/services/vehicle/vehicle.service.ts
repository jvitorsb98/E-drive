import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Vehicle } from '../../models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehicleUrl!: string;

  constructor(private http: HttpClient) {
    this.vehicleUrl = `${environment.apiUrl}`;
  }

  // Método para obter todos os veiculos reais
  getAllVehicle(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.vehicleUrl);
    // return of(this.vehicle);
  }

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzIzODQ3MzQzLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.a9qDITE8fVpUzW0pjrNANdeNd_V4VKA0sk8Ur8Dn9dI';


  getVehicleDetails(id: number): Observable<Vehicle> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}` // Utilize o token mockado ou real
    });

    return this.http.get<Vehicle>(`${this.vehicleUrl}/api/v1/vehicles/${id}`, { headers });
  }
}
