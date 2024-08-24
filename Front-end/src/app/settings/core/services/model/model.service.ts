import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Model } from '../../models/model';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private modelUrl: string;

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzI0NDYzMDM0LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.sAH_18Ugjbio3Qujq4ec3DYPxLm7H_7a73Vt4sdbzZU';

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
