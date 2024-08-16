import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Vehicle } from '../../models/Vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehicleUrl!: string;
  private vehicle: Vehicle[] = [];

  constructor(private http: HttpClient) {
    this.vehicleUrl = `${environment.apiUrl}`;
  }

  // Método para obter todos os veiculos reais
  getAllVehicle(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.vehicleUrl);
    // return of(this.vehicle);
  }

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzIzNzgzNTg4LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.SJfibmAL7JXup-q5CCrhi98IEtc4tpHTWh0wYUQ_Iq0'; 


  getVehicleDetails(id: number): Observable<Vehicle> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}` // Utilize o token mockado ou real
    });
  
    return this.http.get<Vehicle>(`${this.vehicleUrl}/api/v1/vehicles/${id}`, { headers });
  }
}
