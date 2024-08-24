import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private baseUrl = 'your-api-url'; // Replace with your actual API URL

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzI0NDYzMDM0LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.sAH_18Ugjbio3Qujq4ec3DYPxLm7H_7a73Vt4sdbzZU';

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiUrl}`;
  }
  getVersionsByModelId(modelId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/vehicle/model/${modelId}`);
  }
}