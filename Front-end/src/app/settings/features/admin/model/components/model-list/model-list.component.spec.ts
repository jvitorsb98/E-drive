import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelListComponent } from './model-list.component';
import { ModelService } from '../../../../../core/services/model/model.service';
import { AlertasService } from '../../../../../core/services/Alertas/alertas.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Model } from '../../../../../core/models/model';
import { PaginatedResponse } from '../../../../../core/models/paginatedResponse';

describe('ModelListComponent', () => {
  let component: ModelListComponent;
  let fixture: ComponentFixture<ModelListComponent>;
  let modelService: jest.Mocked<ModelService>;
  let alertService: jest.Mocked<AlertasService>;
  let dialog: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    modelService = {
      getAllPaginated: jest.fn(),
      delete: jest.fn(),
      activated: jest.fn(),
    } as any;

    alertService = {
      showWarning: jest.fn().mockResolvedValue(true),
      showSuccess: jest.fn(),
      showError: jest.fn(),
    } as any;

    dialog = {
      open: jest.fn().mockReturnValue({ afterClosed: jest.fn().mockReturnValue(of(null)) }),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ModelListComponent],
      providers: [
        { provide: ModelService, useValue: modelService },
        { provide: AlertasService, useValue: alertService },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelListComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('deve carregar os modelos ao iniciar', () => {
      const mockResponse: PaginatedResponse<Model> = {
        content: [{ id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true }],
        totalElements: 1,
      } as PaginatedResponse<Model>;
      modelService.getAllPaginated.mockReturnValue(of(mockResponse));

      component.ngOnInit();

      expect(modelService.getAllPaginated).toHaveBeenCalledWith(0, 10);
      expect(component.models).toEqual(mockResponse.content);
      expect(component.totalModels).toBe(mockResponse.totalElements);
    });
  });

  describe('loadModels', () => {
    it('deve carregar os modelos com sucesso', () => {
      const mockResponse: PaginatedResponse<Model> = {
        content: [{ id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true }],
        totalElements: 1,
      } as PaginatedResponse<Model>;
      modelService.getAllPaginated.mockReturnValue(of(mockResponse));

      component.loadModels(0, 10);

      expect(modelService.getAllPaginated).toHaveBeenCalledWith(0, 10);
      expect(component.models).toEqual(mockResponse.content);
      expect(component.totalModels).toBe(mockResponse.totalElements);
    });

    it('deve tratar erro ao carregar modelos', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      modelService.getAllPaginated.mockReturnValue(throwError(() => new Error('Erro ao carregar modelos')));

      component.loadModels(0, 10);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error on getListModels:', 
        expect.objectContaining({ message: 'Erro ao carregar modelos' })
      );
      consoleSpy.mockRestore();
    });
  });

  describe('disableModel', () => {
    it('deve desativar um modelo', async () => {
      const mockModel: Model = { id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true };

      modelService.delete.mockReturnValue(of(undefined));  // Retorna void para delete
      await component.disableModel(mockModel);

      expect(alertService.showWarning).toHaveBeenCalledWith(
        'Desativar Modelo',
        'Você tem certeza que deseja desativar o modelo "Model 1"?',
        'Sim, desativar!',
        'Cancelar'
      );
      expect(modelService.delete).toHaveBeenCalledWith(mockModel.id);
      expect(alertService.showSuccess).toHaveBeenCalledWith('Sucesso!', 'O modelo foi desativado com sucesso!');
    });

    it('deve lidar com erro ao desativar um modelo', async () => {
      const mockModel: Model = { id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true };
      modelService.delete.mockReturnValue(throwError(() => new Error('Erro ao desativar')));

      await component.disableModel(mockModel);

      expect(alertService.showError).toHaveBeenCalledWith('Erro!', 'Ocorreu um erro ao desativar o modelo. Tente novamente mais tarde.');
    });
  });

  describe('activatedModel', () => {
    it('deve ativar um modelo', async () => {
      const mockModel: Model = { id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: false }, activated: false };

      modelService.activated.mockReturnValue(of(undefined));  // Retorna void para activated
      await component.activatedModel(mockModel);

      expect(alertService.showWarning).toHaveBeenCalledWith(
        'Ativar Modelo',
        'Você tem certeza que deseja ativar o modelo "Model 1"?',
        'Sim, ativar!',
        'Cancelar'
      );
      expect(modelService.activated).toHaveBeenCalledWith(mockModel.id);
      expect(alertService.showSuccess).toHaveBeenCalledWith('Sucesso!', 'O modelo foi ativado com sucesso!');
    });
  });

  it('deve aplicar filtro corretamente', () => {
    const mockModels = [
        { id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true },
        { id: 2, name: 'Model 2', brand: { id: 2, name: 'Brand 2', activated: true }, activated: true },
    ];

    const mockResponse: PaginatedResponse<Model> = {
        content: mockModels,
        totalElements: mockModels.length,
    } as PaginatedResponse<Model>;

    // Mocka a resposta do serviço para a chamada getAllPaginated
    modelService.getAllPaginated.mockReturnValue(of(mockResponse));

    // Inicializa o componente
    component.ngOnInit(); // Carrega os modelos inicialmente

    // Simula o evento de filtro
    const event = { target: { value: 'Model 1' } };
    component.applyFilter(event as any);

    // Verifica se `dataSource.data` foi atualizado corretamente
    expect(component.dataSource.data).toEqual([
        { id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true },
    ]);

    // Verifica se `filteredData` contém apenas o item filtrado
    expect(component.filteredData).toEqual([
        { id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true }, activated: true },
    ]);
});

});
