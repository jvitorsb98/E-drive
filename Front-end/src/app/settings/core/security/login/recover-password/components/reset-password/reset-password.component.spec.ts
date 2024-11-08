import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../../services/auth/auth.service';
import { AlertasService } from '../../../../../services/Alertas/alertas.service';
import { FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// Mocks
class MockAuthService {
  resetPassword(request: any) {
    return of({ message: 'Password reset successfully' }); // Simula uma resposta bem-sucedida
  }
}

class MockAlertasService {
  showSuccess(title: string, message: string) {
    return Promise.resolve(); // Simula um sucesso
  }
  showError(title: string, message: string) {
    return Promise.resolve(); // Simula um erro
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let mockActivatedRoute: any;
  let mockAuthService: MockAuthService;
  let mockAlertasService: MockAlertasService;
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        queryParams: { token: 'mockToken' } // Simula o token da URL
      }
    };

    mockAuthService = new MockAuthService();
    mockAlertasService = new MockAlertasService();
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuthService },
        { provide: AlertasService, useValue: mockAlertasService },
        { provide: Router, useValue: mockRouter },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Força a execução do ngOnInit()
  });

  it('should create the component and initialize with token', () => {
    expect(component).toBeTruthy();
    expect(component.token).toBe('mockToken');
  });

  it('should initialize the form correctly', () => {
    expect(component.resetPasswordForm).toBeTruthy();
    expect(component.resetPasswordForm.controls['password']).toBeTruthy();
    expect(component.resetPasswordForm.controls['confirmPassword']).toBeTruthy();
  });

  it('should call resetPassword and navigate on success', fakeAsync(() => {
    // Simula a entrada do formulário
    component.resetPasswordForm.setValue({ password: 'newPassword', confirmPassword: 'newPassword' });

    // Mock do retorno do resetPassword
    jest.spyOn(mockAuthService, 'resetPassword').mockReturnValue(of({ message: 'Password reset successfully' }));
    jest.spyOn(mockRouter, 'navigate');

    // Chama o método onSubmit
    component.onSubmit();
    tick();  // Avança o relógio para executar código assíncrono

    expect(mockAuthService.resetPassword).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/e-driver/login']);
  }));

  it('should call showError and navigate on error', fakeAsync(() => {
    // Simula a entrada do formulário
    component.resetPasswordForm.setValue({ password: 'newPassword', confirmPassword: 'newPassword' });

    // Mock do erro de resetPassword
    const errorResponse = new HttpErrorResponse({ error: 'Error resetting password', status: 400 });
    jest.spyOn(mockAuthService, 'resetPassword').mockReturnValue(throwError(() => errorResponse));
    jest.spyOn(mockAlertasService, 'showError').mockResolvedValue();
    jest.spyOn(mockRouter, 'navigate');

    // Chama o método onSubmit
    component.onSubmit();
    tick();  // Avança o relógio para executar código assíncrono

    expect(mockAuthService.resetPassword).toHaveBeenCalled();
    expect(mockAlertasService.showError).toHaveBeenCalledWith('Redefinição de senha', 'Error resetting password');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/e-driver/login']);
  }));

  it('should redirect to login when close is called', () => {
    jest.spyOn(mockRouter, 'navigate');
    component.close();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/e-driver/login']);
  });
});
