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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userVehicleService: UserVehicleService,
    private vehicleService: VehicleService,
    private userDataService: UserDataService,
    private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.userVehicleDetails);
  }

  ngOnInit() {
    this.getListUserVehicles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
  }

  // Obtém a lista de veículos do usuário
  getListUserVehicles() {
    this.userVehicleService.getAllUserVehicle().subscribe({
      next: (response: IApiResponse<UserVehicle[]>) => {
        console.log('Response from getAllUserVehicle:', response);

        if (response && response.content && Array.isArray(response.content)) {
          this.userVehicleList = response.content;

          // Cria um array de observables para buscar detalhes dos veículos
          const vehicleDetailsObservables = this.userVehicleList.map(userVehicle =>
            this.vehicleService.getVehicleDetails(userVehicle.vehicleId).pipe(
              map((vehicle: Vehicle) => ({ vehicle, userVehicle }))
            )
          );

          // Usa forkJoin para esperar até que todas as requisições estejam completas
          forkJoin(vehicleDetailsObservables).subscribe((vehiclesWithUserVehicles) => {
            // Atualiza os dados com veículo e informações de UserVehicle
            this.userVehicleDetails = vehiclesWithUserVehicles.map(({ vehicle, userVehicle }) => {
              return {
                ...vehicle,
                userVehicle // Inclui o UserVehicle no veículo
              };
            });

            this.dataSource.data = this.userVehicleDetails;
            console.log(this.dataSource);
          });
        } else {
          console.error('Expected an array in response.content but got:', response.content);
        }
      },
      error: (err) => {
        console.error('Error fetching userVehicles:', err);
      }
    });
  }

  // Deleta um veículo do usuário
  deleteUserVehicle(vehicleData: IVehicleWithUserVehicle) {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja realmente deletar o veículo? Esta ação não poderá ser desfeita.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#19B6DD',
      cancelButtonColor: '#ff6b6b',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deletando veículo:', vehicleData);
        this.userVehicleService.deleteUserVehicle(vehicleData.userVehicle.id).pipe(
          catchError(() => {
            Swal.fire({
              title: 'Erro!',
              icon: 'error',
              text: 'Ocorreu um erro ao deletar o veículo. Tente novamente mais tarde.',
              showConfirmButton: true,
              confirmButtonColor: 'red',
            });
            return of(null);
          })
        ).subscribe(() => {
          Swal.fire({
            title: 'Sucesso!',
            icon: 'success',
            text: 'O veículo foi deletado com sucesso!',
            showConfirmButton: true,
            confirmButtonColor: '#19B6DD',
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              this.getListUserVehicles();
            }
          });
        });
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

  // Aplica o filtro na tabela
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Abre o modal de visualização de veículo
  openModalViewVehicle(userVehicleWithDetails: IVehicleWithUserVehicle) {
    this.dialog.open(ModalDetailsVehicleComponent, {
      width: '80vw',
      height: '75vh',
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
      height: '90vh',
      data: {}
    }).afterClosed().subscribe(() => this.getListUserVehicles());
  }

  // Abre o modal para editar um veículo
  openModalEditUserVehicle(userVehicleWithDetails: IVehicleWithUserVehicle) {
    this.dialog.open(ModalFormVehicleComponent, {
      width: '80vw',
      height: '90vh',
      data: {
        vehicle: userVehicleWithDetails,
        userVehicle: userVehicleWithDetails.userVehicle
      }
    }).afterClosed().subscribe(() => this.getListUserVehicles());
  }
}
