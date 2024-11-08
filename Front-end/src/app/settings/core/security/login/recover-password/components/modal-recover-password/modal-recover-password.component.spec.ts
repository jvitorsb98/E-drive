import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { IRecoverPasswordResponse } from '../../../../../models/inter-Login';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRecoverPasswordComponent } from './modal-recover-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertasService } from '../../../../../services/Alertas/alertas.service';
import { AuthService } from '../../../../services/auth/auth.service';

describe('ModalRecoverPasswordComponent', () => {
  let component: ModalRecoverPasswordComponent;
  let fixture: ComponentFixture<ModalRecoverPasswordComponent>;
  let authService: AuthService;
  let alertasService: AlertasService;

  beforeEach(() => {
    const authServiceMock = {
      recoverPasswordRequest: jest.fn(),
      recoverAccountRequest: jest.fn(),
    };

    const alertasServiceMock = {
      showSuccess: jest.fn().mockResolvedValue(undefined),
      showError: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule],
      declarations: [ModalRecoverPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { email: 'test@example.com', isPasswordRecovery: true },
        },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRecoverPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    alertasService = TestBed.inject(AlertasService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with provided email', () => {
    component.ngOnInit();
    expect(component.recoverPasswordForm.get('email')?.value).toBe('test@example.com');
  });

  it('should call recoverPasswordRequest when form is valid', async () => {
    component.ngOnInit();
    component.recoverPasswordForm.setValue({ email: 'test@example.com' });
  
    // Mock da resposta agora retornando uma string (mensagem)
    const mockResponse: string = 'Um e-mail de redefinição de senha foi enviado para: test@example.com';
    jest.spyOn(authService, 'recoverPasswordRequest').mockReturnValue(of(mockResponse));
  
    await component.onSubmit();  // Aguarde o retorno da promessa
  
    expect(authService.recoverPasswordRequest).toHaveBeenCalledWith('test@example.com');
    expect(alertasService.showSuccess).toHaveBeenCalledWith(
      'Redefinição de senha',
      mockResponse  // Agora comparando com a resposta mockada (a string)
    );
  });
  
  

  it('should call recoverAccountRequest when isPasswordRecovery is false', async () => {
    component.data.isPasswordRecovery = false;
    component.ngOnInit();
    component.recoverPasswordForm.setValue({ email: 'test@example.com' });

    // Mock da resposta agora retornando uma string
    const mockResponse: string = 'mockToken'; // Retorna um token como string
    jest.spyOn(authService, 'recoverAccountRequest').mockReturnValue(of(mockResponse));

    await component.onSubmit();  // Aguarde o retorno da promessa

    expect(authService.recoverAccountRequest).toHaveBeenCalledWith('test@example.com');
    expect(alertasService.showSuccess).toHaveBeenCalledWith(
      'Recuperação de conta',
      'Um e-mail de recuperação de conta foi enviado para: test@example.com'
    );
  });

  
  
  
  

  it('should handle error on recoverAccountRequest', async () => {
    component.data.isPasswordRecovery = false;
    component.ngOnInit();
    component.recoverPasswordForm.setValue({ email: 'test@example.com' });

    // Mock de erro com a propriedade 'message' esperada no erro
    const mockError = new HttpErrorResponse({ error: { message: 'Erro interno no servidor' }, status: 500 });
    jest.spyOn(authService, 'recoverAccountRequest').mockReturnValue(throwError(mockError));

    await component.onSubmit();  // Aguarde o retorno da promessa

    expect(alertasService.showError).toHaveBeenCalledWith('Recuperação de conta', 'Erro interno no servidor');
  });
});
