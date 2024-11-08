import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserLoginComponent } from './user-login.component';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertasService } from '../../../services/Alertas/alertas.service';
import { ModalService } from '../../../services/modal/modal.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ILoginResponse } from '../../../models/inter-Login';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

describe('UserLoginModalComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;
  let alertasServiceMock: jest.Mocked<AlertasService>;
  let modalServiceMock: jest.Mocked<ModalService>;
  let dialogMock: jest.Mocked<MatDialog>;
  let activatedRouteMock: jest.Mocked<ActivatedRoute>;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    } as any;

    routerMock = {
      navigate: jest.fn(),
    } as any;

    alertasServiceMock = {
      showError: jest.fn(),
    } as any;

    modalServiceMock = {
      openModal: jest.fn(),
    } as any;

    dialogMock = {
      closeAll: jest.fn(),
      open: jest.fn(),
    } as any;

    activatedRouteMock = {
      snapshot: {
        queryParams: {},
      },
      queryParams: of({ success: 'Success message', error: 'Error message' }), // Mock do Observable de queryParams
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        NoopAnimationsModule,
      ],
      declarations: [UserLoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }, // Mock para ActivatedRoute
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.controls['email'].valid).toBeFalsy();
    expect(component.loginForm.controls['password'].valid).toBeFalsy();
  });

  it('should navigate to dashboard on successful login', async () => {
    const mockResponse: ILoginResponse = { token: 'mockToken' };

    // Mock para retornar um Observable válido
    authServiceMock.login.mockReturnValue(of(mockResponse));

    component.loginForm.setValue({ email: 'test@example.com', password: 'newPassword123' });
    await component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      login: 'test@example.com',
      password: 'newPassword123',
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['e-driver/dashboard']);
    expect(dialogMock.closeAll).toHaveBeenCalled();
  });

  it('should show error on login failure', async () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Unauthorized' },
      status: 401,
      statusText: 'Unauthorized',
    });

    // Mock da resposta para simular erro ao fazer login

    // Mock para simular erro ao fazer login
    authServiceMock.login.mockReturnValue(throwError(() => errorResponse));

    // Configurar o formulário com dados inválidos

    component.loginForm.setValue({ email: 'test@example.com', password: 'newPassword123' });


    await component.onSubmit();

    // Verifica se o método de login foi chamado

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(alertasServiceMock.showError).toHaveBeenCalledWith('Erro de Autenticação', 'Http failure response for (unknown url): 401 Unauthorized');
    expect(component.loginForm.controls['email'].errors).toEqual({ invalid: true });
    expect(component.loginForm.controls['password'].errors).toEqual({ invalid: true });
  });


  it('should call modalResetPassword method', () => {
    component.modalResetPassword(true);
    expect(modalServiceMock.openModal).toHaveBeenCalled();
  });

  it('should call openFAQModal method', () => {
    component.openFAQModal();
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should call goBack method', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should close dialog', () => {
    component.closeDialog();
    expect(dialogMock.closeAll).toHaveBeenCalled();
  });
});
