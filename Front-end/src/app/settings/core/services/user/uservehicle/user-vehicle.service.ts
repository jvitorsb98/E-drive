import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { UserVehicle } from '../../../models/user-vehicle';
import { IApiResponse } from '../../../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class UserVehicleService {

  private userVehicleUrl!: string;

  constructor(private http: HttpClient) {
    this.userVehicleUrl = `${environment.apiUrl}/api/v1/vehicle-users`;
  }

  getAllUserVehicle(): Observable<IApiResponse<UserVehicle[]>> {
    return this.http.get<IApiResponse<UserVehicle[]>>(`${this.userVehicleUrl}/user`);
  }

  registerVehicleUser(dataRegisterVehicleUser: any): Observable<any> {
    return this.http.post(this.userVehicleUrl, dataRegisterVehicleUser);
  }

  updateVehicleUser(id: number, dataRegisterAutonomy: any): Observable<any> {
    return this.http.put(`${this.userVehicleUrl}/${id}`, dataRegisterAutonomy)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(e => {
          return throwError(() => e);
        })
      );
  }

  deleteUserVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.userVehicleUrl}/${id}`);
  }
}
