import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelListComponent } from './model-list.component';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModelService } from '../../../../../core/services/model/model.service';
import {  NoopAnimationsModule } from '@angular/platform-browser/animations';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ModalFormModelComponent } from '../modal-form-model/modal-form-model.component';
import { Model } from '../../../../../core/models/model';
describe('ModelListComponent', () => {
  let component: ModelListComponent;
  let fixture: ComponentFixture<ModelListComponent>;
  let mockModelService: any;
  let dialog: MatDialog;


  const mockMatDialog = {
    open: jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(true)), // Simula o retorno do afterClosed
    }),
  };


  beforeEach(async () => {
    mockModelService = {
      getAll: jest.fn(() => of({ content: [] })), // Simula a resposta do serviço
      delete: jest.fn(() => of(null)) // Simula a exclusão de um modelo
    };

    await TestBed.configureTestingModule({
      declarations: [ModelListComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        ReactiveFormsModule,
        HttpClientModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ModelService, useValue: mockModelService },
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load models on init', () => {
    // Mock da resposta do serviço
    const models = [{ id: 1, name: 'Model 1', brand: { name: 'Brand 1' }, activated: true }];
    mockModelService.getAll.mockReturnValue(of({ content: models }));

    component.ngOnInit(); // Chama ngOnInit para carregar os modelos

    expect(mockModelService.getAll).toHaveBeenCalled(); // Verifica se o serviço foi chamado
    expect(component.modelList.length).toBe(1); // Verifica se um modelo foi carregado
    expect(component.dataSource.data.length).toBe(1); // Verifica se a fonte de dados foi atualizada
  });
  it('should delete a model', async () => {
    const models = [
      {
        id: 1,
        name: 'Model 1',
        brand: {
          id: 1,
          name: 'Brand 1',
          activated: true
        },
        activated: true
      }
    ];
  
    // Mockando a resposta do serviço para retornar o modelo inicialmente
    mockModelService.getAll.mockReturnValue(of({ content: models }));
    component.ngOnInit(); // Carrega os modelos
  
    // Mock de Swal.fire
    const SwalSpy = jest.spyOn(Swal, 'fire').mockImplementation(() => 
      Promise.resolve({ 
        isConfirmed: true, 
        isDenied: false, 
        isDismissed: false 
      } as SweetAlertResult<unknown>)
    );
  
    // Simulando a resposta do serviço para o caso de deleção (retornando uma lista vazia)
    mockModelService.getAll.mockReturnValue(of({ content: [] }));
  
    await component.deleteModel(models[0]); // Chama o método de exclusão
  
    expect(mockModelService.delete).toHaveBeenCalledWith(1); // Verifica se o método de delete foi chamado com o ID correto
    await component.loadModels(); // Chama loadModels para atualizar modelList
    expect(component.modelList.length).toBe(0); // Verifica se o modelo foi removido
  });
  
  it('should not load any models when service returns empty', () => {
    mockModelService.getAll.mockReturnValue(of({ content: [] }));
    component.ngOnInit();

    expect(mockModelService.getAll).toHaveBeenCalled();
    expect(component.modelList.length).toBe(0); // Verifica se nenhum modelo foi carregado
    expect(component.dataSource.data.length).toBe(0); // Verifica se a fonte de dados está vazia
  });


  it('should sort models when clicking on a column header', () => {
    const models = [
      { id: 1, name: 'Model A', brand: { name: 'Brand A' }, activated: true },
      { id: 2, name: 'Model B', brand: { name: 'Brand B' }, activated: true }
    ];
  
    // Mock do serviço para retornar a lista de modelos
    mockModelService.getAll.mockReturnValue(of({ content: models }));
    component.ngOnInit(); // Inicializa e carrega os modelos
  
    // Mock do MatSort e sua aplicação
    component.dataSource.sort = new MatSort();
    component.dataSource.sort.active = 'name'; // Ordenar pela coluna 'name'
    component.dataSource.sort.direction = 'desc'; // Ordenação descendente
  
    // Simula o comportamento do MatSort e a reordenação dos dados
    component.dataSource.sortData(component.dataSource.data, component.dataSource.sort);
  
    // Força a detecção de mudanças após a ordenação
    fixture.detectChanges(); 
  
    // Verifica se a ordenação descendente foi aplicada corretamente
    expect(component.dataSource.data[0].name).toBe('Model B'); // O primeiro deve ser 'Model B'
    expect(component.dataSource.data[1].name).toBe('Model A'); // O segundo deve ser 'Model A'
  });

  it('should open the add model modal when openModalAddModel is called', () => {
    const dialogSpy = jest.spyOn((component as any).dialog, 'open').mockReturnValue({
      afterClosed: () => of(true)
    } as any);

    component.openModalAddModel(); // Chama o método para abrir o modal de adicionar

    expect(dialogSpy).toHaveBeenCalledWith(ModalFormModelComponent, {
      width: '500px',
      height: '320px',
    });
  });

  it('should open the edit model modal when openModalEditModel is called', () => {
    const model: Model = { 
      id: 1, 
      name: 'Model 1', 
      brand: { id: 1, name: 'Brand 1', activated: true }, 
      activated: true 
    };

    const dialogSpy = jest.spyOn((component as any).dialog, 'open').mockReturnValue({
      afterClosed: () => of(true)
    } as any);

    component.openModalEditModel(model); // Chama o método para abrir o modal de editar

    expect(dialogSpy).toHaveBeenCalledWith(ModalFormModelComponent, {
      width: '500px',
      height: '320px',
      data: model
    });
  });

  it('should load models correctly when service returns activated models', () => {
    const models = [
      { id: 1, name: 'Model 1', brand: { name: 'Brand 1' }, activated: true },
      { id: 2, name: 'Model 2', brand: { name: 'Brand 2' }, activated: true }
    ];
  
    mockModelService.getAll.mockReturnValue(of({ content: models }));
    component.ngOnInit(); // Carrega os modelos

    expect(component.modelList.length).toBe(2); // Verifica se dois modelos foram carregados
    expect(component.modelList.every(model => model.activated)).toBe(true); // Verifica se todos os modelos estão ativados
  });
  
  it('should update dataSource after adding a model', async () => {
    const model = { id: 1, name: 'Model 1', brand: { name: 'Brand 1' }, activated: true };
  
    // Mock do diálogo para retornar o modelo
    jest.spyOn(mockMatDialog, 'open').mockReturnValue({
      afterClosed: () => of(model) // Simula o retorno de um modelo após fechar o modal
    });
  
    await component.openModalAddModel(); // Chama o método para abrir o modal de adicionar
  
    // Aqui você deve garantir que os modelos estão sendo recarregados
    mockModelService.getAll.mockReturnValue(of({ content: [model] })); // Mock da resposta do serviço
    await component.loadModels(); // Chama o método que carrega os modelos
  
    expect(mockModelService.getAll).toHaveBeenCalled(); // Verifica se o serviço foi chamado para recarregar os modelos
    expect(component.dataSource.data.length).toBeGreaterThan(0); // Verifica se a fonte de dados foi atualizada
  });
  


/*  it('should handle pagination correctly', () => {
    const models = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Model ${i + 1}`,
        brand: { id: 1, name: 'Brand 1', activated: true },
        activated: true
    }));

    mockModelService.getAll.mockReturnValue(of({ content: models }));
    component.loadModels(); // Carrega os modelos

    // Verifica se a fonte de dados contém 10 itens na primeira página
    expect(component.dataSource.data.length).toBe(10); // A primeira página deve ter 10 itens

    // Mudando para a segunda página
    component.paginator.pageIndex = 1; // Segunda página
    component.paginator.page.emit(); // Emite evento de mudança de página

    // Aqui você deve garantir que a fonte de dados atualize corretamente os dados para a nova página
    component.dataSource.paginator = component.paginator;

    // Verifica se a fonte de dados contém 10 itens na segunda página
    expect(component.dataSource.data.length).toBe(10); // A segunda página deve ter 10 itens
});
*/
  
  
  
  
});
