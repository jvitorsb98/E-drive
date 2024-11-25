import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthService } from '../../security/services/auth/auth.service';
import { User } from '../../models/user';
import { environment } from '../../../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authServiceMock: Partial<AuthService>;

  beforeEach(() => {
    authServiceMock = {
      getUserID: jest.fn().mockReturnValue(1),
      getUserEmail: jest.fn().mockReturnValue('test@example.com'),
      getUserDetails: jest.fn().mockReturnValue({ id: 1, email: 'test@example.com' }),
      logout: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get authenticated user details', () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'test@example.com',
      cellPhone: '123456789',
      password: '',
      birth: null,
      countryCode: '+1',
      roles: [{ id: 1, name: 'User' }],
    };

    service.getAuthenticatedUserDetails().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/user/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should register a new user', () => {
    const newUser: User = {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      cellPhone: '987654321',
      password: 'password123',
      birth: null,
      countryCode: '+1',
      roles: [{ id: 2, name: 'Admin'}],
    };
    const mockResponse = 'User registered successfully';

    service.register(newUser).subscribe((response) => {
      expect(response).toEqual({ message: mockResponse });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(mockResponse);
  });

  it('should update a user', () => {
    const updatedUser: User = {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      cellPhone: '987654321',
      password: 'newPassword',
      birth: null,
      countryCode: '+1',
      roles: [{ id: 2, name: 'Admin' }],
    };

    service.update(updatedUser).subscribe((user) => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/user/update`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });

  it('should check if email exists', () => {
    const email = 'test@example.com';

    service.checkEmailExists(email).subscribe((exists) => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/user/exists?email=${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should deactivate a user', () => {
    const userId = 1;

    service.deactivate(userId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get user ID from AuthService', () => {
    expect(service.getUserID()).toBe(1);
  });

  it('should get user email from AuthService', () => {
    expect(service.getUserEmail()).toBe('test@example.com');
  });

  it('should get user details from AuthService', () => {
    const userDetails = service.getUserDetails();
    expect(authServiceMock.getUserDetails).toHaveBeenCalled();
    expect(userDetails).toEqual({ id: 1, email: 'test@example.com' });
  });

  it('should logout using AuthService', () => {
    service.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});