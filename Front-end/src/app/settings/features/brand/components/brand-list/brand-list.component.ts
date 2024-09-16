import { Component, ViewChild } from '@angular/core';
import { Brand } from '../../../../core/models/brand';
import { ModalFormBrandComponent } from '../modal-form-brand/modal-form-brand.component';
import { ModalDetailsBrandComponent } from '../modal-details-brand/modal-details-brand.component';
import Swal from 'sweetalert2';
import { catchError, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatedResponse } from '../../../../core/models/paginatedResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BrandService } from '../../../../core/services/brand/brand.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss'
})
export class BrandListComponent {
  displayedColumns: string[] = ['icon', 'name', 'actions'];
  dataSource = new MatTableDataSource<Brand>();
  brandList: Brand[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private brandService: BrandService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(this.brandList);
  }

  ngOnInit() {
    this.getListBrands();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
  }

  getListBrands() {
    this.brandService.getAllBrands().subscribe({
      next: (response: PaginatedResponse<Brand>) => { // Usa a interface tipada
        console.log('Response from getAllBrands:', response);

        // Extrai o array de marcas do campo 'content'
        this.brandList = response.content;
        console.log("brandList:", this.brandList);

        if (Array.isArray(this.brandList)) {
          this.dataSource = new MatTableDataSource(this.brandList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          console.error('Expected an array in response.content, but got:', this.brandList);
        }
      },
      error: (error) => {
        console.error('Error on getListBrands:', error);
      }
    });
  }

  deleteBrand(brandData: Brand) {
    console.log('Deletando veículo:', brandData);
    this.brandService.deleteBrand(brandData.id).pipe(
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
          this.getListBrands();
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
  openModalViewBrand(brand: Brand) {
    this.dialog.open(ModalDetailsBrandComponent, {
      width: '300px',
      height: '230px',
      data: brand
    });
  }

  openModalAddBrand() {
    this.dialog.open(ModalFormBrandComponent, {
      width: '500px',
      height: '210px',
    }).afterClosed().subscribe(() => this.getListBrands());
  }

  openModalEditBrand(brandList: Brand) {
    console.log('Objeto Brand enviado ao modal:', brandList);
    this.dialog.open(ModalFormBrandComponent, {
      width: '500px',
      height: '210px',
      data: brandList
    }).afterClosed().subscribe(() => this.getListBrands()); // Atualiza a lista de veículos após fechar o modal
  }
}
