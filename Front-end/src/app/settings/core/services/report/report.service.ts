import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private reportUrl: string;

  constructor(private http: HttpClient) {
    this.reportUrl = `${environment.apiUrl}/api/v1/reports`;
  }

  getMostRegisteredCarsReport(): Observable<Blob> {
    return this.http.get(`${this.reportUrl}/most-registered-cars`, {
      responseType: 'blob' // Indica que a resposta será um arquivo binário
    });
  }
}
