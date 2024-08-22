import { UserDataService } from './../../../../core/services/user/userdata/user-data.service';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { UserVehicle } from '../../../../core/models/user-vehicle';
import { Vehicle } from '../../../../core/models/vehicle';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { forkJoin, map } from 'rxjs';
import { IApiResponse } from '../../../../core/interface/api-response';
import { MatDialog } from '@angular/material/dialog';
import { ModalViewVehicleComponent } from './modal-view-vehicle/modal-view-vehicle.component';
import { ModalFormVehicleComponent } from './modal-form-vehicle/modal-form-vehicle.component';
import { User } from '../../../../core/models/user';
import { IVehicleWithUserVehicle } from '../../../../core/interface/vehicle-with-user-vehicle';


@Component({
  selector: 'app-user-vehicle',
  templateUrl: './user-vehicle.component.html',
  styleUrl: './user-vehicle.component.scss'
})
export class UserVehicleComponent {
  displayedColumns: string[] = ['icon', 'mark', 'model', 'version', 'actions'];
  // dataSource = new MatTableDataSource<Vehicle>();
  dataSource = new MatTableDataSource<IVehicleWithUserVehicle>();
  userVehicleList: UserVehicle[] = [];
  // userVehicleDetails: Vehicle[] = [];
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

  // getListUserVehicles() {
  //   this.userVehicleService.getAllUserVehicle().subscribe({
  //     next: (response: IApiResponse<UserVehicle[]>) => {
  //       console.log('Response from getAllUserVehicle:', response);

  //       if (response && response.content && Array.isArray(response.content)) {
  //         this.userVehicleList = response.content;

  //         // Cria um array de observables para buscar detalhes dos veículos
  //         const vehicleDetailsObservables = this.userVehicleList.map(userVehicle =>
  //           this.vehicleService.getVehicleDetails(userVehicle.vehicleId)
  //         );

  //         // Usa forkJoin para esperar até que todas as requisições estejam completas
  //         forkJoin(vehicleDetailsObservables).subscribe((vehicles: Vehicle[]) => {
  //           this.userVehicleDetails = vehicles.map(vehicle => this.formatVehicleData(vehicle));
  //           this.dataSource.data = this.userVehicleDetails;
  //           console.log(this.dataSource);
  //         });
  //       } else {
  //         console.error('Expected an array in response.content but got:', response.content);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching userVehicles:', err);
  //     }
  //   });
  // }

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
  openModalViewVeicle(userVehicle: Vehicle) {
    this.dialog.open(ModalViewVehicleComponent, {
      width: '600px',
      height: '530px',
      data: userVehicle
    });
  }

  openModalAddUserVehicle() {
    this.dialog.open(ModalFormVehicleComponent, {
      width: '600px',
      height: '810px',
      data: {}
    }).afterClosed().subscribe(() => this.getListUserVehicles());
  }

  // openModalEditUserVehicle(userVehicle: UserVehicle) {
  //   this.dialog.open(ModalFormVehicleComponent, {
  //     width: '600px',
  //     height: '810px',
  //     data: userVehicle,
  //   }).afterClosed().subscribe(() => this.getListUserVehicles());
  // }

  // openModalEditUserVehicle(userVehicle: Vehicle) {

  //   this.dialog.open(ModalFormVehicleComponent, {
  //     width: '600px',
  //     height: '810px',
  //     data: userVehicle,
  //   }).afterClosed().subscribe(() => this.getListUserVehicles());
  // }

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