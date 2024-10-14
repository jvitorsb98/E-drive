import { TestBed } from '@angular/core/testing';
import { CanMatchFn, Router, UrlTree, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { canMatchGuard } from './can-match.guard';

// Mock do ActivatedRouteSnapshot
const routeMock = {
  url: [] as UrlSegment[],  // Array de UrlSegment vazio
  params: {},                // Objeto de parâmetros vazio
  queryParams: {},           // Objeto de parâmetros de consulta vazio
  fragment: '',              // Fragmento vazio
  data: {},                  // Dados vazios
} as any;  // Usar `as any` para evitar erros de tipo, ajuste conforme necessário

describe('canMatchGuard', () => {
  let authService: AuthService;
  let router: Router;

  const executeGuard: CanMatchFn = (route, state) => 
      TestBed.runInInjectionContext(() => canMatchGuard(route, state));

  beforeEach(() => {
    const routerMock = {
      createUrlTree: jest.fn(),
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
    
    const stateMock: any = {}; // Mock do estado da rota

    // Act
    const result = executeGuard(routeMock, stateMock);

    // Assert
    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to login when the user is not logged in', () => {
    // Arrange
    jest.spyOn(authService, 'isLoggedIn').mockReturnValue(false);
    
    const stateMock: any = {}; // Mock do estado da rota
    const urlTreeMock: UrlTree = {} as UrlTree; // Mock do objeto URL tree
    jest.spyOn(router, 'createUrlTree').mockReturnValue(urlTreeMock);

    // Act
    const result = executeGuard(routeMock, stateMock);

    // Assert
    expect(result).toEqual(urlTreeMock);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/e-driver/login']);
  });
});
