import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { UserVehicle } from '../../../../core/models/user-vehicle';
import { Vehicle } from '../../../../core/models/vehicle';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { forkJoin } from 'rxjs';
import { IApiResponse } from '../../../../core/interface/api-response';

@Component({
  selector: 'app-user-vehicle-list',
  templateUrl: './user-vehicle-list.component.html',
  styleUrl: './user-vehicle-list.component.scss'
})
export class UserVehicleListComponent {

  displayedColumns: string[] = ['mark', 'model', 'version', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();
  userVehicleList: UserVehicle[] = [];
  userVehicleDetails: Vehicle[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userVehicleService: UserVehicleService, private vehicleService: VehicleService) {
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
  //     next: (response: any) => {
  //       console.log('Response from getAllUserVehicle:', response);

  //       if (response && Array.isArray(response.content)) {
  //         this.userVehicleList = response.content;

  //         // Cria um array de observables para buscar detalhes dos veículos
  //         const vehicleDetailsObservables = this.userVehicleList.map(userVehicle =>
  //           this.vehicleService.getVehicleDetails(userVehicle.vehicleId)
  //         );

  //         // Usa forkJoin para esperar até que todas as requisições estejam completas
  //         forkJoin(vehicleDetailsObservables).subscribe((vehicles: Vehicle[]) => {
  //           this.userVehicleDetails = vehicles;
  //           this.dataSource.data = this.userVehicleDetails;
  //           console.log(this.dataSource)
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
            this.vehicleService.getVehicleDetails(userVehicle.vehicleId)
          );

          // Usa forkJoin para esperar até que todas as requisições estejam completas
          forkJoin(vehicleDetailsObservables).subscribe((vehicles: Vehicle[]) => {
            this.userVehicleDetails = vehicles;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
