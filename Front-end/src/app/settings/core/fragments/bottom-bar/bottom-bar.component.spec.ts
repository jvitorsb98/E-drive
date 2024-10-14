import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BottomBarComponent } from './bottom-bar.component';
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

@Component({
  template: ''
})
class DummyComponent {}

class MockRouter {
  private urlSubject = new BehaviorSubject<string>(''); // Subject para armazenar a URL
  url$ = this.urlSubject.asObservable(); // Observável para a URL

  get url() {
    return this.urlSubject.value; // Retorna a URL atual
  }

  navigate(commands: any[]) {
    this.urlSubject.next(commands.join('/')); // Atualiza a URL quando navega
    return Promise.resolve(true); // Retorna uma Promise resolvida
  }
}

describe('BottomBarComponent', () => {
  let component: BottomBarComponent;
  let fixture: ComponentFixture<BottomBarComponent>;
  let router: MockRouter; // Usar MockRouter

  beforeEach(async () => {
    router = new MockRouter(); // Instanciar o mock do Router

    await TestBed.configureTestingModule({
      declarations: [BottomBarComponent, DummyComponent],
      providers: [
        { provide: Router, useValue: router } // Substituir Router pelo mock
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BottomBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return true when the current route matches the argument in isActive()', async () => {
    await router.navigate(['e-driver/dashboard']);
    fixture.detectChanges(); // Detectar mudanças

    console.log('Current URL:', router.url);
    expect(component.isActive('e-driver/dashboard')).toBe(true);
  });

  it('should return false when the current route does not match the argument in isActive()', async () => {
    await router.navigate(['e-driver/map']);
    fixture.detectChanges(); // Detectar mudanças

    expect(component.isActive('e-driver/dashboard')).toBe(false);
  });

  it('should apply the active class to the correct link', async () => {
    await router.navigate(['e-driver/dashboard']);
    fixture.detectChanges(); // Detectar mudanças

    const dashboardLink = fixture.debugElement.query(By.css('a[routerLink="e-driver/dashboard"]'));
    expect(dashboardLink.nativeElement.classList).toContain('active');

    const mapLink = fixture.debugElement.query(By.css('a[routerLink="e-driver/map"]'));
    expect(mapLink.nativeElement.classList).not.toContain('active');
  });

  it('should render the correct number of navigation links', () => {
    const links = fixture.debugElement.queryAll(By.css('a.bottom-bar-link'));
    expect(links.length).toBe(3);
  });
});
