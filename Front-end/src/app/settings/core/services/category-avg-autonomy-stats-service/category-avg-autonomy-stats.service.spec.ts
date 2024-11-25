import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryAvgAutonomyStatsService } from './category-avg-autonomy-stats.service';
import { DataCategoryAvgAutonomyStats } from '../../models/DataCategoryAvgAutonomyStats';
import { environment } from '../../../../../environments/environment';

describe('CategoryAvgAutonomyStatsService', () => {
  let service: CategoryAvgAutonomyStatsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryAvgAutonomyStatsService]
    });
    service = TestBed.inject(CategoryAvgAutonomyStatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAvgAutonomyStats', () => {
    it('should return average autonomy stats data (successful response)', () => {
      const id = 1;
      const mockResponse: DataCategoryAvgAutonomyStats = {
        id: 1,
        category: 'SUV',
        avgAutonomyElectricMode: 250.5 // Exemplo de valor para BigDecimal como número
      };

      service.getAvgAutonomyStats(id).subscribe((data) => {
        expect(data).toEqual(mockResponse);
        expect(data.id).toBe(1);
        expect(data.category).toBe('SUV');
        expect(data.avgAutonomyElectricMode).toBe(250.5);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/category-avg-autonomy-stats/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error when API returns an error', () => {
      const id = 1;
      const errorMessage = 'An error occurred while fetching average autonomy stats.';

      service.getAvgAutonomyStats(id).subscribe(
        () => fail('expected an error, not data'),
        (error: Error) => {
          expect(error.message).toBe(errorMessage);
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/category-avg-autonomy-stats/${id}`);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});