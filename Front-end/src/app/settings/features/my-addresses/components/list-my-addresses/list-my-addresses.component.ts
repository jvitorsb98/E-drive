// Componente para exibir detalhes de endereços
import { ModalDetailsAddressComponent } from '../modal-details-address/modal-details-address.component';

// Componente para listar endereços e editar/adicionar endereços
import { MyAddressesComponent } from '../my-addresses/my-addresses.component';

// Angular Router para navegação
import { Router } from '@angular/router';

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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

// Imports de bibliotecas externas
import Swal from 'sweetalert2';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-list-my-addresses',
  templateUrl: './list-my-addresses.component.html',
  styleUrls: ['./list-my-addresses.component.scss'] // Corrigido para 'styleUrls'
})
export class ListMyAddressesComponent implements OnInit {
  // Colunas exibidas na tabela
  displayedColumns: string[] = ['icon', 'postalCode', 'city', 'state', 'actions'];
  dataSource = new MatTableDataSource<DataAddressDetails>(); // Fonte de dados para a tabela
  dataAddressDetails: DataAddressDetails[] = []; // Lista de endereços

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginação da tabela
  @ViewChild(MatSort) sort!: MatSort; // Ordenação da tabela

  constructor(
    private addressService: AddressService, // Serviço de endereços
    private dialog: MatDialog, // Diálogo para modais
    private snackBar: MatSnackBar, // Snackbar para mensagens
    private router: Router // Navegação
  ) {
    this.dataSource = new MatTableDataSource<DataAddressDetails>(this.dataAddressDetails); // Inicializa o datasource da tabela
  }

  ngOnInit() {
    this.loadAddresses(); // Carrega os endereços ao iniciar o componente
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Configura a paginação
    this.dataSource.sort = this.sort; // Configura a ordenação
    this.paginator._intl.itemsPerPageLabel = 'Itens por página'; // Customiza o rótulo de itens por página
  }

  // Carrega a lista de endereços do serviço
  loadAddresses() {
    this.addressService.getAll().subscribe({
      next: (response: PaginatedResponse<DataAddressDetails>) => {
        // Extrai o array de endereços do campo 'content'
        const addressList = response.content;

        if (Array.isArray(addressList)) {
          this.dataSource.data = addressList;
        } else {
          console.error('Expected an array in response.content, but got:', addressList);
        }
      },
      error: (error) => {
        console.error('Error on loadAddresses:', error);
        this.snackBar.open('Erro ao carregar endereços', 'Fechar', { duration: 5000 });
      }
    });
  }

  // Navega para o formulário de adição de endereço
  addAddress() {
    this.addressService.selectAddress(null);
    this.addressService.setTitle('Registrar Endereço');
    this.router.navigate(['/new-address']);
  }

  // Aplica filtro na tabela
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Deleta um endereço e atualiza a lista
  deleteAddress(address: DataAddressDetails) {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja realmente deletar o endereço? Esta ação não poderá ser desfeita.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#19B6DD',
      cancelButtonColor: '#ff6b6b',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.addressService.disable(address.id).pipe(
          catchError(() => {
            Swal.fire({
              title: 'Erro!',
              icon: 'error',
              text: 'Ocorreu um erro ao deletar o endereço. Tente novamente mais tarde.',
              showConfirmButton: true,
              confirmButtonColor: 'red'
            });
            return of(null);
          })
        ).subscribe(() => {
          Swal.fire({
            title: 'Sucesso!',
            icon: 'success',
            text: 'O endereço foi deletado com sucesso!',
            showConfirmButton: true,
            confirmButtonColor: '#19B6DD'
          }).then(() => {
            this.loadAddresses(); // Atualiza a lista de endereços após a exclusão
          });
        });
      }
    });
  }

  // Abre o modal para visualizar detalhes do endereço
  openModalDetailsAddress(address: DataAddressDetails) {
    this.dialog.open(ModalDetailsAddressComponent, {
      width: '80vw',
      height: '75vh',
      data: address
    });
  }

  // Abre o modal para adicionar um novo endereço
  openModalAddAddress() {
    this.dialog.open(MyAddressesComponent, {
      width: '80vw',
      height: '90vh',
      data: {
        actionTitle: 'Cadastrar Endereço'
      }
    }).afterClosed().subscribe(() => this.loadAddresses()); // Atualiza a lista de endereços após o fechamento do modal
  }

  // Abre o modal para editar um endereço existente
  openModalEditAddress(address: DataAddressDetails) {
    this.dialog.open(MyAddressesComponent, {
      width: '80vw',
      height: '90vh',
      data: {
        addressData: address,
        actionTitle: 'Editar Endereço'
      }
    }).afterClosed().subscribe(() => {
      this.loadAddresses(); // Atualiza a lista de endereços após o fechamento do modal
    });
  }

  // Abre o modal de FAQ
  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: [
          {
            question: 'O que é o CEP?',
            answer: 'O CEP (Código de Endereçamento Postal) é um código numérico utilizado pelos Correios para identificar os logradouros no Brasil. Ele é essencial para que suas correspondências e encomendas sejam entregues corretamente.',
          }
        ]
      }
    });
  }
}
