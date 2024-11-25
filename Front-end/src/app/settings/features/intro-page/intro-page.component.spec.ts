import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntroPageComponent } from './intro-page.component';
import { ModalService } from '../../core/services/modal/modal.service';
import { UserLoginComponent } from '../../core/security/login/user-login/user-login.component';
import { Renderer2 } from '@angular/core';
import { of } from 'rxjs';

// Mock do ModalService
class ModalServiceMock {
  openModal = jest.fn().mockReturnValue(of({ success: true }));
}

// Mock do Renderer2
class Renderer2Mock {
  setStyle = jest.fn();
}

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('IntroPageComponent', () => {
  let component: IntroPageComponent;
  let fixture: ComponentFixture<IntroPageComponent>;
  let modalService: ModalService;
  let renderer: Renderer2Mock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntroPageComponent],
      providers: [
        { provide: ModalService, useClass: ModalServiceMock },
        { provide: Renderer2, useClass: Renderer2Mock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IntroPageComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);
    renderer = TestBed.inject(Renderer2) as unknown as Renderer2Mock; // Garantir que o mock do Renderer2 é injetado corretamente
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open login modal and handle result', () => {
    const openModalSpy = jest.spyOn(modalService, 'openModal');
    const consoleSpy = jest.spyOn(console, 'log');

    component.openLoginModal();

    expect(openModalSpy).toHaveBeenCalledWith(UserLoginComponent);
    expect(consoleSpy).toHaveBeenCalledWith({ success: true });
  });

  it('should initialize the IntersectionObserver correctly', () => {
    const mockObserver = jest.fn();
    global.IntersectionObserver = jest.fn().mockImplementation(mockObserver);

    // Iniciar o método e verificar a execução do IntersectionObserver
    fixture.detectChanges(); // Garante que o componente é renderizado
    component.ngAfterViewInit(); // Chama o ngAfterViewInit explicitamente

    // Verificar se o IntersectionObserver foi chamado
    expect(mockObserver).toHaveBeenCalled();
  });
  it('should set background styles for parallax on iOS', () => {
    // Cria o elemento para parallax
    const parallaxElement = document.createElement('div');
  
    // Usar diretamente spyOn no método do renderer
    const setStyleSpy = jest.spyOn(renderer, 'setStyle');
  
    // Simula a execução do método ngAfterViewInit
    component.ngAfterViewInit();
  
    // Verifica se o setStyle foi chamado corretamente
    expect(setStyleSpy).toHaveBeenCalledWith(parallaxElement, 'backgroundAttachment', 'fixed');
  });
  
  
});