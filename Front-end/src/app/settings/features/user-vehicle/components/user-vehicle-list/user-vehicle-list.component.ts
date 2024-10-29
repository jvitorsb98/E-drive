// Importa os módulos e classes do Angular
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

// Importa os modelos necessários
import { IVehicleWithUserVehicle } from '../../../../core/models/vehicle-with-user-vehicle';
import { UserVehicle } from '../../../../core/models/user-vehicle';
import { Vehicle } from '../../../../core/models/vehicle';
import { IApiResponse } from '../../../../core/models/api-response';

// Importa os serviços necessários
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { UserDataService } from '../../../../core/services/user/userdata/user-data.service';

// Importa os componentes do modal
import { ModalFormVehicleComponent } from '../modal-form-vehicle/modal-form-vehicle.component';
import { ModalDetailsVehicleComponent } from '../modal-details-vehicle/modal-details-vehicle.component';

// Importa funções e classes auxiliares
import Swal from 'sweetalert2';
import { catchError, forkJoin, map, of } from 'rxjs';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataAddressDetails } from '../../../../core/models/inter-Address';
import { PaginatedResponse } from '../../../../core/models/paginatedResponse';

@Component({
  selector: 'app-user-vehicle-list',
  templateUrl: './user-vehicle-list.component.html',
  styleUrls: ['./user-vehicle-list.component.scss']
})
export class UserVehicleListComponent {
  displayedColumns: string[] = ['icon', 'mark', 'model', 'version', 'actions'];
  dataSource = new MatTableDataSource<IVehicleWithUserVehicle>();
  userVehicleList: UserVehicle[] = [];
  userVehicleDetails: IVehicleWithUserVehicle[] = [];

