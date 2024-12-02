import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanningTripComponent } from './planning-trip.component'; // ajuste o caminho conforme necessário
import { MatIconModule } from '@angular/material/icon'; // Importa o MatIconModule para testes
import { CommonModule } from '@angular/common'; // Caso precise de módulos comuns
import { NO_ERRORS_SCHEMA } from '@angular/core'; // Para ignorar erros de elementos desconhecidos
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';

describe('PlanningTripComponent', () => {
  let component: PlanningTripComponent;
  let fixture: ComponentFixture<PlanningTripComponent>;

  beforeEach(async () => {
    // Mock do google.maps
    window['google'] = {
      maps: {
        Map: jest.fn(), // Mock do Map
        MapTypeId: {
          ROADMAP: 'roadmap',
          SATELLITE: 'satellite',
          HYBRID: 'hybrid',
          TERRAIN: 'terrain',
        },
        DirectionsService: jest.fn().mockImplementation(() => {
          return { route: jest.fn() }; // Mock da função 'route'
        }),
        DirectionsRenderer: jest.fn().mockImplementation(() => {
          return {
            setMap: jest.fn(), // Mock do método 'setMap'
            setDirections: jest.fn(), // Mock do método 'setDirections' se necessário
          };
        }),
        Autocomplete: jest.fn().mockImplementation(() => {
          return { addListener: jest.fn() }; // Mock do método 'addListener'
        }),
        // Adicione mais mocks conforme necessário
      }
    };

    await TestBed.configureTestingModule({
      declarations: [PlanningTripComponent], // Declarar o componente a ser testado
      imports: [
        CommonModule,
        MatIconModule, // Importa o MatIconModule para garantir que 'mat-icon' será reconhecido
        AngularMaterialModule, // Adiciona outros módulos Angular Material se necessário
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignora erros de elementos desconhecidos durante os testes
    }).compileComponents(); // Compila o módulo de teste
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningTripComponent); // Cria uma instância do componente
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detecta mudanças para garantir que o componente foi inicializado corretamente
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado com sucesso
  });
});
