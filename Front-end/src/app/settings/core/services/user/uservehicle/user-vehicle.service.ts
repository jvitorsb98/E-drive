import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { UserVehicle } from '../../../models/user-vehicle';
import { IApiResponse } from '../../../interface/api-response';
import { User } from '../../../models/user';
import { Vehicle } from '../../../models/vehicle';
import { Autonomy } from '../../../models/autonomy';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserVehicleService {

  private userVehicleUrl!: string;

  constructor(private http: HttpClient) {
    this.userVehicleUrl = `${environment.apiUrl}/api/v1/vehicle-users`;
  }

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzI0MzAwMzM0LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.pWfF-VLmrAzlfAvbuChk-E2NGIrWEowpLpcip-zCISE';

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

  updateVehicleUser(id: number, dataRegisterAutonomy: any, authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });

    console.log('dataRegisterAutonomy:', dataRegisterAutonomy);

    return this.http.put(`${this.userVehicleUrl}/${id}`, dataRegisterAutonomy, { headers })
      .pipe(
        map(response => {
          console.log('Usuário atualizado com sucesso:', response);
          return response;
        }),
        catchError(e => {
          console.error('Erro ao atualizar usuário:', e.error ? e.error : e.message);
          return throwError(() => e);
        })
      );
  }
}
