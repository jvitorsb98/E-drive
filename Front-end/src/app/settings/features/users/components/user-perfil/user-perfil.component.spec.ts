import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserPerfilComponent } from './user-perfil.component';
import { UserService } from '../../../../core/services/user/user.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';


describe('UserPerfilComponent', () => {
  let component: UserPerfilComponent;
  let fixture: ComponentFixture<UserPerfilComponent>;

  // Criação de mocks para os serviços
  const mockUserService = {
    getAuthenticatedUserDetails: jest.fn().mockReturnValue(of({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      birth: '1990-01-01'
    })),
    getUserEmail: jest.fn().mockReturnValue('test@example.com'),
    getUserID: jest.fn().mockReturnValue(1),
    deactivate: jest.fn(),
    logout: jest.fn(),
  };

  const mockAlertService = {
    showWarning: jest.fn().mockResolvedValue(true),
    showSuccess: jest.fn(),
    showError: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPerfilComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AlertasService, useValue: mockAlertService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on initialization', fakeAsync(() => {
    // Chama diretamente o método loadUserData
    component['loadUserData'](); 
    tick(); // Aguarda o Observable

    expect(mockUserService.getAuthenticatedUserDetails).toHaveBeenCalled();
    expect(component.userData.name).toBe('Test User');
  }));

  it('should navigate to update page when editData is called', () => {
    component.editData();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['e-driver/users/update']);
  });

  it('should call deactivate on deleteAccount confirmation', fakeAsync(() => {
    mockUserService.deactivate.mockReturnValue(of({}));

    component.deleteAccount();
    tick(); // Aguarda o Observable

    expect(mockAlertService.showWarning).toHaveBeenCalled();
    expect(mockUserService.deactivate).toHaveBeenCalledWith(1); 
    expect(mockAlertService.showSuccess).toHaveBeenCalledWith('Conta desativada com sucesso', 'Agora você pode criar novas contas.');
  }));



  it('should handle error when loading user data fails', fakeAsync(() => {
    // Configura o mock para lançar um erro
    mockUserService.getAuthenticatedUserDetails.mockReturnValue(throwError(() => new Error('Erro ao carregar dados')));
  
    // Mock do console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    // Chama o método loadUserData
    component['loadUserData']();
    tick(); // Aguarda o Observable
  
    expect(mockAlertService.showError).not.toHaveBeenCalled(); 
    expect(consoleSpy).toHaveBeenCalledWith('Erro ao carregar dados do usuário', expect.any(Error)); 
    consoleSpy.mockRestore();
  }));
  
  
  it('should show error message when deletseAccount fails', fakeAsync(() => {
    mockUserService.deactivate.mockReturnValue(throwError(() => new Error('Erro ao desativar a conta')));
  
    component.deleteAccount(); // Chama o método de desativação
    tick(); // Aguarda o Observable
  
    expect(mockAlertService.showError).toHaveBeenCalledWith('Erro ao desativar a conta', 'Erro ao desativar a conta');
  }));
  
  it('should log out user and navigate on logout', () => {
    component.onLogout(); // Chama o método de logout
    expect(mockUserService.logout).toHaveBeenCalled(); 
  });
  

  
  
});
