import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Model } from '../../models/Model';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private modelUrl: string;

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzI0MTAxMzk4LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.DmpcZfLIXbvcVg8g5QOSHS7-oG7TLq9kapiXJDf-REM';

  constructor(private http: HttpClient) {
    this.modelUrl = `${environment.apiUrl}/api/v1/models`;
  }

  getModelsByBrandId(brandId: number): Observable<Model[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
    return this.http.get<Model[]>(`${this.modelUrl}/brand/${brandId}`, { headers });
  }
}
