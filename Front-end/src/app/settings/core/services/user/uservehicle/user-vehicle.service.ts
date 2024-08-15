import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserVehicle } from '../../../models/UserVehicle';

@Injectable({
  providedIn: 'root'
})
export class UserVehicleService {

  private userVehicleUrl!: string;
  private userVehicle: UserVehicle[] = [];

  constructor(private http: HttpClient) {
    this.userVehicleUrl = `${environment.apiUrl}`;
  }

  // Método para obter todos os veiculos reais
  getAllVehicle(): Observable<UserVehicle[]> {
    return this.http.get<UserVehicle[]>(this.userVehicleUrl);
    // return of(this.vehicle);
  }
}
