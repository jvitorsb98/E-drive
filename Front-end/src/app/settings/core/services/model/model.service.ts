import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Model } from '../../models/model';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private modelUrl: string;

  constructor(private http: HttpClient) {
    this.modelUrl = `${environment.apiUrl}/api/v1/models`;
  }

  // Método para obter todas as marcas
  getAll(page: number, size: number): Observable<PaginatedResponse<Model>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'name'); // Ordenação pelo nome em ordem ascendente

    return this.http.get<PaginatedResponse<Model>>(this.modelUrl, { params: params }).pipe(
      catchError(() => throwError(() => new Error('Failed to load models')))
    );
  }

  getModelsByBrandId(brandId: number): Observable<Model[]> {
    return this.http.get<Model[]>(`${this.modelUrl}/brand/${brandId}`);
  }

  register(model: Model): Observable<Model> {
    return this.http.post<Model>(this.modelUrl, model).pipe(
      map(response => {
        return response;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  update(model: Model): Observable<Model> {
    // Verifica se a brand possui um ID e outros campos obrigatórios antes de fazer a requisição
    if (!model.id || !model.name) {
      return throwError(() => new Error('Dados do modelo são insuficientes para atualização.'));
    }

    return this.http.put<Model>(`${this.modelUrl}/${model.id}`, model).pipe(
      map(response => {
        return response;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.modelUrl}/${id}`);
  }

  activated(id: number): Observable<void> {
    return this.http.put<void>(`${this.modelUrl}/${id}/activate`, null).pipe(
      catchError(e => {
        console.error('Erro ao ativar o modelo:', e);
        return throwError(() => e);
      })
    );
  }

}