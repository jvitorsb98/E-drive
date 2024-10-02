// Componente para exibir detalhes de endereços
import { ModalDetailsAddressComponent } from '../modal-details-address/modal-details-address.component';

// Componente para listar endereços e editar/adicionar endereços
import { MyAddressesComponent } from '../my-addresses/my-addresses.component';

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
          this.alertasService.showError('Erro ao carregar endereços', 'Ocorreu um erro ao carregar os endereços.');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertasService.showError('Erro ao carregar endereços', error.error.message || 'Ocorreu um erro ao carregar os endereços.');
      }
    });
  }

  // Navega para o formulário de adição de endereço
  addAddress() {
    this.addressService.selectAddress(null);
    this.addressService.setTitle('Registrar Endereço');
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
    this.alertasService.showWarning('Deletar endereço', 'Tem certeza que deseja deletar este endereço?', 'Sim', 'Não' ).then((result) => {
      if (result) {
        this.addressService.disable(address.id).pipe(
          catchError(() => {
            this.alertasService.showError('Erro ao deletar endereço', 'Ocorreu um erro ao deletar o endereço. Tente novamente mais tarde.');
            return of(null);
          })
        ).subscribe(() => {
          this.alertasService.showSuccess('Endereço deletado', 'O endereço foi deletado com sucesso.');
          this.loadAddresses();
        });
      }
    });
  }
  // Abre o modal para visualizar detalhes do endereço
  openModalDetailsAddress(address: DataAddressDetails) {
    this.dialog.open(ModalDetailsAddressComponent, {
      width: '600px',
      height: '400px',
      data: address
    });
  }

  // Abre o modal para adicionar um novo endereço
  openModalAddAddress() {
    this.dialog.open(MyAddressesComponent, {
      width: '700px',
      height: '515px',
      data: {
        actionTitle: 'Cadastrar Endereço'
      }
    }).afterClosed().subscribe(() => this.loadAddresses()); // Atualiza a lista de endereços após o fechamento do modal
  }

  // Abre o modal para editar um endereço existente
  openModalEditAddress(address: DataAddressDetails) {
    this.dialog.open(MyAddressesComponent, {
      width: '650px',
      height: '515px',
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
