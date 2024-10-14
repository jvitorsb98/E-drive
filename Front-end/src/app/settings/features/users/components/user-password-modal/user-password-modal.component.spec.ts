import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPasswordModalComponent } from './user-password-modal.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UserService } from '../../../../core/services/user/user.service';
import { AuthService } from '../../../../core/security/services/auth/auth.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

describe('UserPasswordModalComponent', () => {
  let component: UserPasswordModalComponent;
  let fixture: ComponentFixture<UserPasswordModalComponent>;
  let mockUserService = {
    register: jest.fn()
  };
  let mockAuthService = {
    resetPassword: jest.fn(),
    getTokenReset: jest.fn()
  };
  let mockAlertService = {
    showSuccess: jest.fn().mockReturnValue(Promise.resolve(true)),
    showError: jest.fn()
  };
  let mockDialogRef = {
    close: jest.fn()
  };
  let mockRouter = {
    navigate: jest.fn(),
    events: of(new NavigationEnd(0, '/intro-page', '/intro-page'))
  };
  let mockActivatedRoute = {
    queryParams: of({
      title: 'Nova Senha',
      subtitle: 'Subtitulo Teste',
      btnText: 'Confirmar',
      isPasswordChange: 'true'
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPasswordModalComponent],
      imports: [ReactiveFormsModule, FormsModule, BrowserAnimationsModule, MatInputModule,
        MatButtonModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: AlertasService, useValue: mockAlertService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MAT_DIALOG_DATA, useValue: { name: 'Test User' } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct fields', () => {
    expect(component.userPassword.contains('password')).toBeTruthy();
    expect(component.userPassword.contains('confirmPassword')).toBeTruthy();
    expect(component.userPassword.contains('newsletter')).toBeTruthy();
  });

  it('should call createUser if form is valid and isPasswordChange is false', () => {
    component.isPasswordChange = false;
    const spy = jest.spyOn(component, 'createUser');
    component.saveUser();
    expect(spy).toHaveBeenCalled();
  });

  it('should call changePassword if form is valid and isPasswordChange is true', () => {
    component.isPasswordChange = true;
    const spy = jest.spyOn(component, 'changePassword');
    component.saveUser();
    expect(spy).toHaveBeenCalled();
  });

  it('should display success message on successful registration', async () => {
    // Simula o serviço de registro retornando sucesso
    mockUserService.register.mockReturnValue(of({}));

    // Preenche o formulário
    component.userPassword.setValue({
      password: 'validPassword',
      confirmPassword: 'validPassword',
      newsletter: true
    });

    // Chama o método createUser
    await component.createUser();

    // Verifica se o showSuccess foi chamado com os parâmetros corretos
    expect(mockAlertService.showSuccess).toHaveBeenCalledWith(
      'Cadastro bem-sucedido!', 
      'Test User cadastrado(a) com sucesso. Um email de ativação foi enviado.'
    );
  });

  it('should display error message on registration failure', async () => {
    mockUserService.register.mockReturnValue(throwError(() => new Error('Error')));
    
    // Preenche o formulário
    component.userPassword.setValue({
      password: 'validPassword',
      confirmPassword: 'validPassword',
      newsletter: true
    });

    await component.createUser();

    expect(mockAlertService.showError).toHaveBeenCalledWith(
      'Erro!', 
      'Houve um problema ao cadastrar Test User. Tente novamente mais tarde.'
    );
  });

  
});
