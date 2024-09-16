import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { PaginatedResponse } from '../../../../core/models/paginatedResponse';
import { ModalDetailsModelComponent } from '../../../model/components/modal-details-model/modal-details-model.component';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { Vehicle } from '../../../../core/models/vehicle';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-vehicles',
  templateUrl: './list-vehicles.component.html',
  styleUrl: './list-vehicles.component.scss'
})
export class ListVehiclesComponent {
  totalVehicles: number = 0;
  pageIndex: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  displayedColumns: string[] = ['icon', 'motor','version', 'year', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();
  List: Vehicle[] = [];
  isFilterActive: boolean = false;
  filteredData: Vehicle[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog
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
            this.showAlert("Erro !!", "Ocorreu um erro ao obter a lista de veículos");
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
        this.getList(this.pageIndex, this.pageSize);
      },
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  activate(Data: Vehicle) {
    this.vehicleService.activate(Data.id).subscribe({
      next: () => {
        this.handleSuccess("Ativado com sucesso")
        this.getList(this.pageIndex, this.pageSize);
      },
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  handleError(error: HttpErrorResponse) {
    this.showAlert("Erro !!", error.message);
  }

  handleSuccess(text: string = "Operação realizada com sucesso") {
    this.showAlert("Sucesso !!", text, true);
  }

  // TODO: O Filtro esta com bug quando pula para proximo paginacao
  applyFilter(event: Event) {
    try {
      this.isFilterActive = true;
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

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


  private showAlert(title: string = 'Erro', text: string = 'Algo deu errado', success: boolean = false): void {
    const icon = success ? 'success' : 'error';
    const popup = success ? 'custom-swal-popup-success' : 'custom-swal-popup-error';
    const confirmButton = success ? 'custom-swal-confirm-button-success' : 'custom-swal-confirm-button-error';

    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonText: 'Ok',
      customClass: {
        popup: popup,
        confirmButton: confirmButton
      }
    });
  }

  // LOGICA DO MODAL
  openModalView(vehicle: Vehicle) {
    this.dialog.open(ModalDetailsModelComponent, {
      width: '100%',
      height: '100%',
      data: vehicle
    });
  }

  openModalAdd() {
    this.dialog.open(VehicleFormComponent, {
      width: '99vw',
      height: '100vh',
      data: null
    }).afterClosed().subscribe(() => this.getList(this.pageIndex, this.pageSize));
  }

  openModalEdit(vehicle: Vehicle) {
    this.dialog.open(VehicleFormComponent, {
      width: '100%',
      height: '100%',
      data: vehicle
    }).afterClosed().subscribe(() => this.getList(this.pageIndex, this.pageSize)); // Atualiza a lista de veículos após fechar o modal
  }
}
