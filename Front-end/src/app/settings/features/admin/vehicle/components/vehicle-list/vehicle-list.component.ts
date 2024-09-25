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

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent {
  totalVehicles: number = 0;
  pageIndex: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  displayedColumns: string[] = ['icon', 'motor','version', 'year', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();
  List: Vehicle[] = [];
  isFilterActive: boolean = false;
  filteredData: Vehicle[] = [];
  searchKey: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private alert: AlertasService
  ) {
    this.dataSource = new MatTableDataSource(this.List);
  }

  ngOnInit() {
    this.getList(this.currentPage , this.pageSize);
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
    }else {
      this.vehicleService.getAll(pageIndex, pageSize).subscribe({
        next: (response: PaginatedResponse<Vehicle>) => { // Usa a interface tipada
          // Extrai o array de marcas do campo 'content'
          this.List = response.content;

          if (Array.isArray(this.List)) {
            this.dataSource = new MatTableDataSource(this.List);
            this.dataSource.sort = this.sort;
            this.totalVehicles = response.totalElements;
          } else {
            this.alert.showError("Erro !!", "Ocorreu um erro ao obter a lista de veículos");
          }
        },
        error: (error: any) => {
          this.handleError(error);
        }
      });
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getList(this.currentPage, this.pageSize);
  }

  deactivate(Data: Vehicle) {
    this.vehicleService.deactivate(Data.id).subscribe({
      next: () => {
        this.handleSuccess("Desativado com sucesso")
        this.searchKey? this.applyFilter(this.searchKey) : this.getList(this.pageIndex, this.pageSize);
      },
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  activate(Data: Vehicle) {
    this.vehicleService.activate(Data.id).subscribe({
      next: () => {
        this.handleSuccess("Ativado com sucesso")
        this.searchKey? this.applyFilter(this.searchKey) : this.getList(this.pageIndex, this.pageSize);
      },
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  handleError(error: HttpErrorResponse) {
    this.alert.showError("Erro !!",error.message);
  }

  handleSuccess(text: string = "Operação realizada com sucesso") {
    this.alert.showSuccess("Sucesso !!", text)
  }

  applyFilter(event: Event) {
    try {
      this.isFilterActive = true;
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
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
            this.filteredData = response.content.filter(vehicle =>
              vehicle.version.toLowerCase().includes(filterValue) ||
              vehicle.motor.toLowerCase().includes(filterValue)
            );

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

  // LOGICA DO MODAL
  openModalView(vehicle: Vehicle) {
    this.dialog.open(ModalDetailsVehicleComponent, {
      width: '99%',
      height: '80%',
      data: vehicle
    });
  }

  openModalAdd() {
    this.dialog.open(ModalFormVehicleComponent, {
      width: '99%',
      height: '80%',
      data: null
    }).afterClosed().subscribe(() => this.getList(this.pageIndex, this.pageSize));
  }

  openModalEdit(vehicle: Vehicle) {
    this.dialog.open(ModalFormVehicleComponent, {
      width: '99%',
      height: '80%',
      data: vehicle
    }).afterClosed().subscribe(() => this.getList(this.pageIndex, this.pageSize)); // Atualiza a lista de veículos após fechar o modal
  }
}

