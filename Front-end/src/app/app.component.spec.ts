import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService } from './settings/core/security/services/auth/auth.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let authServiceMock: { isLoggedIn: jest.Mock };

  beforeEach(async () => {
    // Mock do serviço AuthService com jest.fn()
    authServiceMock = { isLoggedIn: jest.fn() };
    authServiceMock.isLoggedIn.mockReturnValue(of(true));  // Mock para o usuário estar logado

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule // Usando o módulo de testes do Angular Router
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'E-drive'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('E-drive');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, E-drive');
  });

  it('should call isLoggedIn from AuthService', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.isLoggedIn();  // Chama o método
    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();  // Verifica se o método foi chamado
  });

  it('should correctly determine if on home page', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router);

    // Testando quando a URL for "/"
    await router.navigateByUrl('/');
    expect(app.isHomePage()).toBe(true);

    // Testando quando a URL for diferente de "/"
    await router.navigateByUrl('/other-page');
    expect(app.isHomePage()).toBe(false);
  });

  // Teste das animações (verifica se a animação é configurada corretamente)
  it('should trigger route animation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const outlet = app.outlet;

    // Simula a navegação e verifica se a animação é configurada
    app.prepareRoute(outlet);
    expect(outlet.activatedRouteData['animation']).toBeDefined();
  });
});
