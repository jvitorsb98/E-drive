import { UiButtonComponent } from './ui-button.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';

describe('UiButtonComponent', () => {
  let component: UiButtonComponent;
  let fixture: ComponentFixture<UiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiButtonComponent], // Não precisa de MockComponent aqui
    }).compileComponents();

    fixture = TestBed.createComponent(UiButtonComponent);
    component = fixture.componentInstance;
  });
  it('should render a link when routerLink is provided', () => {
    component.routerLink = '/home'; // Define routerLink para renderizar o link
    component.text = 'Go to Home';
    fixture.detectChanges();
  
    const linkElement = fixture.debugElement.query(By.css('a'));
    expect(linkElement).toBeTruthy(); // Verifica se o link é renderizado
    expect(linkElement.properties['routerLink']).toBe('/home'); // Verifica se o routerLink foi definido corretamente
  });
  
  it('should render a link when routerLink is provided', () => {
    component.routerLink = '/home'; // Define routerLink para renderizar o link
    component.text = 'Go to Home';
    fixture.detectChanges();
  
    const linkElement = fixture.debugElement.query(By.css('a'));
    expect(linkElement).toBeTruthy(); // Verifica se o link é renderizado
    expect(linkElement.properties['routerLink']).toBe('/home'); // Verifica se o routerLink foi definido corretamente
  });
  
  

  it('should emit clickEvent when clicked and not disabled', () => {
    jest.spyOn(component.clickEvent, 'emit');
    component.disabled = false; // Garante que o botão não está desabilitado
    component.routerLink = ''; // Garante que é um botão e não um link
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.nativeElement.click(); // Simula clique

    expect(component.clickEvent.emit).toHaveBeenCalled(); // Verifica se o evento foi emitido
  });

  it('should not emit clickEvent when disabled', () => {
    jest.spyOn(component.clickEvent, 'emit');
    component.disabled = true; // Botão desabilitado
    component.routerLink = ''; // Garante que é um botão
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.nativeElement.click(); // Simula clique

    expect(component.clickEvent.emit).not.toHaveBeenCalled(); // Verifica se o evento NÃO foi emitido
  });

  it('should apply the correct classes based on inputs', () => {
    component.pulseAnimation = true;
    component.disabled = true;
    component.icon = 'icon-class';
    component.routerLink = ''; // Garante que é um botão
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    
    expect(buttonElement.nativeElement.classList.contains('pulse-animation')).toBe(true); // Verifica se a classe pulse-animation está aplicada
    expect(buttonElement.nativeElement.classList.contains('disabled')).toBe(true); // Verifica se a classe disabled está aplicada
  });
});
