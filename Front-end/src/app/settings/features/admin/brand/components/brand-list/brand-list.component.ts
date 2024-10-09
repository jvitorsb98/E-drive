import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { catchError, of } from 'rxjs';

// Modelos
import { Brand } from '../../../../../core/models/brand';
import { PaginatedResponse } from '../../../../../core/models/paginatedResponse';

// Serviços
import { BrandService } from '../../../../../core/services/brand/brand.service';

// Componentes de modal
import { ModalFormBrandComponent } from '../modal-form-brand/modal-form-brand.component';
import { ModalDetailsBrandComponent } from '../modal-details-brand/modal-details-brand.component';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss']
})
export class BrandListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['icon', 'name', 'activated', 'actions']; // Colunas a serem exibidas na tabela
  dataSource = new MatTableDataSource<Brand>(); // Fonte de dados da tabela
  brandList: Brand[] = []; // Lista de marcas

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginação
  @ViewChild(MatSort) sort!: MatSort; // Ordenação

  constructor(
    private brandService: BrandService, // Serviço para interagir com a API de marcas
    private dialog: MatDialog // Serviço para abrir diálogos
  ) { }

  ngOnInit() {
    this.loadBrands(); // Carregar a lista de marcas ao inicializar o componente
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Configura o paginador
    this.dataSource.sort = this.sort; // Configura a ordenação
    this.paginator._intl.itemsPerPageLabel = 'Itens por página'; // Label para itens por página
  }

  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (response: PaginatedResponse<Brand>) => { // Recebe a resposta paginada
        this.brandList = response.content; // Extrai a lista de marcas

        if (Array.isArray(this.brandList)) {
          this.dataSource = new MatTableDataSource(this.brandList); // Atualiza a fonte de dados
          this.dataSource.paginator = this.paginator; // Atualiza o paginador
          this.dataSource.sort = this.sort; // Atualiza a ordenação
        } else {
          console.error('Esperava um array em response.content, mas recebeu:', this.brandList);
        }
      },
      error: (error) => {
        console.error('Erro ao obter marcas:', error);
      }
    });
  }

  disableBrand(brand: Brand) {
    Swal.fire({
      title: 'Desabilitar Marca',
      text: `Você tem certeza que deseja desabilitar a marca "${brand.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#19B6DD',
      cancelButtonColor: 'red',
      confirmButtonText: 'Sim, desabilitar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.brandService.delete(brand.id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Sucesso!',
              text: 'A marca foi desabilitada com sucesso!',
              icon: 'success',
              confirmButtonColor: '#19B6DD',
            }).then(() => this.loadBrands()); // Atualiza a lista após desabilitação
          },
          error: (error) => {
            Swal.fire({
              title: 'Erro!',
              text: 'Ocorreu um erro ao desabilitar a marca. Tente novamente mais tarde.',
              icon: 'error',
              confirmButtonColor: 'red',
            });
          }
        });
      }
    });
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Aplica o filtro na tabela

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Volta para a primeira página após filtro
    }
  }

  // Lógica do Modal
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
    }).afterClosed().subscribe(() => this.loadBrands()); // Atualiza a lista após fechamento do modal
  }

  openModalEditBrand(brandList: Brand) {
    console.log('Objeto Brand enviado ao modal:', brandList);
    this.dialog.open(ModalFormBrandComponent, {
      width: '500px',
      height: '210px',
      data: brandList
    }).afterClosed().subscribe(() => this.loadBrands()); // Atualiza a lista após fechamento do modal
  }


  // No arquivo: brand-list.component.ts
activateBrand(brand: Brand) {
  Swal.fire({
    title: 'Ativar Marca',
    text: `Você tem certeza que deseja ativar a marca "${brand.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#19B6DD',
    cancelButtonColor: 'red',
    confirmButtonText: 'Sim, ativar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.brandService.activated(brand.id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Sucesso!',
            text: 'A marca foi ativada com sucesso!',
            icon: 'success',
            confirmButtonColor: '#19B6DD',
          }).then(() => this.loadBrands()); // Atualiza a lista após ativação
        },
        error: (error) => {
          Swal.fire({
            title: 'Erro!',
            text: 'Ocorreu um erro ao ativar a marca. Tente novamente mais tarde.',
            icon: 'error',
            confirmButtonColor: 'red',
          });
        }
      });
    }
  });
}

  
}
