import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    this.userVehicleUrl = `${environment.apiUrl}/api/vehicle-users`;
  }

  // Método para obter todos os veiculos do usuário
  // getAllUserVehicle(): Observable<UserVehicle[]> {
  //   return this.http.get<UserVehicle[]>(`${this.userVehicleUrl}`);
  // }

  private authToken: string = ''; 

  // Método para obter todos os veículos do usuário
  getAllUserVehicle(): Observable<UserVehicle[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
  
    return this.http.get<UserVehicle[]>(this.userVehicleUrl, { headers });
  }
}
