import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserVehicle } from '../../../models/user-vehicle';
import { IApiResponse } from '../../../interface/api-response';

@Injectable({
  providedIn: 'root'
})
export class UserVehicleService {

  private userVehicleUrl!: string;

  constructor(private http: HttpClient) {
    this.userVehicleUrl = `${environment.apiUrl}/api/vehicle-users`;
  }

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzI0MTA2NDI3LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.yy6xCU3pTkpcDHOxYKpI0MiXb63A81YXacGoCtIIwks';


  // Método para obter todos os veículos do usuário
  // getAllUserVehicle(): Observable<UserVehicle[]> {
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.authToken}`
  //   });

  //   return this.http.get<UserVehicle[]>(this.userVehicleUrl, { headers });
  // }

  getAllUserVehicle(): Observable<IApiResponse<UserVehicle[]>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });

    return this.http.get<IApiResponse<UserVehicle[]>>(this.userVehicleUrl, { headers });
  }

}
