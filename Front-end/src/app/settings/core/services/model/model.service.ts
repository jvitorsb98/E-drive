import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Model } from '../../models/model';
import { AuthService } from '../../security/services/auth/auth.service';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private modelUrl: string;

  authToken: string | null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.modelUrl = `${environment.apiUrl}/api/v1/models`;

    this.authToken = this.authService.getToken();
  }

  // Método para obter todas as marcas
  getAllModels(): Observable<PaginatedResponse<Model>> {
    return this.http.get<PaginatedResponse<Model>>(this.modelUrl);
  }

  getModelsByBrandId(brandId: number): Observable<Model[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
    todo: // Trocar por um interceptor para adicionar o token ao cabecalho
    return this.http.get<Model[]>(`${this.modelUrl}/brand/${brandId}`, { headers });
  }

  registerModel(model: Model): Observable<Model> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<Model>(this.modelUrl, model, { headers }).pipe(
      map(response => {
        console.log('Model cadastrada com sucesso:', response);
        return response;
      }),
      catchError(e => {
        console.error('Erro ao cadastrar model:', e.error ? e.error : e.message);
        return throwError(() => e);
      })
    );
  }

  updateModel(model: Model): Observable<Model> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });
    console.log("Modelo no service:", model);
    // Verifica se a brand possui um ID e outros campos obrigatórios antes de fazer a requisição
    if (!model.id || !model.name) {
      return throwError(() => new Error('Dados do modelo são insuficientes para atualização.'));
    }

    return this.http.put<Model>(`${this.modelUrl}/${model.id}`, model, { headers }).pipe(
      map(response => {
        console.log("Dados do modelo atualizado:", response);
        return response;
      }),
      catchError(e => {
        console.error('Erro ao atualizar o modelo:', e.error ? e.error : e.message);
        return throwError(() => e);
      })
    );
  }

  deleteModel(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<void>(`${this.modelUrl}/${id}`, { headers });
  }
}
