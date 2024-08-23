import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private baseUrl = 'your-api-url'; // Replace with your actual API URL

  private authToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzI0Mzg5MjI1LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.da4bItRVxkavZYWjxxRrweYT508pZwmCIAdvrSd1JSs';


  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiUrl}`;
  }
  getVersionsByModelId(modelId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/vehicle/model/${modelId}`);
  }
}