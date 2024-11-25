import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TravelTipsComponent } from './travel-tips.component';

// Mock para o SpeechSynthesisUtterance
class MockSpeechSynthesisUtterance {
  constructor(public text: string) {}
  lang = 'pt-BR';
  rate = 1.4;
}

// Mock para o SpeechSynthesis
class MockSpeechSynthesis {
  speak = jest.fn();
  cancel = jest.fn();
}

describe('TravelTipsComponent', () => {
  let component: TravelTipsComponent;
  let fixture: ComponentFixture<TravelTipsComponent>;
  let synthMock: MockSpeechSynthesis;

  beforeEach(async () => {
    synthMock = new MockSpeechSynthesis();

    // Mockando global SpeechSynthesisUtterance
    global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance as any;

    // Mockando a função window.speechSynthesis
    Object.defineProperty(window, 'speechSynthesis', {
      value: synthMock,
      writable: true
    });

    await TestBed.configureTestingModule({
      declarations: [TravelTipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TravelTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle reading on and off', () => {
    // Inicializa o estado
    component.isReading = false;

    // Mock da função speak
    const speakSpy = jest.spyOn(synthMock, 'speak');

    // Chama toggleRead para iniciar a leitura
    component.toggleRead();

    // Verifica se a função speak foi chamada
    expect(speakSpy).toHaveBeenCalled();

    // Verifica se isReading foi alterado para true
    expect(component.isReading).toBe(true);

    // Chama toggleRead novamente para parar a leitura
    component.toggleRead();

    // Verifica se a função cancel foi chamada
    expect(synthMock.cancel).toHaveBeenCalled();

    // Verifica se isReading foi alterado para false
    expect(component.isReading).toBe(false);
  });

  it('should initialize isLoggedIn based on localStorage', () => {
    localStorage.setItem('token', 'test-token');
    component.ngOnInit();
    expect(component.isLoggedIn).toBe(true);

    localStorage.removeItem('token');
    component.ngOnInit();
    expect(component.isLoggedIn).toBe(false);
  });
});