import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { authGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  const executeGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
      TestBed.runInInjectionContext(() => authGuard(route, state));

  beforeEach(() => {
    const routerMock = {
      navigate: jest.fn(),
    };

    const authServiceMock = {
      isLoggedIn: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access when the user is logged in', () => {
    // Arrange
    jest.spyOn(authService, 'isLoggedIn').mockReturnValue(true);

    // Act
    const result = executeGuard(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot);

    // Assert
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when the user is not logged in', () => {
    // Arrange
    jest.spyOn(authService, 'isLoggedIn').mockReturnValue(false);

    // Act
    const result = executeGuard(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot);

    // Assert
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/e-driver/login']);
  });
});
