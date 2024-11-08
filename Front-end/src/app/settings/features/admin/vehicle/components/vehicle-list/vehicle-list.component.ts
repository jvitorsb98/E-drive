import { version } from './../../../../../../../../node_modules/@types/babel__core/index.d';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of } from 'rxjs';
import { PaginatedResponse } from '../../../../../core/models/paginatedResponse';
import { Vehicle } from '../../../../../core/models/vehicle';
import { VehicleService } from '../../../../../core/services/vehicle/vehicle.service';
import { ModalFormVehicleComponent } from '../modal-form-vehicle/modal-form-vehicle.component';
import { ModalDetailsVehicleComponent } from '../modal-details-vehicle/modal-details-vehicle.component';
import { AlertasService } from '../../../../../core/services/Alertas/alertas.service';

/**
 * Componente para listar veículos.
 *
 * **Passo a passo de chamada de métodos:**
 * 1. **ngOnInit**: Obtém a lista de veículos quando o componente é inicializado.
 * 2. **ngAfterViewInit**: Configura o paginator e o sort após a visualização ser inicializada.
 * 3. **getList**: Obtém a lista de veículos da API, tratando a paginação e filtragem.
 * 4. **onPageChange**: Trata a mudança de página e obtém novos dados.
 * 5. **deactivate/activate**: Desativa ou ativa um veículo, respectivamente, e atualiza a lista.
 * 6. **applyFilter**: Aplica um filtro à lista de veículos com base na entrada do usuário.
 * 7. **openModalView/openModalAdd/openModalEdit**: Abre modais para visualizar, adicionar ou editar veículos.
 */
