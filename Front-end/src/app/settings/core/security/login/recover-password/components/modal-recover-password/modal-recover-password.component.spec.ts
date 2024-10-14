import { of, throwError } from 'rxjs';
import { ModalRecoverPasswordComponent } from './modal-recover-password.component';
import { AuthService } from '../../../../services/auth/auth.service';
import { AlertasService } from './../../../../../services/Alertas/alertas.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { IRecoverPasswordResponse } from '../../../../../models/inter-Login';

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
  it('should call recoverPasswordRequest when form is valid', () => {
    component.ngOnInit();
    component.recoverPasswordForm.setValue({ email: 'test@example.com' });
  
    // Crie um mock que atenda à interface IRecoverPasswordResponse
    const mockResponse: IRecoverPasswordResponse = { token: 'mockToken' }; // Adicione a propriedade token
  
    jest.spyOn(authService, 'recoverPasswordRequest').mockReturnValue(of(mockResponse));
  
    component.onSubmit();
  
    expect(authService.recoverPasswordRequest).toHaveBeenCalledWith('test@example.com');
    expect(alertasService.showSuccess).toHaveBeenCalledWith(
      "Redefinição de senha",
      "Um e-mail de redefinição de senha foi enviado para: test@example.com"
    );
  });
  
  it('should call recoverAccountRequest when isPasswordRecovery is false', () => {
    component.data.isPasswordRecovery = false; // Simular recuperação de conta
    component.ngOnInit();
    component.recoverPasswordForm.setValue({ email: 'test@example.com' });
  
    // Crie um mock que atenda à interface IRecoverPasswordResponse
    const mockResponse: IRecoverPasswordResponse = { token: 'mockToken' }; // Adicione a propriedade token
  
    jest.spyOn(authService, 'recoverAccountRequest').mockReturnValue(of(mockResponse));
  
    component.onSubmit();
  
    expect(authService.recoverAccountRequest).toHaveBeenCalledWith('test@example.com');
    expect(alertasService.showSuccess).toHaveBeenCalledWith(
      "Recuperação de conta",
      "Um e-mail de recuperação de conta foi enviado para: test@example.com"
    );
  });
  

  it('should handle error on recoverPasswordRequest', () => {
    component.ngOnInit();
    component.recoverPasswordForm.setValue({ email: 'test@example.com' });

    const mockError = new HttpErrorResponse({ error: { message: 'Error' }, status: 500 });
    jest.spyOn(authService, 'recoverPasswordRequest').mockReturnValue(throwError(mockError));

    component.onSubmit();

    expect(alertasService.showError).toHaveBeenCalledWith("Redefinição de senha", 'Error');
  });

  it('should handle error on recoverAccountRequest', () => {
    component.data.isPasswordRecovery = false; // Simular recuperação de conta
    component.ngOnInit();
    component.recoverPasswordForm.setValue({ email: 'test@example.com' });

    const mockError = new HttpErrorResponse({ error: { message: 'Error' }, status: 500 });
    jest.spyOn(authService, 'recoverAccountRequest').mockReturnValue(throwError(mockError));

    component.onSubmit();

    expect(alertasService.showError).toHaveBeenCalledWith("Recuperação de conta", 'Error');
  });
});
