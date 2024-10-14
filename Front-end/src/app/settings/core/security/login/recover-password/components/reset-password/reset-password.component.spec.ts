import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../../../services/auth/auth.service';
import { AlertasService } from '../../../../../services/Alertas/alertas.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authService: AuthService;
  let alertasService: AlertasService;
  let router: Router;

  function createComponentWithToken(token: string) {
    const activatedRouteMock = {
      snapshot: {
        queryParams: {
          token
        }
      }
    };

    const authServiceMock = {
      resetPassword: jest.fn()
    };

    const alertasServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn().mockReturnValue(Promise.resolve())
    };

    const routerMock = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ResetPasswordComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    alertasService = TestBed.inject(AlertasService);
    router = TestBed.inject(Router);

    return { fixture, component, router, alertasService, authService };
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the form', () => {
    const { component } = createComponentWithToken('mockToken');
    component.ngOnInit(); // Certifique-se de chamar ngOnInit aqui
    expect(component.resetPasswordForm).toBeTruthy();
    expect(component.resetPasswordForm.controls['password'].value).toBe(null);
    expect(component.resetPasswordForm.controls['confirmPassword'].value).toBe(null);
  });

  it('should close and navigate to login', () => {
    const { component, router } = createComponentWithToken('mockToken');
    component.ngOnInit(); // Chame ngOnInit antes de fechar
    component.close();
    expect(router.navigate).toHaveBeenCalledWith(['/e-driver/login']);
  });

  it('should display error message and navigate to login on invalid token', async () => {
    const { component, router, alertasService } = createComponentWithToken('');
    await component.ngOnInit(); // Certifique-se de aguardar ngOnInit
    expect(alertasService.showError).toHaveBeenCalledWith('Erro', 'Token inválido. Por favor, tente novamente.');
    expect(router.navigate).toHaveBeenCalledWith(['/e-driver/login']);
  });

  it('should call resetPassword when form is valid', async () => {
    const { component, router, authService, alertasService } = createComponentWithToken('mockToken');
    component.ngOnInit();
  
    // Preenche o formulário com dados válidos
    component.resetPasswordForm.controls['password'].setValue('newPassword123');
    component.resetPasswordForm.controls['confirmPassword'].setValue('newPassword123');
  
    // Simula a resposta do método resetPassword
    (authService.resetPassword as jest.Mock).mockReturnValue(of({ success: true }));
  
    // Simula a Promise retornada por showSuccess com os argumentos corretos
    (alertasService.showSuccess as jest.Mock).mockResolvedValueOnce({});
  
    // Chama o método de envio do formulário
    await component.onSubmit();
  
    // Verifica se resetPassword foi chamado com os argumentos corretos
    expect(authService.resetPassword).toHaveBeenCalledWith({
      token: 'mockToken',
      password: 'newPassword123'
    });
  
    // Verifica se showSuccess foi chamado com os argumentos corretos
    expect(alertasService.showSuccess).toHaveBeenCalledWith('Redefinição de senha', 'Sua senha foi redefinida com sucesso!');
  
    // Verifica se router.navigate foi chamado após o showSuccess
    expect(router.navigate).toHaveBeenCalledWith(['/e-driver/login']);
  });
  
  
  
  it('should show error if resetPassword fails', async () => {
    const { component, authService, alertasService } = createComponentWithToken('mockToken');
    component.ngOnInit();
  
    // Preenche o formulário com dados válidos
    component.resetPasswordForm.controls['password'].setValue('newPassword123');
    component.resetPasswordForm.controls['confirmPassword'].setValue('newPassword123');
  
    // Simula um erro ao chamar resetPassword
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Erro ao redefinir a senha' },
      status: 400
    });
    (authService.resetPassword as jest.Mock).mockReturnValue(throwError(errorResponse));
  
    // Chama o método de envio do formulário
    await component.onSubmit();
  
    // Verifica se a função resetPassword foi chamada
    expect(authService.resetPassword).toHaveBeenCalledWith({
      token: 'mockToken',
      password: 'newPassword123'
    });
  
    // Verifica se o serviço de alertas foi chamado com os parâmetros corretos
    expect(alertasService.showError).toHaveBeenCalledWith('Redefinição de senha', 'Erro ao redefinir a senha');
  });
  
  
  

  it('should validate password fields', () => {
    const { component } = createComponentWithToken('mockToken');
    component.ngOnInit(); // Adicione esta linha para garantir que o formulário seja inicializado

    // Verifica se o formulário é inválido inicialmente
    expect(component.resetPasswordForm.valid).toBeFalsy();

    // Preenche o formulário com uma senha que não atende aos critérios
    component.resetPasswordForm.controls['password'].setValue('short'); // Senha curta
    component.resetPasswordForm.controls['confirmPassword'].setValue('short');

    expect(component.resetPasswordForm.valid).toBeFalsy(); // O formulário deve ser inválido

    // Corrige a senha
    component.resetPasswordForm.controls['password'].setValue('newPassword123');
    component.resetPasswordForm.controls['confirmPassword'].setValue('newPassword123');

    expect(component.resetPasswordForm.valid).toBeTruthy(); // O formulário deve ser válido agora
  });
});
