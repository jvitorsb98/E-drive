import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VehicleService } from './vehicle.service';
import { AuthService } from '../../security/services/auth/auth.service';
import { Vehicle, IVehicleRequest } from '../../models/vehicle';
import { environment } from '../../../../../environments/environment';
import { PaginatedResponse } from '../../models/paginatedResponse';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpMock: HttpTestingController;
  let authServiceMock: Partial<AuthService>;
  let mockAuthService: AuthService;

  const mockToken = 'mocked-token';
  const apiUrl = `${environment.apiUrl}/api/v1/vehicles`;

  beforeEach(() => {
    authServiceMock = {
      getToken: jest.fn().mockReturnValue(mockToken)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VehicleService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(VehicleService);
    httpMock = TestBed.inject(HttpTestingController);
    mockAuthService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all vehicles', () => {
    const mockVehicles: Vehicle[] = [{ id: 1, motor: 'Motor A', version: 'Versão X', model: {} as any, category: {} as any, type: {} as any, propulsion: {} as any, autonomy: {} as any, activated: true, year: 2022 }];

    service.getAllVehicle().subscribe(vehicles => {
      expect(vehicles).toEqual(mockVehicles);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockVehicles);
  });

  it('should fetch vehicle details by id', () => {
    const vehicleId = 1;
    const mockVehicle: Vehicle = { id: vehicleId, motor: 'Motor A', version: 'Versão X', model: {} as any, category: {} as any, type: {} as any, propulsion: {} as any, autonomy: {} as any, activated: true, year: 2022 };

    service.getVehicleDetails(vehicleId).subscribe(vehicle => {
      expect(vehicle).toEqual(mockVehicle);
    });

    const req = httpMock.expectOne(`${apiUrl}/${vehicleId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockVehicle);
  });

  it('should fetch vehicles by model', () => {
    const modelId = 1;
    const mockVehicles: Vehicle[] = [{ id: 1, motor: 'Motor A', version: 'Versão X', model: {} as any, category: {} as any, type: {} as any, propulsion: {} as any, autonomy: {} as any, activated: true, year: 2022 }];

    service.getVehiclesByModel(modelId).subscribe(vehicles => {
      expect(vehicles).toEqual(mockVehicles);
    });

    const req = httpMock.expectOne(`${apiUrl}/model/${modelId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockVehicles);
  });

  it('should register a new vehicle', () => {
    const newVehicle: IVehicleRequest = {
      motor: 'Motor B',
      version: 'Versão Y',
      modelId: 1,
      categoryId: 2,
      typeId: 3,
      propulsionId: 4,
      year: 2023,
      dataRegisterAutonomy: { mileagePerLiterRoad: 15, mileagePerLiterCity: 12, consumptionEnergetic: 8, autonomyElectricMode: 100 }
    };
    const mockResponse: Vehicle = { id: 2, motor: 'Motor B', version: 'Versão Y', model: {} as any, category: {} as any, type: {} as any, propulsion: {} as any, autonomy: {} as any, activated: true, year: 2023 };

    service.register(newVehicle).subscribe(vehicle => {
      expect(vehicle).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newVehicle);
    req.flush(mockResponse);
  });

  it('should update a vehicle by id', () => {
    const vehicleId = 1;
    const updatedVehicle: IVehicleRequest = {
      motor: 'Motor C',
      version: 'Versão Z',
      modelId: 1,
      categoryId: 2,
      typeId: 3,
      propulsionId: 4,
      year: 2024,
      dataRegisterAutonomy: { mileagePerLiterRoad: 16, mileagePerLiterCity: 13, consumptionEnergetic: 7.5, autonomyElectricMode: 120 }
    };
    const mockResponse: Vehicle = { id: vehicleId, motor: 'Motor C', version: 'Versão Z', model: {} as any, category: {} as any, type: {} as any, propulsion: {} as any, autonomy: {} as any, activated: true, year: 2024 };

    service.update(vehicleId, updatedVehicle).subscribe(vehicle => {
      expect(vehicle).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/${vehicleId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedVehicle);
    req.flush(mockResponse);
  });

  it('should deactivate a vehicle by id', () => {
    const vehicleId = 1;
    const mockResponse = { message: 'Vehicle deactivated' };

    service.deactivate(vehicleId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/${vehicleId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
