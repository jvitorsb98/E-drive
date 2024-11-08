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
import { HttpErrorResponse } from '@angular/common/http';

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

  // Colunas exibidas na tabela
  displayedColumns: string[] = ['icon', 'marck', 'name',  'actions'];
  dataSource = new MatTableDataSource<Model>(); // Fonte de dados para a tabela
  models: Model[] = []; // Lista de modelos
  selectedStatus: Boolean | 'all' = 'all';
  filterValueName: string = '';

  // config de paginacao e ordenacao da tabela
  totalModels: number = 0; // Total de veículos disponíveis
  pageIndex: number = 0; // Índice da página atual
  pageSize: number = 10; // Tamanho da página
  currentPage: number = 0; // Página atual
  isFilterActive: boolean = false; // Indica se o filtro está ativo
  filteredData: Model[] = []; // Dados filtrados
  searchKey: any; // Chave de busca para filtro

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginação da tabela
  @ViewChild(MatSort) sort!: MatSort; // Ordenação da tabela

  /**
  * @description Inicializa o serviço de modelos, o diálogo para modais e o serviço de alertas.
  *               Também inicializa o data source da tabela com os modelos.
  * @param {ModelService} modelService - Serviço responsável pela manipulação de modelos.
  * @param {MatDialog} dialog - Serviço utilizado para abrir diálogos modais.
  * @param {AlertasService} alertService - Serviço para exibição de alertas e notificações.
  */
  constructor(
    private modelService: ModelService, // Serviço de modelos
    private dialog: MatDialog, // Diálogo para modais
    private alertService: AlertasService
  ) {
    this.dataSource = new MatTableDataSource(this.models); // Inicializa o datasource da tabela
  }

  /**
 * @description Carrega os modelos ao iniciar o componente.
 */
  ngOnInit() {
    this.loadModels(this.currentPage, this.pageSize); // Carrega os modelos ao iniciar o componente
  }

  /**
   * @description Configura a paginação e a ordenação após a visualização do componente.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Configura a paginação
    this.dataSource.sort = this.sort; // Configura a ordenação
    this.paginator._intl.itemsPerPageLabel = 'Itens por página'; // Customiza o rótulo de itens por página
  }

  /**
 * @description Carrega a lista de modelos do serviço com paginação.
 * @param {number} pageIndex - Índice da página atual.
 * @param {number} pageSize - Tamanho da página.
 */
  loadModels(pageIndex: number, pageSize: number) {
    this.modelService.getAllPaginated(pageIndex, pageSize).subscribe({
      next: (response: PaginatedResponse<Model>) => { // Usa tipagem forte para o retorno da API

        this.models = response.content;

        if (Array.isArray(this.models)) {
          this.dataSource = new MatTableDataSource(this.models);
          this.dataSource.sort = this.sort; // Aplica a ordenação à fonte de dados
          this.totalModels = response.totalElements; // Atualiza o total de modelos para paginação
        } else {
          console.error('Expected an array in response.content, but got:', this.models);
        }
      },
      error: (error) => {
        console.error('Error on getListModels:', error);
      }
    });
  }

  /**
   * @description Lida com a mudança de página na tabela e recarrega a lista de modelos.
   * @param {any} event - O evento que contém informações sobre a mudança de página.
   */
  onPageChange(event: any) {
    this.pageSize = event.pageSize; // Atualiza o tamanho da página conforme o selecionado
    this.currentPage = event.pageIndex; // Atualiza o índice da página atual
    this.loadModels(this.currentPage, this.pageSize); // Recarrega os modelos para a nova página
  }

  /**
   * @description Aplica um filtro na lista de veículos com base na entrada do usuário.
   * @param {Event} event - O evento que contém o valor do filtro.
   */
  applyFilter(event: Event) {
    try {
      this.isFilterActive = true;
      this.filterValueName = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.searchKey = event;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }

      this.modelService.getAllPaginated(0, this.totalModels)
        .pipe(
          catchError((error) => {
            this.handleError(new HttpErrorResponse({ error: error }));
            return of([]); // Retorna um array vazio em caso de erro
          })
        )
        .subscribe((response: PaginatedResponse<Model> | never[]) => {
          if (Array.isArray(response)) {
            // Verifica se o retorno é um array vazio
            if (response.length === 0) {
              this.dataSource.data = [];
              return;
            }
          } else {
            this.filteredData = response.content.filter(model => {
              // Filtro pelo nome
              const nameMatches = model.name.toLowerCase().includes(this.filterValueName);
  
              // Filtro pelo status, se não for "all"
              const statusMatches = this.selectedStatus === 'all' || model.activated === this.selectedStatus;
  
              // Retorna verdadeiro se ambos os filtros forem verdadeiros
              return nameMatches && statusMatches;
            });

            if (this.filteredData.length > 0) {
              this.dataSource.data = this.filteredData;
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            } else {
              this.dataSource.data = [];
            }
          }
        });
    } catch (error) {
      this.handleError(new HttpErrorResponse({ error: error }));
    }
  }

  /**
   * @description Desativa um modelo e atualiza a lista após confirmação do usuário.
   * @param {Model} modelData - O modelo a ser desativado.
   */
  disableModel(modelData: Model) {
    this.alertService.showWarning(
      'Desativar Modelo',
      `Você tem certeza que deseja desativar o modelo "${modelData.name}"?`,
      'Sim, desativar!',
      'Cancelar'
    ).then((isConfirmed) => {
      if (isConfirmed) {
        this.modelService.delete(modelData.id).pipe(
          catchError(() => {
            this.alertService.showError('Erro!', 'Ocorreu um erro ao desativar o modelo. Tente novamente mais tarde.');
            return of(null); // Continua a sequência de observáveis com um valor nulo
          })
        ).subscribe(() => {
          this.alertService.showSuccess('Sucesso!', 'O modelo foi desativado com sucesso!').then(() => {
            this.searchKey ? this.applyFilter(this.searchKey) : this.loadModels(this.pageIndex, this.pageSize); // Atualiza a lista de modelos após a exclusão
          });
        });
      }
    });
  }

  /**
   * @description Ativa um modelo e atualiza a lista após confirmação do usuário.
   * @param {Model} model - O modelo a ser ativado.
   */
  activatedModel(model: Model) {
    this.alertService.showWarning(
      'Ativar Modelo',
      `Você tem certeza que deseja ativar o modelo "${model.name}"?`,
      'Sim, ativar!',
      'Cancelar'
    ).then((isConfirmed) => {
      if (isConfirmed) {
        this.modelService.activated(model.id).subscribe({
          next: () => {
            this.alertService.showSuccess('Sucesso!', 'O modelo foi ativado com sucesso!').then(() =>
              this.searchKey ? this.applyFilter(this.searchKey) : this.loadModels(this.pageIndex, this.pageSize)
            );
          },
          error: (error) => {
            this.alertService.showError('Erro!', 'Ocorreu um erro ao ativar o modelo. Tente novamente mais tarde.');
          }
        });
      }
    });
  }

  /**
   * Trata erros de resposta HTTP e exibe um alerta ao usuário.
   *
   * @param {HttpErrorResponse} error - Objeto de erro da resposta HTTP.
   */
  handleError(error: HttpErrorResponse) {
    this.alertService.showError("Erro !!", error.message);
  }

  /**
   * Exibe um alerta de sucesso ao usuário.
   *
   * @param {string} text - Texto opcional a ser exibido na mensagem de sucesso.
   */
  handleSuccess(text: string = "Operação realizada com sucesso") {
    this.alertService.showSuccess("Sucesso !!", text);
  }

  /**
   * @description Abre um modal para visualizar detalhes do modelo selecionado.
   * @param {Model} model - O modelo cujos detalhes serão visualizados.
   */
  openModalViewModel(model: Model) {
    this.dialog.open(ModalDetailsModelComponent, {
      width: '300px',
      height: '286px',
      data: model // Passa os dados do modelo selecionado para o modal
    });
  }

  /**
   * @description Abre um modal para adicionar um novo modelo.
   */
  openModalAddModel() {
    this.dialog.open(ModalFormModelComponent, {
      width: '500px',
      height: '288px',
    }).afterClosed().subscribe(() =>
      this.loadModels(this.pageIndex, this.pageSize) // Recarrega a lista de modelos após o fechamento do modal
    );
  }

  /**
   * @description Abre um modal para editar um modelo existente.
   * @param {Model} model - O modelo a ser editado.
   */
  openModalEditModel(model: Model) {
    this.dialog.open(ModalFormModelComponent, {
      width: '500px',
      height: '288px',
      data: model // Passa os dados do modelo para o modal
    }).afterClosed().subscribe(() => this.searchKey ? this.applyFilter(this.searchKey) :
      this.loadModels(this.pageIndex, this.pageSize) // Recarrega a lista de modelos após o fechamento do modal
    );
  }

  
  filterByStatus(status: boolean | 'all'): void {
    this.selectedStatus = status;
    console.log(this.selectedStatus)
      this.applyStatus();
  }


  applyStatus() {

      this.modelService.getAllPaginated(0, this.totalModels , this.selectedStatus.toString())
        .pipe(
          catchError((error) => {
            this.handleError(new HttpErrorResponse({ error: error }));
            return of([]); // Retorna um array vazio em caso de erro
          })
        )
        .subscribe((response: PaginatedResponse<Model> | never[]) => {
          if (Array.isArray(response)) {
            if (response.length === 0) {
              this.dataSource.data = [];
              return;
            }
          } else {
            // Aplica o filtro por nome da marca
            this.filteredData = response.content.filter(model => {
              // Filtro pelo nome
              const nameMatches = model.name.toLowerCase().includes(this.filterValueName);
  
              // Filtro pelo status, se não for "all"
              const statusMatches = this.selectedStatus === 'all' || model.activated === this.selectedStatus;
  
              // Retorna verdadeiro se ambos os filtros forem verdadeiros
              return nameMatches && statusMatches;
            });



            console.log(this.filteredData)
  
            if (this.filteredData.length > 0) {
              this.dataSource.data = this.filteredData;
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            } else {
              this.dataSource.data = [];
            }
          }
        });

  }



}
