import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { DataCategoryAvgAutonomyStats } from '../../models/DataCategoryAvgAutonomyStats';

@Injectable({
  providedIn: 'root'
})
export class CategoryAvgAutonomyStatsService {

  private statsUrl: string;

  constructor(private http: HttpClient) {
    this.statsUrl = `${environment.apiUrl}/api/v1/category-avg-autonomy-stats`;
  }

  getAvgAutonomyStats(id: Number): Observable<DataCategoryAvgAutonomyStats> {
    return this.http.get<DataCategoryAvgAutonomyStats>(`${this.statsUrl}/${id}`);
  }
}
