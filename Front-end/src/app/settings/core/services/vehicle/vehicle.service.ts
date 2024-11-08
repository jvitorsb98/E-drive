import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { IVehicleRequest, Vehicle } from '../../models/vehicle';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { AuthService } from '../../security/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehicleUrl!: string;

  private authToken: string | null;

  private headers!: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.vehicleUrl = `${environment.apiUrl}`;

    this.authToken = this.authService.getToken();

    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}` // Utilize o token mockado ou real
    });
  }

  // Método para obter todos os veiculos reais
  getAllVehicle(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.vehicleUrl);
    // return of(this.vehicle);
  }

  getVehicleDetails(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.vehicleUrl}/api/v1/vehicles/${id}`);
  }

  getVehiclesByModel(modelId: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.vehicleUrl}/api/v1/vehicles/model/${modelId}`);
  }

  /**
   * Método para obter todos os veículos com paginação e ordenados por ano
   * @param page Número da página a ser retornada
   * @param size Quantidade de veículos por página
   * @returns Um Observable que emite uma resposta paginada com os veículos
   */
  getAll(page: number, size: number , statusFilter: string ='all'): Observable<PaginatedResponse<Vehicle>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', 'year');

    if (statusFilter != 'all') {
      params = params.set('activated', statusFilter); // Adiciona o filtro de status
    }

    return this.http.get<PaginatedResponse<Vehicle>>(`${this.vehicleUrl}/api/v1/vehicles`, { params: params }).pipe(
    );
  }

  register(vehicle: IVehicleRequest): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.vehicleUrl}/api/v1/vehicles`, vehicle).pipe(
    );
  }

  update(id: number, vehicle: IVehicleRequest): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.vehicleUrl}/api/v1/vehicles/${id}`, vehicle).pipe(
    );
  }

  activate(id: number): Observable<any> {
    Todo: // Verificar a necessidade de enviar o token no header para ativar o veículo
    return this.http.put<any>(`${this.vehicleUrl}/api/v1/vehicles/enable/${id}`, { headers: this.headers }).pipe(
    );
  }

  deactivate(id: number): Observable<any> {
    return this.http.delete<any>(`${this.vehicleUrl}/api/v1/vehicles/${id}`).pipe(
    );
  }

  // cadastro de Autonomia
  registerAutonomy(autonomy: any): Observable<any> {
    return this.http.post<any>(`${this.vehicleUrl}/api/v1/vehicles/autonomy`, autonomy).pipe(
    );
  }

}
