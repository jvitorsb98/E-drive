import { Component, ViewChild } from '@angular/core';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { Vehicle } from '../../../../core/models/Vehicle';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent {

  displayedColumns: string[] = ['id', 'mark', 'model', 'version', 'actions'];
  // dataSource = new MatTableDataSource<Vehicle>();
  dataSource: any;
  listVehicles: Vehicle[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private vehicleService: VehicleService) {
    this.dataSource = new MatTableDataSource(this.listVehicles);
  }

  ngOnInit() {
    this.getListVehicles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
  }

  getListVehicles() {
    // this.vehicleService.getAllVehicle().subscribe({
    //   next: (response: Vehicle[]) => { // Tipando a resposta como um array de Vehicle
    //     // this.dataSource.data = response;
    //     this.listVehicles = response;

    //     this.dataSource = new MatTableDataSource(this.listVehicles);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   },
    //   error: (err) => {
    //     console.error('Error fetching vehicles:', err); // Melhor prática: usar console.error para erros
    //   }
    // });

    this.dataSource = new MatTableDataSource(this.listVehicles);
    // this.dataSource.data = this.listVehicles;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}