@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent {
  
  displayedColumns: string[] = ['icon', 'mark', 'model', 'version', 'actions']; // Colunas a serem exibidas na tabela
  dataSource = new MatTableDataSource<Vehicle>(); // Fonte de dados da tabela
  vehicles: Vehicle[] = []; // Lista de veículos
  selectedStatus: boolean | 'all' = 'all';
  filterValueName: string = '';

  // config de paginacao e ordenacao da tabela
  totalVehicles: number = 0; // Total de veículos disponíveis
  pageIndex: number = 0; // Índice da página atual
  pageSize: number = 10; // Tamanho da página
  currentPage: number = 0; // Página atual
  isFilterActive: boolean = false; // Indica se o filtro está ativo
  filteredData: Vehicle[] = []; // Dados filtrados
  searchKey: any; // Chave de busca para filtro

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginator da tabela
  @ViewChild(MatSort) sort!: MatSort; // Sort da tabela

  /**
   * Construtor do componente VehicleList.
   *
   * Inicializa a lista de veículos e configura os serviços.
   *
   * @param {VehicleService} vehicleService - Serviço para operações com veículos.
   * @param {MatDialog} dialog - Serviço para gerenciar diálogos modais.
   * @param {AlertasService} alertServise - Serviço para mostrar alertas ao usuário.
   */
  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private alertServise: AlertasService
  ) {
    this.dataSource = new MatTableDataSource(this.vehicles);
  }

  /**
   * Método do ciclo de vida que é chamado ao inicializar o componente.
   * Obtém a lista de veículos.
   */
  ngOnInit() {
    this.loadVehicles(this.currentPage, this.pageSize);
  }

  /**
   * Método do ciclo de vida que é chamado após a visualização do componente ser inicializada.
   * Configura o paginator e o sort da tabela.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
  }

  /**
   * Obtém a lista de veículos da API com base na paginação.
   *
   * @param {number} pageIndex - Índice da página atual.
   * @param {number} pageSize - Tamanho da página.
   */
  loadVehicles(pageIndex: number, pageSize: number) {
    if (this.isFilterActive) {
      this.dataSource.data = this.filteredData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.vehicleService.getAll(pageIndex, pageSize).subscribe({
        next: (response: PaginatedResponse<Vehicle>) => { // Usa a interface tipada
          // Extrai o array de veículos do campo 'content'
          this.vehicles = response.content;
          if (Array.isArray(this.vehicles)) {
            this.dataSource = new MatTableDataSource(this.vehicles);
            this.dataSource.sort = this.sort;
            this.totalVehicles = response.totalElements;
          } else {
            this.alertServise.showError("Erro !!", "Ocorreu um erro ao obter a lista de veículos");
          }
        },
        error: (error: any) => {
          this.handleError(error);
        }
      });
    }
  }

  /**
   * Trata a mudança de página na tabela e atualiza a lista de veículos.
   *
   * @param {any} event - Evento de mudança de página.
   */
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadVehicles(this.currentPage, this.pageSize);
  }

  /**
   * Desativa um veículo com base no seu ID.
   *
   * @param {Vehicle} Data - Objeto do veículo a ser desativado.
   */
  deactivate(Data: Vehicle) {
    this.alertServise.showWarning(
      'Desativar Veículo',
      `Você tem certeza que deseja desativar o veículo "${Data.version}"?`,
      'Sim, desativar!',
      'Cancelar'
    ).then((isConfirmed) => {
      if (isConfirmed) {
        this.vehicleService.deactivate(Data.id).subscribe({
          next: () => {
            this.handleSuccess('Veículo desativado com sucesso!');
            this.searchKey ? this.applyFilter(this.searchKey) : this.loadVehicles(this.pageIndex, this.pageSize);
          },
          error: (error: HttpErrorResponse) => this.handleError(error)
        });
      }
    });
  }
  
  /**
   * Ativa um veículo com base no seu ID.
   *
   * @param {Vehicle} Data - Objeto do veículo a ser ativado.
   */
  activate(Data: Vehicle) {
    this.alertServise.showWarning(
      'Ativar Veículo',
      `Você tem certeza que deseja ativar o veículo "${Data.version}"?`,
      'Sim, ativar!',
      'Cancelar'
    ).then((isConfirmed) => {
      if (isConfirmed) {
        this.vehicleService.activate(Data.id).subscribe({
          next: () => {
            this.handleSuccess('Veículo ativado com sucesso!');
            this.searchKey ? this.applyFilter(this.searchKey) : this.loadVehicles(this.pageIndex, this.pageSize);
          },
          error: (error: HttpErrorResponse) => this.handleError(error)
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
    this.alertServise.showError("Erro !!", error.message);
  }

  /**
   * Exibe um alerta de sucesso ao usuário.
   *
   * @param {string} text - Texto opcional a ser exibido na mensagem de sucesso.
   */
  handleSuccess(text: string = "Operação realizada com sucesso") {
    this.alertServise.showSuccess("Sucesso !!", text);
  }

  /**
   * Aplica um filtro na lista de veículos com base na entrada do usuário.
   *
   * @param {Event} event - Evento de entrada do usuário.
   */
  applyFilter(event: Event) {
    try {
      this.isFilterActive = true;
      this.filterValueName = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.searchKey = event;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }

      this.vehicleService.getAll(0, this.totalVehicles)
        .pipe(
          catchError((error) => {
            this.handleError(new HttpErrorResponse({ error: error }));
            return of([]); // Retorna um array vazio em caso de erro
          })
        )
        .subscribe((response: PaginatedResponse<Vehicle> | never[]) => {
          if (Array.isArray(response)) {
            // Verifica se o retorno é um array vazio
            if (response.length === 0) {
              this.dataSource.data = [];
              return;
            }
          } else {
            this.filteredData = response.content.filter(vehicle => {
              // Filtro pelo nome
              const nameMatches = vehicle.version.toLowerCase().includes(this.filterValueName);
  
              // Filtro pelo status, se não for "all"
              const statusMatches = this.selectedStatus === 'all' || vehicle.activated === this.selectedStatus;
  
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

  // LOGICA DOS MODAIS

  /**
   * Abre um modal para visualizar os detalhes de um veículo.
   *
   * @param {Vehicle} vehicle - Objeto do veículo a ser visualizado.
   */
  openModalView(vehicle: Vehicle) {
    this.dialog.open(ModalDetailsVehicleComponent, {
      width: '80%',
      height: '76%',
      data: vehicle
    });
  }

  /**
   * Abre um modal para adicionar um novo veículo.
   */
  openModalAdd() {
    this.dialog.open(ModalFormVehicleComponent, {
      width: '99%',
      height: '80%',
      data: null
    }).afterClosed().subscribe(() => this.loadVehicles(this.pageIndex, this.pageSize));
  }

  /**
   * Abre um modal para editar um veículo existente.
   *
   * @param {Vehicle} vehicle - Objeto do veículo a ser editado.
   */
  openModalEdit(vehicle: Vehicle) {
    this.dialog.open(ModalFormVehicleComponent, {
      width: '99%',
      height: '80%',
      data: vehicle
    }).afterClosed().subscribe(() => this.loadVehicles(this.pageIndex, this.pageSize)); // Atualiza a lista de veículos após fechar o modal
  }

  filterByStatus(status: boolean | 'all'): void {
    this.selectedStatus = status;
    console.log(this.selectedStatus)
      this.applyStatus();
  }


  applyStatus() {

      this.vehicleService.getAll(0, this.totalVehicles , this.selectedStatus.toString())
        .pipe(
          catchError((error) => {
            this.handleError(new HttpErrorResponse({ error: error }));
            return of([]); // Retorna um array vazio em caso de erro
          })
        )
        .subscribe((response: PaginatedResponse<Vehicle> | never[]) => {
          if (Array.isArray(response)) {
            if (response.length === 0) {
              this.dataSource.data = [];
              return;
            }
          } else {
            // Aplica o filtro por nome da marca
            this.filteredData = response.content.filter(vehicle => {
              // Filtro pelo nome
              const nameMatches = vehicle.version.toLowerCase().includes(this.filterValueName);
  
              // Filtro pelo status, se não for "all"
              const statusMatches = this.selectedStatus === 'all' || vehicle.activated === this.selectedStatus;
  
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
