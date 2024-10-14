import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let authService: AuthService;
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    const authServiceMock = {
      getToken: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: AuthService, useValue: authServiceMock },
      ]
    });

    authService = TestBed.inject(AuthService);
    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should add an Authorization header when the token is present', () => {
    // Arrange
    const token = 'mock-token';
    jest.spyOn(authService, 'getToken').mockReturnValue(token);
  
    const requestMock = new HttpRequest('GET', '/api/protected');
    const nextMock = {
      handle: jest.fn().mockReturnValue(of({} as HttpEvent<any>))
    };
  
    // Act
    interceptor.intercept(requestMock, nextMock as any).subscribe();
  
    // Assert
    const modifiedRequest = nextMock.handle.mock.calls[0][0]; // Captura a requisição modificada
    expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${token}`); // Verifica o cabeçalho
  });
  

  it('should not add Authorization header for non-auth URLs', () => {
    // Arrange
    jest.spyOn(authService, 'getToken').mockReturnValue('mock-token');

    const nonAuthUrl = '/auth/login'; // URL que não precisa de autenticação
    const requestMock = new HttpRequest('GET', nonAuthUrl);
    const nextMock = {
      handle: jest.fn().mockReturnValue(of({} as HttpEvent<any>))
    };

    // Act
    interceptor.intercept(requestMock, nextMock as any).subscribe();

    // Assert
    expect(nextMock.handle).toHaveBeenCalledWith(expect.objectContaining({
      headers: expect.not.objectContaining({
        Authorization: expect.any(String)
      })
    }));
  });

  it('should proceed without modifying request if no token is present', () => {
    // Arrange
    jest.spyOn(authService, 'getToken').mockReturnValue(null);

    const requestMock = new HttpRequest('GET', '/api/protected');
    const nextMock = {
      handle: jest.fn().mockReturnValue(of({} as HttpEvent<any>))
    };

    // Act
    interceptor.intercept(requestMock, nextMock as any).subscribe();

    // Assert
    expect(nextMock.handle).toHaveBeenCalledWith(requestMock); // Verifica se a requisição original foi passada
  });
});
