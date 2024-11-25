import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserVehicleService } from './user-vehicle.service';
import { environment } from '../../../../../../environments/environment';
import { IApiResponse } from '../../../models/api-response';
import { PaginatedResponse } from '../../../models/paginatedResponse';
import { UserVehicle } from '../../../models/user-vehicle';

describe('UserVehicleService', () => {
  let service: UserVehicleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserVehicleService],
    });

    service = TestBed.inject(UserVehicleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllUserVehicle', () => {
    it('should retrieve all user vehicles', () => {
      const mockResponse = {
        success: true,
        message: 'Fetched successfully',
        data: [
          {
            id: 1,
            userId: 101,
            vehicleId: 201,
            mileagePerLiterRoad: 15.5,
            mileagePerLiterCity: 12.3,
            consumptionEnergetic: 8.7,
            autonomyElectricMode: 200,
            batteryCapacity: 75,
            activated: true,
          },
          {
            id: 2,
            userId: 102,
            vehicleId: 202,
            mileagePerLiterRoad: 16.5,
            mileagePerLiterCity: 13.1,
            consumptionEnergetic: 9.1,
            autonomyElectricMode: 220,
            batteryCapacity: 80,
            activated: false,
          },
        ] as UserVehicle[],
      };
  
      service.getAllUserVehicle().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
  
      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/vehicle-users/user`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
  

  describe('listAll', () => {
    it('should retrieve a paginated list of user vehicles', () => {
      const mockResponse = {
        content: [{ id: 1, name: 'Vehicle 1' }],
        pageable: { pageNumber: 0, pageSize: 10 },
        totalElements: 1,
        totalPages: 1,
      };

      service.listAll(0, 10).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/vehicle-users/user?page=0&size=10&sort=id`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('registerVehicleUser', () => {
    it('should register a new user vehicle', () => {
      const mockRequest = { name: 'New Vehicle' };
      const mockResponse = { success: true, message: 'Registered successfully' };

      service.registerVehicleUser(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/vehicle-users`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('updateVehicleUser', () => {
    it('should update an existing user vehicle', () => {
      const id = 1;
      const mockRequest = { autonomy: 500 };
      const mockResponse = { success: true, message: 'Updated successfully' };

      service.updateVehicleUser(id, mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/vehicle-users/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('deleteUserVehicle', () => {
    it('should delete a user vehicle', () => {
      const id = 1;

      service.deleteUserVehicle(id).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/vehicle-users/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});