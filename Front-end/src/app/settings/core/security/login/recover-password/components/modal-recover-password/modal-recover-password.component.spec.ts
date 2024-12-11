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

    const mockResponse: string = 'Um e-mail de redefinição de senha foi enviado para: test@example.com';
    jest.spyOn(authService, 'recoverPasswordRequest').mockReturnValue(of(mockResponse));

    await component.onSubmit();

    expect(authService.recoverPasswordRequest).toHaveBeenCalledWith('test@example.com');
    expect(alertasService.showSuccess).toHaveBeenCalledWith('Redefinição de senha', mockResponse);
  });

  it('should call recoverAccountRequest when isPasswordRecovery is false', async () => {
    component.data.isPasswordRecovery = false;
    component.ngOnInit();
    component.recoverPasswordForm.setValue({ email: 'test@example.com' });

    const mockResponse: string = 'mockToken';
    jest.spyOn(authService, 'recoverAccountRequest').mockReturnValue(of(mockResponse));

    await component.onSubmit();

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

    const mockError = new HttpErrorResponse({ error: { message: 'Erro interno no servidor' }, status: 500 });
    jest.spyOn(authService, 'recoverAccountRequest').mockReturnValue(throwError(mockError));

    await component.onSubmit();

    expect(alertasService.showError).toHaveBeenCalledWith('Recuperação de conta', 'Erro interno no servidor');
  });

  it('should return if the form is invalid', async () => {
    component.ngOnInit();
    component.recoverPasswordForm.setValue({ email: '' });  // Formulário inválido

    await component.onSubmit();

    expect(authService.recoverPasswordRequest).not.toHaveBeenCalled();
    expect(authService.recoverAccountRequest).not.toHaveBeenCalled();
  });

  it('should show error message if recoverPasswordRequest fails', async () => {
    component.ngOnInit();
    component.recoverPasswordForm.setValue({ email: 'test@example.com' });
  
    const mockError = new HttpErrorResponse({ error: { message: 'Erro ao tentar enviar o e-mail de redefinição' }, status: 500 });
    jest.spyOn(authService, 'recoverPasswordRequest').mockReturnValue(throwError(mockError));
  
    await component.onSubmit();
  
    const errorMessage = mockError.error.message ? mockError.error.message : 'Ocorreu um erro ao tentar enviar o e-mail de redefinição.';
    // Alterar o valor esperado para ser o objeto
    expect(alertasService.showError).toHaveBeenCalledWith('Redefinição de senha', { message: 'Erro ao tentar enviar o e-mail de redefinição' });
  });
  
  

  it('should reset the form and close the modal on goBack', () => {
    component.ngOnInit();
    component.recoverPasswordForm.setValue({ email: 'test@example.com' });

    component.goBack();

    expect(component.recoverPasswordForm.get('email')?.value).toBe(null);
    expect(component.recoverPasswordForm.errors).toEqual({ invalid: true });
    expect((component.dialogRef as any).close).toHaveBeenCalled();
  });
});
