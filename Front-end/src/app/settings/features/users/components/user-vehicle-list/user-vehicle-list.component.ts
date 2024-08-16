import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { UserVehicle } from '../../../../core/models/UserVehicle';
import { Vehicle } from '../../../../core/models/Vehicle';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-vehicle-list',
  templateUrl: './user-vehicle-list.component.html',
  styleUrl: './user-vehicle-list.component.scss'
})
export class UserVehicleListComponent {

  displayedColumns: string[] = ['mark', 'model', 'version', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();
  listUserVehicles: UserVehicle[] = [];
  vehiclesDetails: Vehicle[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userVehicleService: UserVehicleService, private vehicleService: VehicleService) {
    this.dataSource = new MatTableDataSource(this.vehiclesDetails);
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

  //       // Acesse o array de veículos dentro de response.content
  //       if (response && Array.isArray(response.content)) {
  //         this.listUserVehicles = response.content;
  //         // this.dataSource.data = response.content;

  //         // Buscar detalhes dos veículos
  //         this.listUserVehicles.forEach(userVehicle => {
  //           this.vehicleService.getVehicleDetails(userVehicle.vehicleId).subscribe((vehicle: Vehicle) => {
  //             this.vehiclesDetails.push(vehicle);
  //             this.dataSource.data = this.vehiclesDetails;
  //           });
  //         });
  //         // this.dataSource.data = this.vehiclesDetails;
  //         // this.dataSource.data = this.vehiclesDetails;  
  //         console.log('dataSource:', this.dataSource);
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
      next: (response: any) => {
        console.log('Response from getAllUserVehicle:', response);

        if (response && Array.isArray(response.content)) {
          this.listUserVehicles = response.content;

          // Cria um array de observables para buscar detalhes dos veículos
          const vehicleDetailsObservables = this.listUserVehicles.map(userVehicle =>
            this.vehicleService.getVehicleDetails(userVehicle.vehicleId)
          );

          // Usa forkJoin para esperar até que todas as requisições estejam completas
          forkJoin(vehicleDetailsObservables).subscribe((vehicles: Vehicle[]) => {
            this.vehiclesDetails = vehicles;
            this.dataSource.data = this.vehiclesDetails;
            console.log(this.dataSource)
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
