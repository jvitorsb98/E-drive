import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarIntroComponent } from './navbar-intro.component';
import { Router } from '@angular/router';
import { AuthService } from '../../security/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';

class MockAuthService {
  isLoggedIn = jest.fn().mockReturnValue(true); // Mock do método isLoggedIn
}

class MockRouter {
  navigate = jest.fn(); // Mock da função navigate do Router
}

describe('NavbarIntroComponent', () => {
  let component: NavbarIntroComponent;
  let fixture: ComponentFixture<NavbarIntroComponent>;
  let router: MockRouter;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarIntroComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService }, // Usando o mock do AuthService
        { provide: Router, useClass: MockRouter }, // Usando o mock do Router
        MatDialog // Mock do MatDialog (pode ser necessário, dependendo da implementação)
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarIntroComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as unknown as MockRouter;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    fixture.detectChanges(); // Detecta mudanças para que o componente seja renderizado
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });

  it('should toggle the menu', () => {
    expect(component.isMenuOpen).toBe(false); // Verifica que o menu começa fechado
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(true); // Verifica que o menu foi aberto
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(false); // Verifica que o menu foi fechado novamente
  });

  it('should navigate to login on openLoginModal call', () => {
    component.openLoginModal();
    expect(router.navigate).toHaveBeenCalledWith(['/e-driver/login']); // Verifica se a navegação ocorreu corretamente
  });

  it('should navigate to registration on openRegisterModal call', () => {
    component.openRegisterModal();
    expect(router.navigate).toHaveBeenCalledWith(['/e-driver/users/registration']); // Verifica se a navegação ocorreu corretamente
  });

  it('should close the menu on closeMenu call', () => {
    component.isMenuOpen = true; // Simula que o menu está aberto
    component.closeMenu();
    expect(component.isMenuOpen).toBe(false); // Verifica que o menu foi fechado
  });

  it('should return true for isLoggedIn from AuthService', () => {
    expect(component.isLoggedIn()).toBe(true); // Verifica se o método isLoggedIn retorna o valor correto do serviço de autenticação
  });
});
