import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { UserVehicle } from '../../../models/user-vehicle';
import { IApiResponse } from '../../../models/api-response';
import { AuthService } from '../../../security/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserVehicleService {

  private userVehicleUrl!: string;
  private authToken: string | null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userVehicleUrl = `${environment.apiUrl}/api/v1/vehicle-users`;

    this.authToken = this.authService.getToken();
  }

  getAllUserVehicle(): Observable<IApiResponse<UserVehicle[]>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });

    return this.http.get<IApiResponse<UserVehicle[]>>(`${this.userVehicleUrl}/user`, { headers });
  }

  registerVehicleUser(dataRegisterVehicleUser: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.userVehicleUrl, dataRegisterVehicleUser, { headers });
  }

  updateVehicleUser(id: number, dataRegisterAutonomy: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
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

  deleteUserVehicle(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<void>(`${this.userVehicleUrl}/${id}`, { headers });
  }
}
