import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Model } from '../../../../core/models/model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModelService } from '../../../../core/services/model/model.service';
import { MatDialog } from '@angular/material/dialog';
import { PaginatedResponse } from '../../../../core/models/paginatedResponse';
import Swal from 'sweetalert2';
import { catchError, of } from 'rxjs';
import { ModalDetailsModelComponent } from '../modal-details-model/modal-details-model.component';
import { ModalFormModelComponent } from '../modal-form-model/modal-form-model.component';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrl: './model-list.component.scss'
})
export class ModelListComponent {
  displayedColumns: string[] = ['icon', 'name', 'actions'];
  dataSource = new MatTableDataSource<Model>();
  modelList: Model[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private modelService: ModelService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(this.modelList);
  }

  ngOnInit() {
    this.getListModels();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
  }

  getListModels() {
    this.modelService.getAllModels().subscribe({
      next: (response: PaginatedResponse<Model>) => { // Usa a interface tipada
        console.log('Response from getAllModels:', response);

        // Extrai o array de marcas do campo 'content'
        this.modelList = response.content;
        console.log("modelList:", this.modelList);

        if (Array.isArray(this.modelList)) {
          this.dataSource = new MatTableDataSource(this.modelList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          console.error('Expected an array in response.content, but got:', this.modelList);
        }
      },
      error: (error) => {
        console.error('Error on getListModels:', error);
      }
    });
  }

  deleteModel(modelData: Model) {
    console.log('Deletando veículo:', modelData);
    this.modelService.deleteModel(modelData.id).pipe(
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
          this.getListModels();
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
  openModalViewModel(model: Model) {
    this.dialog.open(ModalDetailsModelComponent, {
      width: '300px',
      height: '230px',
      data: model
    });
  }

  openModalAddModel() {
    this.dialog.open(ModalFormModelComponent, {
      width: '500px',
      height: '210px',
    }).afterClosed().subscribe(() => this.getListModels());
  }

  openModalEditModel(modelList: Model) {
    console.log('Objeto Model enviado ao modal:', modelList);
    this.dialog.open(ModalFormModelComponent, {
      width: '500px',
      height: '210px',
      data: modelList
    }).afterClosed().subscribe(() => this.getListModels()); // Atualiza a lista de veículos após fechar o modal
  }

}