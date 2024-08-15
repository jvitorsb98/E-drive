import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { UserVehicle } from '../../../../core/models/UserVehicle';
import { mockUserVehicles } from '../../../../core/models/moke/MockUserVehicleData';

@Component({
  selector: 'app-user-vehicle-list',
  templateUrl: './user-vehicle-list.component.html',
  styleUrl: './user-vehicle-list.component.scss'
})
export class UserVehicleListComponent {

  displayedColumns: string[] = ['id', 'mark', 'model', 'version', 'actions'];
  // dataSource = new MatTableDataSource<Vehicle>();
  dataSource: any;
  listUserVehicles: UserVehicle[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userVehicleService: UserVehicleService) {
    this.dataSource = new MatTableDataSource(this.listUserVehicles);
  }

  ngOnInit() {
    this.getListUserVehicles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getListUserVehicles() {
    // this.userVehicleService.getAllUserVehicle().subscribe({
    //   next: (response: UserVehicle[]) => { // Tipando a resposta como um array de Vehicle
    //     // this.dataSource.data = response;
    //     this.listUserVehicles = response;

    //     this.dataSource = new MatTableDataSource(this.listUserVehicles);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   },
    //   error: (err) => {
    //     console.error('Error fetching userVehicles:', err); // Melhor prática: usar console.error para erros
    //   }
    // });

    this.listUserVehicles = mockUserVehicles;
    this.dataSource = new MatTableDataSource(this.listUserVehicles);
    // this.dataSource.data = this.listUserVehicles;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // createFilter(): (data: Vehicle, filter: string) => boolean {
  //   return (data: Vehicle, filter: string): boolean => {
  //     const searchString = `${data.id} ${data.category.name} ${data.model.name} ${data.version}`.toLowerCase();
  //     return searchString.includes(filter);
  //   };
  // }
}
