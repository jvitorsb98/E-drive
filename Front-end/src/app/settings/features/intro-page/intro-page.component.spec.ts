import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IntroPageComponent } from './intro-page.component';
import { ModalService } from '../../core/services/modal/modal.service';
import { AuthService } from '../../core/security/services/auth/auth.service';
import { UserLoginComponent } from '../../core/security/login/user-login/user-login.component';

describe('IntroPageComponent', () => {
  let component: IntroPageComponent;
  let fixture: ComponentFixture<IntroPageComponent>;
  let modalServiceMock: jest.Mocked<ModalService>;
  let rendererMock: jest.Mocked<Renderer2>;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeAll(() => {
    // Mock do IntersectionObserver
    class MockIntersectionObserver {
      observe = jest.fn();
      disconnect = jest.fn();
      unobserve = jest.fn();
    }
    (global as any).IntersectionObserver = MockIntersectionObserver;
  });

  beforeEach(async () => {
    // Criar mocks
    modalServiceMock = { openModal: jest.fn() } as any;
    rendererMock = { setStyle: jest.fn() } as any;
    authServiceMock = { isLoggedIn: jest.fn() } as any;
    routerMock = { navigate: jest.fn() } as any;

    // Configurar TestBed
    await TestBed.configureTestingModule({
      declarations: [IntroPageComponent],
      imports: [SharedModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Para evitar erros com Web Components
      providers: [
        { provide: ModalService, useValue: modalServiceMock },
        { provide: Renderer2, useValue: rendererMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IntroPageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ngOnInit', () => {
    it('should redirect to dashboard if user is logged in', () => {
      authServiceMock.isLoggedIn.mockReturnValue(true);

      component.ngOnInit();

      expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/e-driver/dashboard']);
    });

    it('should not redirect if user is not logged in', () => {
      authServiceMock.isLoggedIn.mockReturnValue(false);

      component.ngOnInit();

      expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('openLoginModal', () => {
    it('should open the login modal and log the result if present', () => {
      const modalResult = 'test result';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      modalServiceMock.openModal.mockReturnValue(of(modalResult));

      component.openLoginModal();

      expect(modalServiceMock.openModal).toHaveBeenCalledWith(UserLoginComponent);
      expect(consoleSpy).toHaveBeenCalledWith(modalResult);
    });

    it('should not log anything if modal result is null', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      modalServiceMock.openModal.mockReturnValue(of(null));

      component.openLoginModal();

      expect(modalServiceMock.openModal).toHaveBeenCalledWith(UserLoginComponent);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

 
});