  // config de paginacao e ordenacao da tabela
  total: number = 0; // Total de enderecos disponíveis
  pageIndex: number = 0; // Índice da página atual
  pageSize: number = 5; // Tamanho da página
  currentPage: number = 0; // Página atual
  isFilterActive: boolean = false; // Indica se o filtro está ativo
  filteredData: IVehicleWithUserVehicle[] = []; // Dados filtrados
  searchKey: any; // Chave de busca para filtro

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userVehicleService: UserVehicleService,
    private alertasService: AlertasService,
    private vehicleService: VehicleService,
    private userDataService: UserDataService,
    private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.userVehicleDetails);

  }

  ngOnInit() {
    this.getList(this.currentPage, this.pageSize); // Carrega os endereços ao iniciar o componente
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
  }

  getList(pageIndex: number, pageSize: number) {
    if (this.isFilterActive) {
      this.dataSource.data = this.filteredData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.userVehicleService.listAll(pageIndex, pageSize).subscribe({
        next: (response: PaginatedResponse<UserVehicle>) => {
          if (response && response.content && Array.isArray(response.content)) {
            this.userVehicleList = response.content;

            // Filtra os veículos que estão ativados
            const activeVehicles = this.userVehicleList.filter(vehicle => vehicle.activated);

            // Cria um array de observables para buscar detalhes dos veículos ativados
            const vehicleDetailsObservables = activeVehicles.map(userVehicle =>
              this.vehicleService.getVehicleDetails(userVehicle.vehicleId).pipe(
                map((vehicle: Vehicle) => ({ vehicle, userVehicle }))
              )
            );

            //  Usa forkJoin para esperar até que todas as requisições estejam completas
            forkJoin(vehicleDetailsObservables).subscribe((vehiclesWithUserVehicles) => {
              // Atualiza os dados com veículo e informações de UserVehicle
              this.userVehicleDetails = vehiclesWithUserVehicles.map(({ vehicle, userVehicle }) => {
                return {
                  ...vehicle,
                  userVehicle // Inclui o UserVehicle no veículo
                };
              });
              // Extrai o array de endereços do campo 'content'
              if (Array.isArray(this.userVehicleDetails)) {
                this.dataSource = new MatTableDataSource(this.userVehicleDetails);
                this.dataSource.sort = this.sort;
                this.total = response.totalElements;
              } else {
                this.alertasService.showError('Erro ao carregar endereços', 'Ocorreu um erro ao carregar os endereços.');
              }
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          this.alertasService.showError('Erro ao carregar endereços', error.error.message || 'Ocorreu um erro ao carregar os endereços.');
        }
      });
    }
  }

  /**
   * Trata a mudança de pagina na tabela e atualiza a lista de veiculos.
   *
   * @param {any} event - Evento de mudança de pagina.
   */
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getList(this.currentPage, this.pageSize);
  }

  // Deleta um veículo do usuário
  deleteUserVehicle(vehicleData: IVehicleWithUserVehicle) {
    this.alertasService.showWarning('Tem certeza?', `Deseja realmente deletar o veículo? Esta ação não poderá ser desfeita.`, 'Sim, deletar!', 'Cancelar').then((result) => {
      if (result) {
        this.userVehicleService.deleteUserVehicle(vehicleData.userVehicle.id).pipe(
          catchError(() => {
            this.alertasService.showError('Erro!', 'Ocorreu um erro ao deletar o veículo. Tente novamente mais tarde.');
            return of(null);
          })
        ).subscribe(() => {
          this.alertasService.showSuccess('Sucesso!', 'Veículo deletado com sucesso!');
          this.searchKey ? this.applyFilter(this.searchKey) :
            this.getList(this.currentPage, this.pageSize);
        })
      }
    });
  }

  // Formata os dados do veículo
  formatVehicleData(vehicle: Vehicle): Vehicle {
    Todo: // verificar se é necessário manter essa função
    vehicle.model.name = this.userDataService.capitalizeWords(vehicle.model.name);
    vehicle.version = this.userDataService.capitalizeWords(vehicle.version);
    vehicle.motor = this.userDataService.capitalizeWords(vehicle.motor);
    vehicle.type.name = this.userDataService.getVehicleTypeDisplay(vehicle.type.name);
    return vehicle;
  }

  /**
   * Aplica um filtro na lista de veículos com base na entrada do usuário.
   *
   * @param {Event} event - Evento de entrada do usuário.
   */
  applyFilter(event: Event) {
    try {
      this.isFilterActive = true;
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.searchKey = event;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }

      this.userVehicleService.listAll(0, this.total)
        .pipe(
          catchError((error) => {
            this.alertasService.showError("Erro !!", error.message);
            return of([]); // Retorna um array vazio em caso de erro
          })
        )
        .subscribe((response: PaginatedResponse<UserVehicle> | never[]) => {
          if (Array.isArray(response)) {
            // Verifica se o retorno é um array vazio
            if (response.length === 0) {
              this.dataSource.data = [];
              return;
            }
          } else {
            //TODO - melhorar esse filtro
            this.userVehicleList = response.content;

            // Filtra os veículos que estão ativados
            const activeVehicles = this.userVehicleList.filter(vehicle => vehicle.activated);

            // Cria um array de observables para buscar detalhes dos veículos ativados
            const vehicleDetailsObservables = activeVehicles.map(userVehicle =>
              this.vehicleService.getVehicleDetails(userVehicle.vehicleId).pipe(
                map((vehicle: Vehicle) => ({ vehicle, userVehicle }))
              )
            );

            //  Usa forkJoin para esperar até que todas as requisições estejam completas
            forkJoin(vehicleDetailsObservables).subscribe((vehiclesWithUserVehicles) => {
              // Atualiza os dados com veículo e informações de UserVehicle
              this.userVehicleDetails = vehiclesWithUserVehicles.map(({ vehicle, userVehicle }) => {
                return {
                  ...vehicle,
                  userVehicle // Inclui o UserVehicle no veículo
                };
              });

              this.filteredData = this.userVehicleDetails.filter(vehicle =>
                vehicle.model.name.toLowerCase().includes(filterValue) ||
                vehicle.version.toLowerCase().includes(filterValue));

              if (this.filteredData.length > 0) {
                this.dataSource.data = this.filteredData;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              } else {
                this.dataSource.data = [];
              }
            });
          }
        });
    } catch (error: any) {
      this.alertasService.showError("Erro !!", error.message);
    }
  }

  // Abre o modal de visualização de veículo
  openModalViewVehicle(userVehicleWithDetails: IVehicleWithUserVehicle) {
    this.dialog.open(ModalDetailsVehicleComponent, {
      width: '80vw',
      height: '74vh',
      data: {
        vehicle: userVehicleWithDetails,
        userVehicle: userVehicleWithDetails.userVehicle
      }
    });
  }

  // Abre o modal para adicionar um veículo
  openModalAddUserVehicle() {
    this.dialog.open(ModalFormVehicleComponent, {
      width: '80vw',
      height: '75vh',
      data: {}
    }).afterClosed().subscribe(() => this.getList(this.currentPage, this.pageSize));
  }

  // Abre o modal para editar um veículo
  openModalEditUserVehicle(userVehicleWithDetails: IVehicleWithUserVehicle) {
    this.dialog.open(ModalFormVehicleComponent, {
      width: '80vw',
      height: '75vh',
      data: {
        vehicle: userVehicleWithDetails,
        userVehicle: userVehicleWithDetails.userVehicle
      }
    }).afterClosed().subscribe(() => this.searchKey ? this.applyFilter(this.searchKey) :
      this.getList(this.currentPage, this.pageSize));
  }
}
