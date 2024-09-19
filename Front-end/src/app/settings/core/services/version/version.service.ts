import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private vehicleUrl: string; // Replace with your actual API URL

  constructor(private http: HttpClient) {
    this.vehicleUrl = `${environment.apiUrl}`;
  }
  getVersionsByModelId(modelId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.vehicleUrl}/vehicle/model/${modelId}`);
  }
}
