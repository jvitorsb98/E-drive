import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FaqPopupComponent } from './faq-popup.component';
import { By } from '@angular/platform-browser';

class MatDialogRefMock {
  close = jest.fn(() => console.log('close chamado')); // Para debug
}


const mockFaqs = [
  { question: 'Pergunta 1', answer: 'Resposta 1' },
  { question: 'Pergunta 2', answer: 'Resposta 2' },
];

describe('FaqPopupComponent', () => {
  let component: FaqPopupComponent;
  let fixture: ComponentFixture<FaqPopupComponent>;
  let dialogRef: MatDialogRefMock; // Alterado para MatDialogRefMock

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaqPopupComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogRefMock }, // Mock da referência do diálogo
        { provide: MAT_DIALOG_DATA, useValue: { faqs: mockFaqs } }, // Mock dos dados do diálogo
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqPopupComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as unknown as MatDialogRefMock; // Obtenha a instância do diálogo e faça o cast para o mock
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize faqs from data', () => {
    expect(component.faqs).toEqual(mockFaqs); // Verifica se as FAQs foram inicializadas corretamente
  });

  it('should display the correct number of FAQs', () => {
    const faqElements = fixture.nativeElement.querySelectorAll('h3');
    expect(faqElements.length).toBe(mockFaqs.length); // Verifica se o número de perguntas exibidas é o mesmo que o do mock
  });

  it('should display the correct question and answer', () => {
    const firstQuestion = fixture.nativeElement.querySelector('h3').textContent;
    const firstAnswer = fixture.nativeElement.querySelector('p').textContent;
    expect(firstQuestion).toBe(mockFaqs[0].question); // Verifica se a primeira pergunta está correta
    expect(firstAnswer).toBe(mockFaqs[0].answer); // Verifica se a primeira resposta está correta
  });

  it('should close the dialog when the close button is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css('mat-icon[mat-dialog-close]'));
    closeButton.nativeElement.click(); // Simula o clique no botão de fechar
  
    expect(dialogRef.close).toHaveBeenCalled(); // Verifica se o método close foi chamado
  });
  
  
  
  
});
