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

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzIzNzgzNTg4LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.SJfibmAL7JXup-q5CCrhi98IEtc4tpHTWh0wYUQ_Iq0'; 

  // Método para obter todos os veículos do usuário
  getAllUserVehicle(): Observable<UserVehicle[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
  
    return this.http.get<UserVehicle[]>(this.userVehicleUrl, { headers });
  }
}
