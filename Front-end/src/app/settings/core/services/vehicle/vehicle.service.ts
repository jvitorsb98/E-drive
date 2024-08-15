import { HttpClient } from '@angular/common/http';
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
}
