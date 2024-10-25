// Componente para visualizar detalhes do modelo
import { ModalDetailsModelComponent } from '../modal-details-model/modal-details-model.component';

// Componente para adicionar/editar um modelo
import { ModalFormModelComponent } from '../modal-form-model/modal-form-model.component';

// Modelo de dados para o modelo
import { Model } from '../../../../../core/models/model';

// Serviço para operações relacionadas a modelos
import { ModelService } from '../../../../../core/services/model/model.service';

// Interface para resposta paginada
import { PaginatedResponse } from '../../../../../core/models/paginatedResponse';

// Imports do Angular Material
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

// Imports de bibliotecas externas
import { catchError, of } from 'rxjs';
import { AlertasService } from '../../../../../core/services/Alertas/alertas.service';

/**
 * Componente para listar e gerenciar modelos de veículos.
 *
 * **Passo a passo de chamada de métodos:**
 * 1. **ngOnInit**: Carrega a lista de modelos ao iniciar o componente chamando `loadModels()`.
 * 2. **ngAfterViewInit**: Configura a paginação e ordenação da tabela.
 * 3. **loadModels**: Faz uma chamada ao serviço para obter todos os modelos e atualiza a tabela.
 * 4. **deleteModel**: Deleta um modelo específico e atualiza a lista após a confirmação.
 * 5. **applyFilter**: Aplica um filtro à tabela com base na entrada do usuário.
 * 6. **openModalViewModel**: Abre um modal para visualizar os detalhes de um modelo específico.
 * 7. **openModalAddModel**: Abre um modal para adicionar um novo modelo e atualiza a lista após o fechamento.
 * 8. **openModalEditModel**: Abre um modal para editar um modelo existente e atualiza a lista após o fechamento.
 */
@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss'] // Corrigido para 'styleUrls'
})
export class ModelListComponent {
  totalModels: number = 0; // Total de veículos disponíveis
  pageIndex: number = 0; // Índice da página atual
  pageSize: number = 10; // Tamanho da página
  currentPage: number = 0; // Página atual
  // Colunas exibidas na tabela
  displayedColumns: string[] = ['icon', 'marck', 'name', 'activated', 'actions'];
  dataSource = new MatTableDataSource<Model>(); // Fonte de dados para a tabela
  modelList: Model[] = []; // Lista de modelos

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginação da tabela
  @ViewChild(MatSort) sort!: MatSort; // Ordenação da tabela

  constructor(
    private modelService: ModelService, // Serviço de modelos
    private dialog: MatDialog, // Diálogo para modais
    private alertasService: AlertasService
  ) {
    this.dataSource = new MatTableDataSource(this.modelList); // Inicializa o datasource da tabela
  }

  ngOnInit() {
    this.loadModels(this.currentPage, this.pageSize); // Carrega os modelos ao iniciar o componente
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Configura a paginação
    this.dataSource.sort = this.sort; // Configura a ordenação
    this.paginator._intl.itemsPerPageLabel = 'Itens por página'; // Customiza o rótulo de itens por página
  }

  // Obtém a lista de modelos do serviço
  loadModels(pageIndex: number, pageSize: number) {
    this.modelService.getAll(pageIndex, pageSize).subscribe({
      next: (response: PaginatedResponse<Model>) => { // Usa a interface tipada

        // Extrai o array de modelos do campo 'content'
        this.modelList = response.content;

        if (Array.isArray(this.modelList)) {
          this.dataSource = new MatTableDataSource(this.modelList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          console.error('Expected an array in response.content, but got:', this.modelList);
        }
      },
      error: (error) => {
        console.error('Error on getListModels:', error);
      }
    });
  }

    /**
   * Trata a mudança de página na tabela e atualiza a lista de veículos.
   *
   * @param {any} event - Evento de mudança de página.
   */
    onPageChange(event: any) {
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.loadModels(this.currentPage, this.pageSize);
    }

  // Deleta um modelo e atualiza a lista
  deleteModel(modelData: Model) {
    this.alertasService.showWarning(
      'Deletar Modelo',
      `Você tem certeza que deseja deletar o modelo "${modelData.name}"?`,
      'Sim, deletar!',
      'Cancelar'
    ).then((isConfirmed) => {
      if (isConfirmed) {
        this.modelService.delete(modelData.id).pipe(
          catchError(() => {
            this.alertasService.showError('Erro!', 'Ocorreu um erro ao deletar o modelo. Tente novamente mais tarde.');
            return of(null); // Continua a sequência de observáveis com um valor nulo
          })
        ).subscribe(() => {
          this.alertasService.showSuccess('Sucesso!', 'O modelo foi deletado com sucesso!').then(() => {
            this.loadModels(this.pageIndex, this.pageSize); // Atualiza a lista de modelos após a exclusão
          });
        });
      }
    });
  }

  // No arquivo: brand-list.component.ts
  activatedModel(model: Model) {
    this.alertasService.showWarning(
      'Ativar Modelo',
      `Você tem certeza que deseja ativar o modelo  "${model.name}"?`,
      'Sim, ativar!',
      'Cancelar'
    ).then((isConfirmed) => {
      if (isConfirmed) {
        this.modelService.activated(model.id).subscribe({
          next: () => {
            this.alertasService.showSuccess('Sucesso!', 'O modelo foi ativado com sucesso!').then(() => this.loadModels(this.pageIndex, this.pageSize));
          },
          error: (error) => {
            this.alertasService.showError('Erro!', 'Ocorreu um erro ao ativar o modelo. Tente novamente mais tarde.');
          }
        });
      }
    });
  }

  // Aplica filtro na tabela
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Abre o modal para visualizar detalhes do modelo
  openModalViewModel(model: Model) {
    this.dialog.open(ModalDetailsModelComponent, {
      width: '300px',
      height: '290px',
      data: model
    });
  }

  // Abre o modal para adicionar um novo modelo
  openModalAddModel() {
    this.dialog.open(ModalFormModelComponent, {
      width: '500px',
      height: '285px',
    }).afterClosed().subscribe(() => this.loadModels(this.pageIndex, this.pageSize)); // Atualiza a lista de modelos após o fechamento do modal
  }

  // Abre o modal para editar um modelo existente
  openModalEditModel(model: Model) {
    this.dialog.open(ModalFormModelComponent, {
      width: '500px',
      height: '285px',
      data: model
    }).afterClosed().subscribe(() => this.loadModels(this.pageIndex, this.pageSize)); // Atualiza a lista de modelos após o fechamento do modal
  }
}
