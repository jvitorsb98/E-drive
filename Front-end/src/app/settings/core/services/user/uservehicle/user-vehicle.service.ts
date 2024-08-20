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
    this.userVehicleUrl = `${environment.apiUrl}/api/v1/vehicle-users`;
  }

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzI0MjAxMjA1LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.iGgOMfFOZb7bPzdpzkkmFNaRWJpGHEL7lHDr6ATribc';

  getAllUserVehicle(): Observable<IApiResponse<UserVehicle[]>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });

    return this.http.get<IApiResponse<UserVehicle[]>>(this.userVehicleUrl, { headers });
  }

  registerVehicleUser(dataRegisterVehicleUser: any, authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.userVehicleUrl, dataRegisterVehicleUser, { headers });
  }

}
