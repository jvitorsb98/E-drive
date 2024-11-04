import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPasswordModalComponent } from './user-password-modal.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../../../../core/services/user/user.service';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPasswordModalComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AlertasService, useValue: mockAlertService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Router, useValue: mockRouter },
        { provide: MAT_DIALOG_DATA, useValue: { name: 'Test User' } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    mockUserService.register = jest.fn().mockReturnValue(of({}));
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

  it('should call createUser if form is valid', () => {
    component.userPassword.setValue({
      password: 'validPassword',
      confirmPassword: 'validPassword',
      newsletter: true
    });
    const spy = jest.spyOn(component, 'createUser');
    component.saveUser();
    expect(spy).toHaveBeenCalled();
  });

  it('should display success message on successful registration', async () => {
    mockUserService.register.mockReturnValue(of({}));

    component.userPassword.setValue({
      password: 'validPassword',
      confirmPassword: 'validPassword',
      newsletter: true
    });

    await component.createUser();

    expect(mockAlertService.showSuccess).toHaveBeenCalledWith(
      'Cadastro bem-sucedido!', 
      'Test User cadastrado(a) com sucesso. Um email de ativação foi enviado.'
    );
  });

  it('should display error message on registration failure', async () => {
    mockUserService.register.mockReturnValue(throwError(() => ({ error: 'Erro ao cadastrar usuário' })));

    component.userPassword.setValue({
      password: 'validPassword',
      confirmPassword: 'validPassword',
      newsletter: true
    });

    await component.createUser();

    expect(mockAlertService.showError).toHaveBeenCalledWith('Erro ao cadastrar usuário');
  });

  it('should close the modal when closeModal is called', () => {
    component.closeModal();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
