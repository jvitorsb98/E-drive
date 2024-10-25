import { AlertasService } from './../../../../../core/services/Alertas/alertas.service';
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

// Componentes de modal
import { ModalFormBrandComponent } from '../modal-form-brand/modal-form-brand.component';
import { ModalDetailsBrandComponent } from '../modal-details-brand/modal-details-brand.component';

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
  totalBrands: number = 0; // Total de veículos disponíveis
  pageIndex: number = 0; // Índice da página atual
  pageSize: number = 5; // Tamanho da página
  currentPage: number = 0; // Página atual
  displayedColumns: string[] = ['icon', 'name', 'activated', 'actions']; // Colunas a serem exibidas na tabela
  dataSource = new MatTableDataSource<Brand>(); // Fonte de dados da tabela
  brandList: Brand[] = []; // Lista de marcas

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginação
  @ViewChild(MatSort) sort!: MatSort; // Ordenação

  constructor(
    private brandService: BrandService, // Serviço para interagir com a API de marcas
    private dialog: MatDialog, // Serviço para abrir diálogos
    private alertasService: AlertasService // Serviço para exibir alertas
  ) { }

  /**
   * Método chamado quando o componente é inicializado.
   * Carrega a lista de marcas da API.
   */
  ngOnInit() {
    this.loadBrands(this.currentPage, this.pageSize); // Carregar a lista de marcas ao inicializar o componente
  }

  /**
   * Método chamado após a visualização do componente ser inicializada.
   * Configura o paginador e a ordenação da tabela.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Configura o paginador
    this.dataSource.sort = this.sort; // Configura a ordenação
    this.paginator._intl.itemsPerPageLabel = 'Itens por página'; // Label para itens por página
  }

  /**
   * Carrega a lista de marcas da API e atualiza a tabela.
   */
  loadBrands(pageIndex: number, pageSize: number) {
    this.brandService.getAll(pageIndex, pageSize).subscribe({
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

  /**
   * Trata a mudança de página na tabela e atualiza a lista de veículos.
   *
   * @param {any} event - Evento de mudança de página.
   */
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadBrands(this.currentPage, this.pageSize);
  }

  /**
   * Desabilita uma marca após confirmação do usuário.
   *
   * @param brand A marca a ser desabilitada.
   */
  disableBrand(brand: Brand) {
    this.alertasService.showWarning(
      'Desabilitar Marca',
      `Você tem certeza que deseja desabilitar a marca "${brand.name}"?`,
      'Sim, desabilitar!',
      'Cancelar'
    ).then((isConfirmed) => {
      if (isConfirmed) {
        this.brandService.delete(brand.id).subscribe({
          next: () => {
            this.alertasService.showSuccess('Sucesso!', 'A marca foi desabilitada com sucesso!').then(() => this.loadBrands(this.pageIndex, this.pageSize)); // Atualiza a lista após desabilitação
          },
          error: (error) => {
            this.alertasService.showError('Erro!', 'Ocorreu um erro ao desabilitar a marca. Tente novamente mais tarde.');
          }
        });
      }
    });
  }

  /**
   * Aplica um filtro na tabela de marcas.
   *
   * @param event O evento de entrada do usuário para busca.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Aplica o filtro na tabela

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Volta para a primeira página após filtro
    }
  }

  /**
   * Abre o modal de visualização de detalhes da marca.
   *
   * @param brand Dados da marca a ser visualizada.
   */
  openModalViewBrand(brand: Brand) {
    this.dialog.open(ModalDetailsBrandComponent, {
      width: '300px',
      height: '230px',
      data: brand
    });
  }

  /**
   * Abre o modal para adicionar uma nova marca.
   * Atualiza a lista de marcas após o fechamento do modal.
   */
  openModalAddBrand() {
    this.dialog.open(ModalFormBrandComponent, {
      width: '500px',
      height: '210px',
    }).afterClosed().subscribe(() => this.loadBrands(this.pageIndex, this.pageSize)); // Atualiza a lista após fechamento do modal
  }

  /**
   * Abre o modal para editar uma marca existente.
   * Atualiza a lista de marcas após o fechamento do modal.
   *
   * @param brandList Dados da marca a ser editada.
   */
  openModalEditBrand(brandList: Brand) {
    this.dialog.open(ModalFormBrandComponent, {
      width: '500px',
      height: '210px',
      data: brandList
    }).afterClosed().subscribe(() => this.loadBrands(this.pageIndex, this.pageSize)); // Atualiza a lista após fechamento do modal
  }

  /**
   * Ativa uma marca após confirmação do usuário.
   *
   * @param brand A marca a ser ativada.
   */
  activateBrand(brand: Brand) {
    this.alertasService.showWarning(
      'Ativar Marca',
      `Você tem certeza que deseja ativar a marca "${brand.name}"?`,
      'Sim, ativar!',
      'Cancelar'
    ).then((isConfirmed) => {
      if (isConfirmed) {
        this.brandService.activated(brand.id).subscribe({
          next: () => {
            this.alertasService.showSuccess('Sucesso!', 'A marca foi ativada com sucesso!').then(() => this.loadBrands(this.pageIndex, this.pageSize));
          },
          error: (error) => {
            this.alertasService.showError('Erro!', 'Ocorreu um erro ao ativar a marca. Tente novamente mais tarde.');
          }
        });
      }
    });
  }
}
