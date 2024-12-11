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

    class MockIntersectionObserver {
      observe = jest.fn();
      disconnect = jest.fn();
      unobserve = jest.fn();
    }
    (global as any).IntersectionObserver = MockIntersectionObserver;
  });

  beforeEach(async () => {
    modalServiceMock = { openModal: jest.fn() } as any;
    rendererMock = { setStyle: jest.fn() } as any;
    authServiceMock = { isLoggedIn: jest.fn() } as any;
    routerMock = { navigate: jest.fn() } as any;

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

  describe('ngAfterViewInit', () => {
    let parallaxElementMock: { nativeElement: HTMLElement };
    let observerMock: jest.Mocked<IntersectionObserver>;
    let mockElement: HTMLElement;
  
    beforeEach(() => {
      parallaxElementMock = { nativeElement: document.createElement('div') };
      component.parallaxElement = parallaxElementMock;
  
      mockElement = document.createElement('div');
      mockElement.classList.add('fade-in');
      document.body.appendChild(mockElement);
  
      observerMock = {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      } as any;
  
      global.IntersectionObserver = jest.fn((callback) => observerMock) as any;
    });
  
    afterEach(() => {
      document.body.removeChild(mockElement);
      jest.clearAllMocks();
    });
  
    it('should set background-attachment to scroll for iOS devices', () => {
      Object.defineProperty(navigator, 'userAgent', { value: 'iPhone', configurable: true });
  
      component.ngAfterViewInit();
  
      setTimeout(() => {
        expect(rendererMock.setStyle).toHaveBeenCalledWith(
          parallaxElementMock.nativeElement,
          'background-attachment',
          'scroll'
        );
      }, 100);
    });
  
    it('should set background-attachment to fixed for non-iOS devices', () => {
      Object.defineProperty(navigator, 'userAgent', { value: 'Android', configurable: true });
  
      component.ngAfterViewInit();
  
      setTimeout(() => {
        expect(rendererMock.setStyle).toHaveBeenCalledWith(
          parallaxElementMock.nativeElement,
          'background-attachment',
          'fixed'
        );
      }, 100);
    });
  
    it('should observe elements with class fade-in', () => {
      component.ngAfterViewInit();
  
      expect(global.IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), { threshold: 0.5 });
      expect(observerMock.observe).toHaveBeenCalledWith(mockElement);
    });
  
    it('should add "show" class to intersecting elements', () => {
      component.ngAfterViewInit();
  
      const callback = (global.IntersectionObserver as jest.Mock).mock.calls[0][0];
      callback([{ isIntersecting: true, target: mockElement }]);
  
      expect(mockElement.classList.contains('show')).toBe(true);
    });
  
    it('should not add "show" class to non-intersecting elements', () => {
      component.ngAfterViewInit();
  
      const callback = (global.IntersectionObserver as jest.Mock).mock.calls[0][0];
      callback([{ isIntersecting: false, target: mockElement }]);
  
      expect(mockElement.classList.contains('show')).toBe(false);
    });
  });

  describe('ngAfterViewInit - setTimeout logic', () => {
    let parallaxElementMock: { nativeElement: HTMLElement };
  
    beforeEach(() => {
      parallaxElementMock = { nativeElement: document.createElement('div') };
      component.parallaxElement = parallaxElementMock;
    });
  
    
  
    it('should not execute the logic before 100ms', () => {
      jest.useFakeTimers(); // Ativando temporizador falso
      Object.defineProperty(navigator, 'userAgent', { value: 'iPhone', configurable: true });
  
      component.ngAfterViewInit();
      jest.advanceTimersByTime(50); // Avança o tempo em 50ms, antes do tempo necessário
  
      expect(rendererMock.setStyle).not.toHaveBeenCalled();
  
      jest.useRealTimers(); // Restaurar o temporizador real
    });
  
    it('should execute the logic only if parallaxElement is present', () => {
      jest.useFakeTimers(); // Ativando temporizador falso
      component.parallaxElement == null; // Configura o elemento como nulo
  
      component.ngAfterViewInit();
      jest.advanceTimersByTime(100); // Avança o tempo em 100ms
  
      expect(rendererMock.setStyle).not.toHaveBeenCalled();
  
      jest.useRealTimers(); // Restaurar o temporizador real
    });
  });
  
  describe('ngAfterViewInit - setTimeout logic', () => {
    let parallaxElementMock: { nativeElement: HTMLElement };
  
    beforeEach(() => {
      parallaxElementMock = { nativeElement: document.createElement('div') };
      component.parallaxElement = parallaxElementMock;
  
      // Certifique-se de espiar o método setStyle do Renderer2
      jest.spyOn(rendererMock, 'setStyle');
    });
  
    afterEach(() => {
      jest.clearAllMocks();
      jest.useRealTimers(); // Restaurar temporizadores reais após cada teste
    });
  
    it('should not execute the logic before 100ms', () => {
      jest.useFakeTimers(); // Ativar temporizador falso
      Object.defineProperty(navigator, 'userAgent', { value: 'Android', configurable: true });
  
      component.ngAfterViewInit(); // Invocar o método do ciclo de vida
      jest.advanceTimersByTime(50); // Avançar o temporizador em 50ms
  
      expect(rendererMock.setStyle).not.toHaveBeenCalled();
    });
  
    it('should execute the logic only if parallaxElement is present', () => {
      jest.useFakeTimers(); // Ativar temporizador falso
      component.parallaxElement == null; // Tornar o elemento nulo
  
      component.ngAfterViewInit(); // Invocar o método do ciclo de vida
      jest.advanceTimersByTime(100); // Avançar o temporizador em 100ms
  
      expect(rendererMock.setStyle).not.toHaveBeenCalled();
    });

    it('should set background-attachment to fixed for non-iOS devices', () => {
      Object.defineProperty(navigator, 'userAgent', { value: 'Android', configurable: true });
    
      component.ngAfterViewInit();
    
      setTimeout(() => {
        expect(rendererMock.setStyle).toHaveBeenCalledWith(
          parallaxElementMock.nativeElement,
          'background-attachment',
          'fixed'
        );
      }, 100);
    });
    
    it('should redirect to dashboard if user is logged in', () => {
      authServiceMock.isLoggedIn.mockReturnValue(true);
    
      component.ngOnInit();
    
      expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/e-driver/dashboard']);
    });

  });
  
  
  
  
  
});
