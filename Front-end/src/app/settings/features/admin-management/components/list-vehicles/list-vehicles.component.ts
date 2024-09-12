import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Model } from '../../../../core/models/model';
import { PaginatedResponse } from '../../../../core/models/paginatedResponse';
import { ModalDetailsModelComponent } from '../../../model/components/modal-details-model/modal-details-model.component';
import { ModalFormModelComponent } from '../../../model/components/modal-form-model/modal-form-model.component';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { Vehicle } from '../../../../core/models/vehicle';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';

@Component({
  selector: 'app-list-vehicles',
  templateUrl: './list-vehicles.component.html',
  styleUrl: './list-vehicles.component.scss'
})
export class ListVehiclesComponent {
  totalVeicles: number = 0;
  pageIndex: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  displayedColumns: string[] = ['icon', 'motor','version', 'year', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();
  List: Vehicle[] = [];

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
    this.vehicleService.getAll(pageIndex, pageSize).subscribe({
      next: (response: PaginatedResponse<Vehicle>) => { // Usa a interface tipada
        console.log('Response from getAllModels:', response);

        // Extrai o array de marcas do campo 'content'
        this.List = response.content;
        console.log("List:", this.List);

        if (Array.isArray(this.List)) {
          this.dataSource = new MatTableDataSource(this.List);
          this.dataSource.sort = this.sort;
          this.totalVeicles = response.totalElements;
        } else {
          console.error('Expected an array in response.content, but got:', this.List);
        }
      },
      error: (error: any) => {
        console.error('Error on getListModels:', error);
      }
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getList(this.currentPage, this.pageSize);
  }

  deactivate(modelData: Model) {
    console.log('Deletando veículo:', modelData);
    this.vehicleService.deactivate().pipe(
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
          this.getList(this.pageIndex, this.pageSize);
        }
      });
    });
  }

  activate(modelData: Model) {
    console.log('Ativando veículo:', modelData);
    this.vehicleService.activate().pipe(
      catchError(() => {
        Swal.fire({
          title: 'Erro!',
          icon: 'error',
          text: 'Ocorreu um erro ao ativar o veículo. Tente novamente mais tarde.',
          showConfirmButton: true,
          confirmButtonColor: 'red',
        });
        return of(null); // Continua a sequência de observáveis com um valor nulo
      })
    ).subscribe(() => {  // Omiti o parâmetro `response` porque o backend esta retornando null
      Swal.fire({
        title: 'Sucesso!',
        icon: 'success',
        text: 'O veículo foi ativado com sucesso!',
        showConfirmButton: true,
        confirmButtonColor: '#19B6DD',
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          this.getList(this.pageIndex, this.pageSize);
        }
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
    console.log('Objeto Model enviado ao modal:', vehicle);
    this.dialog.open(VehicleFormComponent, {
      width: '100%',
      height: '100%',
      data: vehicle
    }).afterClosed().subscribe(() => this.getList(this.pageIndex, this.pageSize)); // Atualiza a lista de veículos após fechar o modal
  }
}
