import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmAccountComponent } from './confirm-account.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from '../../../../../services/Alertas/alertas.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { of, throwError } from 'rxjs';

// Usar Partial para permitir que apenas algumas propriedades sejam definidas
class MockAlertasService implements Partial<AlertasService> {
  showSuccess = jest.fn();
  showError = jest.fn().mockResolvedValue(Promise.resolve());
}

class MockAuthService {
  confirmAccount = jest.fn().mockReturnValue(of({})); // Mock de sucesso
}

class MockRouter {
  navigate = jest.fn();
}

describe('ConfirmAccountComponent', () => {
  let component: ConfirmAccountComponent;
  let fixture: ComponentFixture<ConfirmAccountComponent>;
  let alertasService: AlertasService; // Mantenha o tipo original
  let authService: AuthService; // Mantenha o tipo original
  let router: Router; // Mantenha o tipo original

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmAccountComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: jest.fn(() => null), // Mock inicial com token nulo
              },
            },
          },
        },
        { provide: AlertasService, useClass: MockAlertasService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAccountComponent);
    component = fixture.componentInstance;
    alertasService = TestBed.inject(AlertasService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges(); // Inicializa o componente
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm account if token is present', () => {
    const token = 'some-token';
    (TestBed.inject(ActivatedRoute).snapshot.queryParamMap.get as jest.Mock).mockReturnValue(token);
    
    component.ngOnInit();

    expect(authService.confirmAccount).toHaveBeenCalledWith(token);
    expect(alertasService.showSuccess).toHaveBeenCalledWith('Confirmação de conta', 'Sua conta foi recuperada com sucesso.');
    expect(router.navigate).toHaveBeenCalledWith(['/e-driver/login']);
  });

  it('should handle error if token confirmation fails', () => {
    const token = 'some-token';
    (TestBed.inject(ActivatedRoute).snapshot.queryParamMap.get as jest.Mock).mockReturnValue(token);

    // Mock da função confirmAccount para falha
    jest.spyOn(authService, 'confirmAccount').mockReturnValue(throwError(() => ({ error: { message: 'Error' } })));

    component.ngOnInit();

    expect(alertasService.showError).toHaveBeenCalledWith('Confirmação de conta', 'Error');
    expect(router.navigate).toHaveBeenCalledWith(['/e-driver/login']);
  });

  it('should show error and navigate if token is absent', () => {
    component.ngOnInit();
    
    expect(alertasService.showError).toHaveBeenCalledWith('Erro', 'Token de confirmação inválido ou ausente.');
    expect(router.navigate).toHaveBeenCalledWith(['/e-driver/login']);
  });
});
