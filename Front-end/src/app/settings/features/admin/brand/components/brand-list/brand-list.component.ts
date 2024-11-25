import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

// Modelos
import { Brand } from '../../../../../core/models/brand';
import { PaginatedResponse } from '../../../../../core/models/paginatedResponse';

// Serviços
import { BrandService } from '../../../../../core/services/brand/brand.service';
import { AlertasService } from './../../../../../core/services/Alertas/alertas.service';

// Componentes de modal
import { ModalFormBrandComponent } from '../modal-form-brand/modal-form-brand.component';
import { ModalDetailsBrandComponent } from '../modal-details-brand/modal-details-brand.component';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Componente para listar e gerenciar marcas.
 * Utiliza uma tabela com paginação e ordenação, permitindo operações como visualização, adição, edição e exclusão de marcas.
 *
 * **Passo a passo de chamada de métodos:**
 * 1. **ngOnInit**: Carrega as marcas da API quando o componente é inicializado.
 * 2. **ngAfterViewInit**: Configura o paginador e a ordenação após a visualização do componente ser renderizada.
 * 3. **loadBrands**: Obtém a lista de marcas da API e atualiza a tabela com os dados recebidos.
 * 4. **deleteBrand**: Realiza a exclusão de uma marca e, em caso de sucesso, exibe uma notificação e recarrega a lista.
 * 5. **applyFilter**: Aplica um filtro de pesquisa na tabela.
 * 6. **openModalViewBrand, openModalAddBrand, openModalEditBrand**: Gerenciam a abertura de modais para visualizar, adicionar e editar marcas.
 */
