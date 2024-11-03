import { Component, OnInit, ViewChild } from '@angular/core'; // Importa as classes do Angular
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; // Importa classes para diálogos do Angular Material
import { AddressService } from '../../../../core/services/Address/address.service'; // Serviço para manipulação de endereços
import { DataAddressDetails, IAddressResponse } from '../../../../core/models/inter-Address'; // Modelos para dados de endereços
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component'; // Componente para o popup de FAQ
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatedResponse } from '../../../../core/models/paginatedResponse';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Componente para o modal de seleção de endereço.
 */
@Component({
  selector: 'app-modal-select-address', // Seletor do componente para uso em templates
  templateUrl: './modal-select-address.component.html', // Caminho para o template HTML
  styleUrls: ['./modal-select-address.component.scss'] // Caminho para os estilos do componente
})
export class ModalSelectAddressComponent implements OnInit { // Define a classe do componente implementando o ciclo de vida OnInit
  addresses = new MatTableDataSource<DataAddressDetails>(); // Fonte de dados para a tabela
  selectedAddress: IAddressResponse | null = null; // Endereço selecionado
  filteredAddresses: DataAddressDetails[] = []; // Lista para armazenar os endereços filtrados

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

  /**
   * Construtor do componente.
   * @param dialogRef - Referência ao diálogo para fechamento
   * @param dialog - Serviço para gerenciar diálogos
   * @param addressService - Serviço para manipulação de endereços
   */
  constructor(
    public dialogRef: MatDialogRef<ModalSelectAddressComponent>,
    private dialog: MatDialog,
    private addressService: AddressService,
    private alertasService: AlertasService
  ) { }

  /**
   * Método do ciclo de vida que é executado após a inicialização do componente.
   */
  ngOnInit(): void {
    this.getAllAddresses(this.currentPage, this.pageSize); // Obtém todos os endereços ao inicializar o componente
  }

  // Carrega a lista de endereços do serviço
  getAllAddresses(pageIndex: number, pageSize: number) {
    if (this.isFilterActive) {
      this.addresses.data = this.filteredData;
      this.addresses.paginator = this.paginator;
      this.addresses.sort = this.sort;
    } else {
      this.addressService.listAll(pageIndex, pageSize).subscribe({
        next: (response: PaginatedResponse<DataAddressDetails>) => {
          // Extrai o array de endereços do campo 'content'
          this.filteredAddresses = response.content;

          if (Array.isArray(this.filteredAddresses)) {
            this.addresses = new MatTableDataSource(this.filteredAddresses);
            this.addresses.sort = this.sort;
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

  // Aplica filtro na tabela
  applyFilter(event: Event) {
    try {
      this.isFilterActive = true;
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.searchKey = event;

      if (this.addresses.paginator) {
        this.addresses.paginator.firstPage();
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
              this.addresses.data = [];
              return;
            }
          } else {
            this.filteredData = response.content.filter(anddres =>
              anddres.city.toLowerCase().includes(filterValue) ||
              anddres.street.toLowerCase().includes(filterValue)
            );

            if (this.filteredData.length > 0) {
              this.addresses.data = this.filteredData;
              this.addresses.paginator = this.paginator;
              this.addresses.sort = this.sort;
            } else {
              this.addresses.data = [];
            }
          }
        });
    } catch (error: any) {
      this.alertasService.showError("Erro !!", error.message);
    }
  }

  /**
   * Método para confirmar o endereço selecionado e fechar o diálogo.
   */
  confirmAddress(): void {
    if (this.selectedAddress) {
      this.dialogRef.close(this.selectedAddress); // Retorna o endereço selecionado
    }
  }

  /**
   * Método para cancelar a seleção e fechar o diálogo.
   */
  closeModal(): void {
    this.dialogRef.close();// Fecha o diálogo sem retornar dados
  }

  /**
   * Método para selecionar um endereço da lista.
   * @param address - Endereço a ser selecionado
   */
  onSelect(address: IAddressResponse): void {
    this.selectedAddress = address; // Define o endereço selecionado
  }

  /**
   * Método para abrir o modal de FAQ.
   */
  openFAQModal() {
    this.dialog.open(FaqPopupComponent, { // Abre o componente de FAQ
      data: {
        faqs: [] // Aqui você pode passar as FAQs que deseja exibir
      },
    });
  }
}
