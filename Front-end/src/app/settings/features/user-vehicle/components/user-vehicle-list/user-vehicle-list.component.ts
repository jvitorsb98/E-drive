import { Component, ViewChild } from '@angular/core';
import { IVehicleWithUserVehicle } from '../../../../core/interface/vehicle-with-user-vehicle';
import { MatTableDataSource } from '@angular/material/table';
import { UserVehicle } from '../../../../core/models/user-vehicle';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { UserDataService } from '../../../../core/services/user/userdata/user-data.service';
import { MatDialog } from '@angular/material/dialog';
import { IApiResponse } from '../../../../core/interface/api-response';
import { Vehicle } from '../../../../core/models/vehicle';
import Swal from 'sweetalert2';
import { ModalFormVehicleComponent } from '../modal-form-vehicle/modal-form-vehicle.component';
import { catchError, forkJoin, map, of } from 'rxjs';
import { ModalDetailsVehicleComponent } from '../modal-details-vehicle/modal-details-vehicle.component';

@Component({
  selector: 'app-user-vehicle-list',
  templateUrl: './user-vehicle-list.component.html',
  styleUrl: './user-vehicle-list.component.scss'
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

  deleteUserVehicle(vehicleData: IVehicleWithUserVehicle) {
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
        return of(null); // Continua a sequência de observáveis com um valor nulo
      })
    ).subscribe(() => {  // Omiti o parâmetro `response` porque o backend esta retornando null
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

  formatVehicleData(vehicle: Vehicle): Vehicle {
    vehicle.model.name = this.userDataService.capitalizeWords(vehicle.model.name);
    vehicle.version = this.userDataService.capitalizeWords(vehicle.version);
    vehicle.motor = this.userDataService.capitalizeWords(vehicle.motor);
    vehicle.type.name = this.userDataService.getVehicleTypeDisplay(vehicle.type.name);
    return vehicle;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // LOGICA DO MODAL
  openModalViewVeicle(userVehicleWithDetails: IVehicleWithUserVehicle) {
    this.dialog.open(ModalDetailsVehicleComponent, {
      width: '600px',
      height: '530px',
      data: {
        vehicle: userVehicleWithDetails,
        userVehicle: userVehicleWithDetails.userVehicle
      }
    });
  }

  openModalAddUserVehicle() {
    this.dialog.open(ModalFormVehicleComponent, {
      width: '600px',
      height: '810px',
      data: {}
    }).afterClosed().subscribe(() => this.getListUserVehicles());
  }

  openModalEditUserVehicle(userVehicleWithDetails: IVehicleWithUserVehicle) {
    this.dialog.open(ModalFormVehicleComponent, {
      width: '600px',
      height: '810px',
      data: {
        vehicle: userVehicleWithDetails,
        userVehicle: userVehicleWithDetails.userVehicle
      }
    }).afterClosed().subscribe(() => this.getListUserVehicles());
  }
}
