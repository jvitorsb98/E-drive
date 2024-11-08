// Importa classes do Angular
import { Component, OnInit, ViewChild } from '@angular/core'; // Componente e ciclo de vida

// Importa classes para diálogos do Angular Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; // Diálogos

// Importa serviços do projeto
import { AddressService } from '../../../../core/services/Address/address.service'; // Serviço para manipulação de endereços
import { AlertasService } from '../../../../core/services/Alertas/alertas.service'; // Serviço para exibição de alertas

// Importa modelos para dados de endereços
import { DataAddressDetails, IAddressResponse } from '../../../../core/models/inter-Address'; // Modelos para dados de endereços
import { PaginatedResponse } from '../../../../core/models/paginatedResponse'; // Modelo para resposta paginada

// Importa componentes e fragmentos do projeto
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component'; // Componente para o popup de FAQ

// Importa componentes do Angular Material para tabelas e paginação
import { MatPaginator } from '@angular/material/paginator'; // Paginador para tabelas
import { MatSort } from '@angular/material/sort'; // Ordenação para tabelas
import { MatTableDataSource } from '@angular/material/table'; // Fonte de dados para tabelas

// Importa RxJS para manipulação de observables
import { catchError, of } from 'rxjs'; // Tratamento de erros e retorno de valor padrão
import { HttpErrorResponse } from '@angular/common/http'; // Tratamento de erros HTTP

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
  pageSize: number = 3; // Tamanho da página
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
  ) {
    this.addresses = new MatTableDataSource<DataAddressDetails>(this.filteredAddresses); // Inicializa a fonte de dados da tabela
  }

  /**
   * @description Método do ciclo de vida que é executado após a inicialização do componente.
   */
  ngOnInit(): void {
    this.pageSize = this.total;
    this.getAllAddresses(this.currentPage, this.pageSize);
  }

  /**
   * @description Método chamado após a visualização do componente ser inicializada.
   * Configura o paginador e a ordenação da tabela.
   *
   * @returns {void}
   */
  ngAfterViewInit() {
    this.addresses.paginator = this.paginator; // Configura o paginador
    this.addresses.sort = this.sort; // Configura a ordenação
    this.paginator._intl.itemsPerPageLabel = 'Itens por página'; // Label para itens por página
  }

  /**
 * @description Método para obter todos os endereços do serviço.
 * Caso o filtro esteja ativo, os endereços filtrados serão exibidos. 
 * Se o filtro não estiver ativo, todos os endereços serão carregados do serviço.
 * 
 * @param {boolean} isFilterActive - Indica se o filtro está ativo.
 * @param {any[]} filteredData - Dados filtrados a serem utilizados se o filtro estiver ativo.
 */
  getAllAddresses(pageIndex: number, pageSize: number) {
    if (this.isFilterActive) {
      // Se o filtro estiver ativo, usa os dados filtrados
      this.addresses.data = this.filteredData;
      this.addresses.paginator = this.paginator;
      this.addresses.sort = this.sort;
    } else {
      // Carrega todos os endereços do serviço
      this.addressService.listAll(pageIndex, pageSize).subscribe({
        next: (response) => {
          this.filteredAddresses = response.content;
          
          if (Array.isArray(this.filteredAddresses)) {
            // Se a resposta contiver um array de endereços, atualiza a fonte de dados da tabela
            this.addresses = new MatTableDataSource(this.filteredAddresses);
            this.addresses.sort = this.sort;
            this.total = response.totalElements; // Armazena o total de elementos
          } else {
            // Se a resposta não for um array, exibe um erro
            this.alertasService.showError('Erro ao carregar endereços', 'Ocorreu um erro ao carregar os endereços.');
          }
        },
        error: (error: HttpErrorResponse) => {
          // Tratamento de erro ao carregar endereços
          this.alertasService.showError('Erro ao carregar endereços', error.error.message || 'Ocorreu um erro ao carregar os endereços.');
        }
      });
    }
  }

  // getAllAddresses(pageIndex: number, pageSize: number) {
  //   if (this.isFilterActive) {
  //     // Se o filtro estiver ativo, usa os dados filtrados
  //     this.addresses.data = this.filteredData;
  //     this.addresses.paginator = this.paginator;
  //     this.addresses.sort = this.sort;
  //   } else {
  //     // Carrega todos os endereços do serviço
  //     this.addressService.getAll().subscribe({
  //       next: (response) => {
  //         this.filteredAddresses = response.content;

  //         if (Array.isArray(this.filteredAddresses)) {
  //           // Se a resposta contiver um array de endereços, atualiza a fonte de dados da tabela
  //           this.addresses = new MatTableDataSource(this.filteredAddresses);
  //           this.addresses.sort = this.sort;
  //           this.total = response.totalElements; // Armazena o total de elementos
  //         } else {
  //           // Se a resposta não for um array, exibe um erro
  //           this.alertasService.showError('Erro ao carregar endereços', 'Ocorreu um erro ao carregar os endereços.');
  //         }
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         // Tratamento de erro ao carregar endereços
  //         this.alertasService.showError('Erro ao carregar endereços', error.error.message || 'Ocorreu um erro ao carregar os endereços.');
  //       }
  //     });
  //   }
  // }
  //-------------------------------------------------------------

   /**
   * @description Trata a mudança de página na tabela e atualiza a lista de marcas.
   *
   * Este método é chamado quando a página da tabela é alterada. Ele atualiza o tamanho da página e 
   * o índice da página, e recarrega as marcas.
   *
   * @param {any} event - Evento de mudança de página.
   * @returns {void}
   */
   onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllAddresses(this.currentPage, this.pageSize);
  }

  /**
  * @description Aplica um filtro na tabela de endereços com base na entrada do usuário.
  * O método busca endereços do serviço e filtra os resultados de acordo com a cidade 
  * ou a rua digitada pelo usuário.
  * 
  * @param {Event} event - O evento de entrada que contém o valor a ser filtrado.
  */
  applyFilter(event: Event) {
    try {
      this.isFilterActive = true; // Define que o filtro está ativo
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); // Obtém o valor do filtro
      this.searchKey = event; // Armazena o evento de busca

      if (this.addresses.paginator) {
        this.addresses.paginator.firstPage(); // Retorna à primeira página da tabela
      }

      // Chama o serviço para listar todos os endereços
      this.addressService.listAll(0, this.total)
        .pipe(
          catchError((error) => {
            // Tratamento de erro caso ocorra durante a chamada do serviço
            this.alertasService.showError("Erro !!", error.message);
            return of([]); // Retorna um array vazio em caso de erro
          })
        )
        .subscribe((response: PaginatedResponse<DataAddressDetails> | never[]) => {
          if (Array.isArray(response)) {
            // Verifica se o retorno é um array vazio
            if (response.length === 0) {
              this.addresses.data = []; // Se o array estiver vazio, limpa os dados da tabela
              return;
            }
          } else {
            // Filtra os endereços com base no valor do filtro
            this.filteredData = response.content.filter(address =>
              address.city.toLowerCase().includes(filterValue) ||
              address.street.toLowerCase().includes(filterValue)
            );

            if (this.filteredData.length > 0) {
              this.addresses.data = this.filteredData; // Atualiza os dados da tabela com os endereços filtrados
              this.addresses.paginator = this.paginator; // Atualiza o paginador
              this.addresses.sort = this.sort; // Atualiza a ordenação
            } else {
              this.addresses.data = []; // Se não houver dados filtrados, limpa a tabela
            }
          }
        });
    } catch (error: any) {
      // Tratamento de erro caso ocorra em qualquer parte do método
      this.alertasService.showError("Erro !!", error.message);
    }
  }

  /**
  * @description Método para confirmar o endereço selecionado e fechar o diálogo.
  * Retorna o endereço selecionado ao componente pai.
  */
  confirmAddress(): void {
    if (this.selectedAddress) {
      this.dialogRef.close(this.selectedAddress); // Retorna o endereço selecionado
    }
  }

  /**
   * @description Método para cancelar a seleção e fechar o diálogo.
   * Fecha o diálogo sem retornar dados para o componente pai.
   */
  closeModal(): void {
    this.dialogRef.close(); // Fecha o diálogo sem retornar dados
  }

  /**
   * @description Método para selecionar um endereço da lista.
   * @param {IAddressResponse} address - O endereço a ser selecionado.
   * Define o endereço selecionado para ser confirmado posteriormente.
   */
  onSelect(address: IAddressResponse): void {
    this.selectedAddress = address; // Define o endereço selecionado
  }

  /**
   * @description Método para abrir o modal de FAQ.
   * Abre o componente de FAQ e pode passar dados relacionados às FAQs a serem exibidas.
   */
  openFAQModal() {
    this.dialog.open(FaqPopupComponent, { // Abre o componente de FAQ
      data: {
        faqs: [] // Aqui você pode passar as FAQs que deseja exibir
      },
    });
  }
}