import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDetailsModelComponent } from './modal-details-model.component';
import { Model } from '../../../../../core/models/model';

describe('ModalDetailsModelComponent', () => {
  let component: ModalDetailsModelComponent;
  let fixture: ComponentFixture<ModalDetailsModelComponent>;
  let mockDialogRef: MatDialogRef<ModalDetailsModelComponent>;

  const mockModel: Model = {
    id: 1,
    name: 'Model Name',
    brand: {
      name: 'Brand Name',
      activated: true,
      id: 0
    },
    activated: true,
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as MatDialogRef<ModalDetailsModelComponent>;

    await TestBed.configureTestingModule({
      declarations: [ModalDetailsModelComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockModel },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDetailsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Mover aqui para garantir que o template é renderizado antes de cada teste
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize model with data', () => {
    expect(component.model).toEqual(mockModel);
  });

  it('should close the modal', () => {
    component.closeModal();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should display model details', () => {
    fixture.detectChanges(); // Garante que o template é renderizado
  
    const compiled = fixture.nativeElement;
    
    // Seleciona todos os elementos com a classe 'informacao'
    const informacoes = compiled.querySelectorAll('.informacao');
  
    // Verifica se o primeiro elemento contém o nome da marca
    expect(informacoes[0].textContent).toContain('Brand Name'); // Nome da marca
  
    // Verifica se o segundo elemento contém o nome do modelo
    expect(informacoes[1].textContent).toContain('Model Name'); // Nome do modelo
  
    // Verifica se o terceiro elemento contém o ID do modelo
    expect(informacoes[2].textContent).toContain('1'); // ID do modelo
  
    // Verifica se o quarto elemento contém o status do modelo
    expect(informacoes[3].textContent).toContain('Ativo'); // Status do modelo
  });
  

  it('should display "Desativado" when model is not activated', () => {
    // Mudar o estado do mockModel para não ativado
    component.model.activated = false;
    fixture.detectChanges(); // Atualiza a detecção de mudanças

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.informacao.error').textContent).toContain('Desativado'); // Verifica se está mostrando "Desativado"
  });

  it('should display "Desativado" when brand is not activated', () => {
    // Mudar o estado do mockModel.brand para não ativado
    component.model.brand.activated = false;
    fixture.detectChanges(); // Atualiza a detecção de mudanças

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.informacao.error').textContent).toContain('Desativado'); // Verifica se está mostrando "Desativado"
  });
});
