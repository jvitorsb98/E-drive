import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [MatCardModule], // Importando MatCardModule
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detecta mudanças para que o componente seja renderizado
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });

  it('should display the current year', () => {
    const yearElement = fixture.debugElement.query(By.css('p')); // Seleciona o elemento que contém o ano
    expect(yearElement.nativeElement.textContent).toContain(component.currentYear.toString()); // Verifica se o ano atual está sendo exibido
  });

  it('should display social media links', () => {
    const socialLinks = fixture.debugElement.queryAll(By.css('.social-icons a')); // Seleciona todos os links de redes sociais
    expect(socialLinks.length).toBe(3); // Verifica se existem 3 links
  });

  it('should have correct hrefs for social media links', () => {
    const facebookLink = fixture.debugElement.query(By.css('a[href*="facebook"]'));
    const instagramLink = fixture.debugElement.query(By.css('a[href*="instagram"]'));
    const linkedinLink = fixture.debugElement.query(By.css('a[href*="linkedin"]'));

    expect(facebookLink.nativeElement.getAttribute('href')).toBe('https://www.facebook.com/engenio.ingenio/');
    expect(instagramLink.nativeElement.getAttribute('href')).toBe('https://www.instagram.com/engenio.ingenio/');
    expect(linkedinLink.nativeElement.getAttribute('href')).toBe('https://www.linkedin.com/company/ingenico/');
  });
});
