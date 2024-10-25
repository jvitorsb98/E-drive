import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { UserVehicle } from '../../../models/user-vehicle';
import { IApiResponse } from '../../../models/api-response';
import { PaginatedResponse } from '../../../models/paginatedResponse';

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

  listAll(page: number, size: number): Observable<PaginatedResponse<UserVehicle>> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', 'id');

    return this.http.get<PaginatedResponse<UserVehicle>>(`${this.userVehicleUrl}/user`, { params: params });
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
