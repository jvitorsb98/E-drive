// Componente para exibir detalhes de endereços
import { ModalDetailsAddressComponent } from '../modal-details-address/modal-details-address.component';

// Componente para listar endereços e editar/adicionar endereços
import { ModalFormMyAddressesComponent } from '../modal-form-my-addresses/modal-form-my-addresses.component';

// Serviço para operações relacionadas a endereços
import { AddressService } from '../../../../core/services/Address/address.service';

// Modelo de dados para endereço
import { DataAddressDetails } from '../../../../core/models/inter-Address';

// Interface para resposta paginada
import { PaginatedResponse } from '../../../../core/models/paginatedResponse';

// Componente para o popup de FAQ
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component';

// Imports do Angular Material
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

// Imports de bibliotecas externas
import { catchError, of } from 'rxjs';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-my-addresses',
  templateUrl: './list-my-addresses.component.html',
  styleUrls: ['./list-my-addresses.component.scss'] // Corrigido para 'styleUrls'
})
export class ListMyAddressesComponent implements OnInit {
  // Colunas exibidas na tabela
  displayedColumns: string[] = ['icon', 'city', 'neighborhood', 'state', 'actions'];
  dataSource = new MatTableDataSource<DataAddressDetails>(); // Fonte de dados para a tabela
  dataAddressDetails: DataAddressDetails[] = []; // Lista de endereços

  // config de paginacao e ordenacao da tabela
  total: number = 0; // Total de enderecos disponíveis
  pageIndex: number = 0; // Índice da página atual
  pageSize: number = 5; // Tamanho da página
  currentPage: number = 0; // Página atual
  isFilterActive: boolean = false; // Indica se o filtro está ativo
  filteredData: DataAddressDetails[] = []; // Dados filtrados
  searchKey: any; // Chave de busca para filtro

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginação da tabela
  @ViewChild(MatSort) sort!: MatSort; // Ordenação da tabela

  constructor(
    private addressService: AddressService, // Serviço de endereços
    private dialog: MatDialog, // Diálogo para modais
    private alertasService: AlertasService
  ) {
    this.dataSource = new MatTableDataSource<DataAddressDetails>(this.dataAddressDetails); // Inicializa o datasource da tabela
  }

  ngOnInit() {
    this.loadAddresses(this.currentPage, this.pageSize); // Carrega os endereços ao iniciar o componente
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Configura a paginação
    this.dataSource.sort = this.sort; // Configura a ordenação
    this.paginator._intl.itemsPerPageLabel = 'Itens por página'; // Customiza o rótulo de itens por página
  }

  // Carrega a lista de endereços do serviço
  loadAddresses(pageIndex: number, pageSize: number) {
    if (this.isFilterActive) {
      this.dataSource.data = this.filteredData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.addressService.listAll(pageIndex, pageSize).subscribe({
        next: (response: PaginatedResponse<DataAddressDetails>) => {
          // Extrai o array de endereços do campo 'content'
           this.dataAddressDetails = response.content;

          if (Array.isArray(this.dataAddressDetails)) {
            this.dataSource = new MatTableDataSource(this.dataAddressDetails);
            this.dataSource.sort = this.sort;
            this.total = response.totalElements;
          } else {
            this.alertasService.showError('Erro ao carregar endereços', 'Ocorreu um erro ao carregar os endereços.');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.alertasService.showError('Erro ao carregar endereços', error.error.message || 'Ocorreu um erro ao carregar os endereços.');
        }
      });
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadAddresses(this.currentPage, this.pageSize);
  }

  // Navega para o formulário de adição de endereço
  addAddress() {
    this.addressService.selectAddress(null);
    this.addressService.setTitle('Registrar Endereço');
  }

  // Aplica filtro na tabela
  applyFilter(event: Event) {
    try {
      this.isFilterActive = true;
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.searchKey = event;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }

      this.addressService.listAll(0, this.total)
        .pipe(
          catchError((error) => {
            this.alertasService.showError("Erro !!", error.message);
            return of([]); // Retorna um array vazio em caso de erro
          })
        )
        .subscribe((response: PaginatedResponse<DataAddressDetails> | never[]) => {
          if (Array.isArray(response)) {
            // Verifica se o retorno é um array vazio
            if (response.length === 0) {
              this.dataSource.data = [];
              return;
            }
          } else {
            this.filteredData = response.content.filter(anddres =>
              anddres.city.toLowerCase().includes(filterValue) ||
              anddres.neighborhood.toLowerCase().includes(filterValue)
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
    } catch (error: any) {
      this.alertasService.showError("Erro !!", error.message);
    }
  }

  // Deleta um endereço e atualiza a lista
  deleteAddress(address: DataAddressDetails) {
    this.alertasService.showWarning('Deletar endereço', 'Tem certeza que deseja deletar este endereço?', 'Sim', 'Não').then((result) => {
      if (result) {
        this.addressService.disable(address.id).pipe(
          catchError(() => {
            this.alertasService.showError('Erro ao deletar endereço', 'Ocorreu um erro ao deletar o endereço. Tente novamente mais tarde.');
            return of(null);
          })
        ).subscribe(() => {
          this.alertasService.showSuccess('Endereço deletado', 'O endereço foi deletado com sucesso.');
          this.searchKey ? this.applyFilter(this.searchKey) : this.loadAddresses(this.pageIndex, this.pageSize);
        });
      }
    });
  }
  // Abre o modal para visualizar detalhes do endereço
  openModalDetailsAddress(address: DataAddressDetails) {
    this.dialog.open(ModalDetailsAddressComponent, {
      width: '600px',
      height: '440px',
      data: address
    });
  }

  // Abre o modal para adicionar um novo endereço
  openModalAddAddress() {
    this.dialog.open(ModalFormMyAddressesComponent, {
      width: '700px',
      height: '515px',
      data: {
        actionTitle: 'Cadastrar Endereço'
      }
    }).afterClosed().subscribe(() => this.loadAddresses(this.currentPage, this.pageSize)); // Atualiza a lista de endereços após o fechamento do modal
  }

  // Abre o modal para editar um endereço existente
  openModalEditAddress(address: DataAddressDetails) {
    this.dialog.open(ModalFormMyAddressesComponent, {
      width: '650px',
      height: '515px',
      data: {
        addressData: address,
        actionTitle: 'Editar Endereço'
      }
    }).afterClosed().subscribe(() => {
      this.searchKey ? this.applyFilter(this.searchKey):
      this.loadAddresses(this.currentPage, this.pageSize); // Atualiza a lista de endereços após o fechamento do modal
    });
  }
}