@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss']
})
export class BrandListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['icon', 'mark', 'actions']; // Colunas a serem exibidas na tabela
  dataSource = new MatTableDataSource<Brand>(); // Fonte de dados da tabela
  brands: Brand[] = []; // Lista de marcas
  selectedStatus: Boolean | 'all' = 'all';
  filterValueName: string = '';

  // config de paginacao e ordenacao da tabela
  totalBrands: number = 0; // Total de veículos disponíveis
  pageIndex: number = 0; // Índice da página atual
  pageSize: number = 10; // Tamanho da página
  currentPage: number = 0; // Página atual
  isFilterActive: boolean = false; // Indica se o filtro está ativo
  filteredData: Brand[] = []; // Dados filtrados
  searchKey: any; // Chave de busca para filtro

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginação
  @ViewChild(MatSort) sort!: MatSort; // Ordenação

  /**
 * @description Inicializa o serviço de marcas, o diálogo para modais e o serviço de alertas.
 *               Também inicializa o data source da tabela com as marcas.
 * @param {BrandService} brandService - Serviço responsável pela manipulação de marcas.
 * @param {MatDialog} dialog - Serviço utilizado para abrir diálogos modais.
 * @param {AlertasService} alertService - Serviço para exibição de alertas e notificações.
 */
  constructor(
    private brandService: BrandService, // Serviço para interagir com a API de marcas
    private dialog: MatDialog, // Serviço para abrir diálogos
    private alertService: AlertasService // Serviço para exibir alertas
  ) {
    this.dataSource = new MatTableDataSource(this.brands); // Inicializa a fonte de dados da tabela
  }

  /**
  * @description Método chamado quando o componente é inicializado.
  * Carrega a lista de marcas da API.
  *
  * @returns {void}
  */
  ngOnInit() {
    this.loadBrands(this.currentPage, this.pageSize); // Carregar a lista de marcas ao inicializar o componente
  }

  /**
   * @description Método chamado após a visualização do componente ser inicializada.
   * Configura o paginador e a ordenação da tabela.
   *
   * @returns {void}
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Configura o paginador
    this.dataSource.sort = this.sort; // Configura a ordenação
    this.paginator._intl.itemsPerPageLabel = 'Itens por página'; // Label para itens por página
  }

  /**
   * @description Carrega a lista de marcas da API e atualiza a tabela.
   *
   * Este método faz uma requisição para obter marcas paginadas e atualiza a tabela com as marcas recebidas.
   *
   * @param {number} pageIndex - O índice da página atual.
   * @param {number} pageSize - O número de itens por página.
   * @returns {void}
   */
  loadBrands(pageIndex: number, pageSize: number) {
    this.brandService.getAllPaginated(pageIndex, pageSize).subscribe({
      next: (response: PaginatedResponse<Brand>) => { // Recebe a resposta paginada
        this.brands = response.content; // Extrai a lista de marcas

        if (Array.isArray(this.brands)) {
          this.dataSource = new MatTableDataSource(this.brands); // Atualiza a fonte de dados
          this.dataSource.sort = this.sort; // Atualiza a ordenação
          this.totalBrands = response.totalElements; // Atualiza o total de marcas
          console.log(this.totalBrands)
        } else {
          console.error('Esperava um array em response.content, mas recebeu:', this.brands);
        }
      },
      error: (error) => {
        console.error('Erro ao obter marcas:', error);
      }
    });
  }

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
    this.loadBrands(this.currentPage, this.pageSize);
  }

  /**
   * @description Desabilita uma marca após confirmação do usuário.
   *
   * Este método exibe uma confirmação ao usuário e, se confirmado, desabilita a marca
   * chamando o serviço correspondente.
   *
   * @param {Brand} brand - A marca a ser desabilitada.
   * @returns {void}
   */
  disableBrand(brand: Brand) {
    this.alertService.showWarning(
      'Desabilitar Marca',
      `Você tem certeza que deseja desabilitar a marca "${brand.name}"?`,
      'Sim, desabilitar!',
      'Cancelar'
    ).then((isConfirmed) => {
      if (isConfirmed) {
        this.brandService.delete(brand.id).subscribe({
          next: () => {
            this.alertService.showSuccess('Sucesso!', 'A marca foi desabilitada com sucesso!')
              .then(() => this.loadBrands(this.pageIndex, this.pageSize)); // Atualiza a lista após desabilitação
          },
          error: (error) => {
            this.alertService.showError('Erro!', 'Ocorreu um erro ao desabilitar a marca. Tente novamente mais tarde.');
          }
        });
      }
    });
  }

  /**
   * @description Aplica um filtro na lista de veículos com base na entrada do usuário.
   *
   * Este método é chamado quando o usuário insere um valor de filtro. Ele atualiza a fonte de dados da tabela
   * para exibir apenas as marcas que correspondem ao filtro aplicado.
   *
   * @param {Event} event - O evento de entrada do usuário para busca.
   * @returns {void}
   */
  applyFilter(event: Event) {
    try {
      this.isFilterActive = true;
      this.filterValueName = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.searchKey = event;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage(); // Reseta a página para a primeira
      }
      console.log(this.selectedStatus)
      this.brandService.getAllPaginated(0, this.totalBrands, this.selectedStatus.toString())
        .pipe(
          catchError((error) => {
            this.handleError(new HttpErrorResponse({ error: error }));
            return of([]); // Retorna um array vazio em caso de erro
          })
        )
        .subscribe((response: PaginatedResponse<Brand> | never[]) => {
          if (Array.isArray(response)) {
            // Verifica se o retorno é um array vazio
            if (response.length === 0) {
              this.dataSource.data = [];
              return;
            }
          } else {
            // Aplica o filtro por nome da marca
            this.filteredData = response.content.filter(brand => {
              // Filtro pelo nome
              const nameMatches = brand.name.toLowerCase().includes(this.filterValueName);

              // Filtro pelo status, se não for "all"
              const statusMatches = this.selectedStatus === 'all' || brand.activated === this.selectedStatus;

              // Retorna verdadeiro se ambos os filtros forem verdadeiros
              return nameMatches && statusMatches;
            });


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

  /**
   * Trata erros de resposta HTTP e exibe um alerta ao usuário.
   *
   * @param {HttpErrorResponse} error - Objeto de erro da resposta HTTP.
   */
  handleError(error: HttpErrorResponse) {
    this.alertService.showError("Erro !!", error.message);
  }

  /**
   * Exibe um alerta de sucesso ao usuário.
   *
   * @param {string} text - Texto opcional a ser exibido na mensagem de sucesso.
   */
  handleSuccess(text: string = "Operação realizada com sucesso") {
    this.alertService.showSuccess("Sucesso !!", text);
  }

  /**
   * @description Abre o modal de visualização de detalhes da marca.
   *
   * Este método abre um modal para mostrar os detalhes da marca selecionada.
   *
   * @param {Brand} brand - Dados da marca a ser visualizada.
   * @returns {void}
   */
  openModalViewBrand(brand: Brand) {
    this.dialog.open(ModalDetailsBrandComponent, {
      width: '300px',
      height: '230px',
      data: brand
    });
  }

  /**
   * @description Abre o modal para adicionar uma nova marca.
   * Atualiza a lista de marcas após o fechamento do modal.
   *
   * @returns {void}
   */
  openModalAddBrand() {
    this.dialog.open(ModalFormBrandComponent, {
      width: '500px',
      height: '205px',
    }).afterClosed().subscribe(() => this.loadBrands(this.pageIndex, this.pageSize)); // Atualiza a lista após fechamento do modal
  }

  /**
   * @description Abre o modal para editar uma marca existente.
   * Atualiza a lista de marcas após o fechamento do modal.
   *
   * @param {Brand} brandList - Dados da marca a ser editada.
   * @returns {void}
   */
  openModalEditBrand(brandList: Brand) {
    this.dialog.open(ModalFormBrandComponent, {
      width: '500px',
      height: '205px',
      data: brandList
    }).afterClosed().subscribe(() => this.searchKey ? this.applyFilter(this.searchKey) :
      this.loadBrands(this.pageIndex, this.pageSize)); // Atualiza a lista após fechamento do modal
  }

  /**
   * @description Ativa uma marca após confirmação do usuário.
   *
   * Este método exibe uma confirmação ao usuário e, se confirmado, ativa a marca
   * chamando o serviço correspondente.
   *
   * @param {Brand} brand - A marca a ser ativada.
   * @returns {void}
   */
  activateBrand(brand: Brand) {
    this.alertService.showWarning(
      'Ativar Marca',
      `Você tem certeza que deseja ativar a marca "${brand.name}"?`,
      'Sim, ativar!',
      'Cancelar'
    ).then((isConfirmed) => {
      if (isConfirmed) {
        this.brandService.activated(brand.id).subscribe({
          next: () => {
            this.alertService.showSuccess('Sucesso!', 'A marca foi ativada com sucesso!')
              .then(() => this.searchKey ? this.applyFilter(this.searchKey) :
                this.loadBrands(this.pageIndex, this.pageSize));
          },
          error: (error) => {
            this.alertService.showError('Erro!', 'Ocorreu um erro ao ativar a marca. Tente novamente mais tarde.');
          }
        });
      }
    });
  }

  filterByStatus(status: boolean | 'all'): void {
    this.selectedStatus = status;
    console.log(this.selectedStatus)
    this.applyStatus();
  }


  applyStatus() {

    this.brandService.getAllPaginated(0, this.totalBrands, this.selectedStatus.toString())
      .pipe(
        catchError((error) => {
          this.handleError(new HttpErrorResponse({ error: error }));
          return of([]); // Retorna um array vazio em caso de erro
        })
      )
      .subscribe((response: PaginatedResponse<Brand> | never[]) => {
        if (Array.isArray(response)) {
          if (response.length === 0) {
            this.dataSource.data = [];
            return;
          }
        } else {
          // Aplica o filtro por nome da marca
          this.filteredData = response.content.filter(brand => {
            // Filtro pelo nome
            const nameMatches = brand.name.toLowerCase().includes(this.filterValueName);

            // Filtro pelo status, se não for "all"
            const statusMatches = this.selectedStatus === 'all' || brand.activated === this.selectedStatus;

            // Retorna verdadeiro se ambos os filtros forem verdadeiros
            return nameMatches && statusMatches;
          });


          console.log(this.filteredData)

          if (this.filteredData.length > 0) {
            this.dataSource.data = this.filteredData;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource.data = [];
          }
        }
      });

  }

}
