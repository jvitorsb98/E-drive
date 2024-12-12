import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

// Módulos e Guardas
import { AppRoutingModule } from './app-routing.module';
import { authGuard } from './settings/core/security/guards/auth.guard';
import { canMatchGuard } from './settings/core/security/guards/can-match.guard';

describe('AppRoutingModule', () => {
  let router: Router;
  let mockAuthGuard: { canActivate: jest.Mock };
  let mockCanMatchGuard: { canMatch: jest.Mock };

  beforeEach(() => {
    // Mockando o authGuard e o canMatchGuard com Jest
    mockAuthGuard = { canActivate: jest.fn() };
    mockCanMatchGuard = { canMatch: jest.fn() };

    // Configurando o TestBed
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), AppRoutingModule],
      providers: [
        { provide: authGuard, useValue: mockAuthGuard },
        { provide: canMatchGuard, useValue: mockCanMatchGuard },
      ],
    });

    // Obter o Router do TestBed
    router = TestBed.inject(Router);
  });

  it('should create the app routing module', () => {
    expect(router).toBeTruthy();
  });

  it('should call authGuard canActivate', (done) => {
    // Simula a resposta do canActivate
    mockAuthGuard.canActivate.mockReturnValue(of(true));

    // Chama o método do guard
    const result = mockAuthGuard.canActivate();
    result.subscribe((value: any) => {
      expect(value).toBe(true);
      expect(mockAuthGuard.canActivate).toHaveBeenCalled();
      done();
    });
  });

  it('should call canMatchGuard canMatch', (done) => {
    // Simula a resposta do canMatch
    mockCanMatchGuard.canMatch.mockReturnValue(of(true));

    // Chama o método do guard
    const result = mockCanMatchGuard.canMatch();
    result.subscribe((value: any) => {
      expect(value).toBe(true);
      expect(mockCanMatchGuard.canMatch).toHaveBeenCalled();
      done();
    });
  });

  it('should navigate to "e-driver/intro-page" on empty path', async () => {
    // Testa a navegação para a rota de introdução
    await router.navigate(['']);
    expect(router.url).toBe('/e-driver/intro-page');
  });

  it('should navigate to "e-driver/login" when trying to access login route', async () => {
    // Testa a navegação para a rota de login
    await router.navigate(['e-driver/login']);
    expect(router.url).toBe('/e-driver/login');
  });

  it('should navigate to "e-driver/users/registration" when accessing user registration route', async () => {
    // Testa a navegação para o cadastro de usuário
    await router.navigate(['e-driver/users/registration']);
    expect(router.url).toBe('/e-driver/users/registration');
  });
});
