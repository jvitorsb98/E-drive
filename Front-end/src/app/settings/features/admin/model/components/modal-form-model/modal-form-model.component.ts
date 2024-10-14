// Angular Core
import { Component, Inject, ViewChild } from '@angular/core'; // Importações principais do Angular

// Angular Forms
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; // Ferramentas para construção de formulários e validação

// Angular Material
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; // Ferramentas para criar e manipular modais
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete'; // Componentes de autocompletar

// SweetAlert2
import Swal from 'sweetalert2'; // Biblioteca para exibir alertas personalizados

// RxJS
import { catchError, map, Observable, of, startWith } from 'rxjs'; // Operadores RxJS para manipulação de observáveis

// Serviços
import { ModelService } from '../../../../../core/services/model/model.service'; // Serviço para operações com modelos
import { BrandService } from '../../../../../core/services/brand/brand.service'; // Serviço para operações com marcas

// Modelos
import { Model } from '../../../../../core/models/model'; // Modelo de dados de veículo

// Componentes
import { FaqPopupComponent } from '../../../../../core/fragments/faq-popup/faq-popup.component'; // Componente de FAQ para informações úteis
import { AlertasService } from '../../../../../core/services/Alertas/alertas.service'; // Serviço para exibir alertas no sistema

@Component({
  selector: 'app-modal-form-model',
  templateUrl: './modal-form-model.component.html',
  styleUrls: ['./modal-form-model.component.scss'] // Corrigido para styleUrls
})
export class ModalFormModelComponent {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger; // Referência ao componente autocomplete
  modelForm!: FormGroup; // Formulário reativo para modelo de veículo
  editModel: boolean = false; // Indica se o formulário está em modo de edição
  noBrandFound: boolean = false; // Indica se nenhuma marca foi encontrada
  brands: { name: string; id: number }[] = []; // Lista de marcas disponíveis para o formulário
  filteredBrands: Observable<{ name: string; id: number }[]> = of([]); // Observable com marcas filtradas

  /**
   * @description Construtor do componente ModalFormModel. Inicializa dependências e define injeções de dados.
   * @param modelService Serviço responsável por operações com modelos.
   * @param brandService Serviço responsável por buscar e gerenciar marcas.
   * @param formBuilder Construtor para criar formulários reativos.
   * @param dialog Serviço para abrir diálogos modais.
   * @param dialogRef Referência ao modal ativo.
   * @param data Dados injetados no modal via MAT_DIALOG_DATA.
   */
  constructor(
    private modelService: ModelService, // Serviço para interagir com modelos
    private brandService: BrandService, // Serviço para interagir com marcas
    private formBuilder: FormBuilder, // Ferramenta de construção de formulários
    private dialog: MatDialog, // Serviço de modais
    public dialogRef: MatDialogRef<ModalFormModelComponent>, // Referência ao modal atual
    private alertasService: AlertasService, // Serviço de alertas
    @Inject(MAT_DIALOG_DATA) public data: Model // Dados injetados no modal (modelo)
  ) { }

  /**
   * @description Método chamado ao inicializar o componente. Configura o formulário e carrega dados necessários.
   */
  ngOnInit(): void {
    this.editModel = !!this.data?.name; // Define se o modal está em modo de edição
    this.loadBrands(); // Carrega a lista de marcas
    this.buildForm(); // Constrói o formulário
    if (this.editModel) {
      this.fillForm(); // Preenche o formulário com os dados existentes
      this.modelForm.get('name')?.enable(); // Habilita o campo 'name'
    }
  }

  /**
   * @description Constrói o formulário reativo com os campos e validações necessárias.
   */
  buildForm() {
    this.modelForm = this.formBuilder.group({
      name: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.minLength(3)]), // Campo nome desabilitado até que uma marca seja selecionada
      brand: new FormControl(null, [Validators.required]), // Campo marca obrigatório
    });
    this.monitorBrandChanges(); // Monitora alterações no campo 'brand'
  }

  /**
   * @description Preenche o formulário com os dados do modelo quando estamos editando um modelo existente.
   */
  fillForm() {
    if (this.data.name) {
      this.modelForm.patchValue({
        name: this.data.name, // Preenche o nome do modelo
        brand: this.data.brand.name // Preenche a marca do modelo
      });
      console.log("fillForm", this.modelForm.value); // Loga os valores preenchidos
    } else {
      console.warn('Dados estão incompletos:', this.data); // Exibe aviso caso falte algum dado
    }
  }

  /**
   * @description Carrega a lista de marcas disponíveis do serviço BrandService.
   */
  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (response: any) => {
        this.brands = response.content
          .filter((brand: any) => brand.activated) // Filtra marcas ativas
          .map((brand: any) => ({ name: brand.name, id: brand.id })); // Mapeia os dados para o formato esperado
        
        this.filterBrands(); // Configura o filtro de marcas
      },
      error: (error) => {
        console.error('Erro ao carregar as marcas', error); // Exibe erro no console
      }
    });
  }

  /**
   * @description Submete o formulário para criar ou atualizar um modelo de veículo.
   */
  onSubmit() {
    if (this.modelForm.valid) {
      console.log('Formulário válido:', this.modelForm.value); // Loga o formulário válido

      const actionSucess = this.isEditing() ? 'atualizada' : 'cadastrada'; // Determina a mensagem de sucesso
      const actionsError = this.isEditing() ? 'atualizar' : 'cadastrar'; // Determina a mensagem de erro
      
      const selectedBrandId = this.getSelectedBrandId(); // Obtém o ID da marca selecionada

      const modelData = {
        ...this.data,
        name: this.modelForm.get('name')?.value, // Nome do modelo
        idBrand: selectedBrandId // ID da marca selecionada
      };

      const request$ = this.isEditing()
        ? this.modelService.update(modelData) // Atualiza o modelo existente
        : this.modelService.register(modelData); // Registra um novo modelo

      request$.subscribe({
        next: () => {
          this.alertasService.showSuccess('Sucesso!', `O modelo ${this.modelForm.value.name} foi ${actionSucess} com sucesso.`); // Exibe sucesso
          this.closeModal(); // Fecha o modal
        },
        error: (response) => {
          const errorMessage = response.error || `Ocorreu um erro ao tentar ${actionsError} o modelo.`; // Exibe mensagem de erro
          this.alertasService.showError('Erro!', errorMessage); // Mostra alerta de erro
        }
      });
    } else {
      console.warn('Formulário inválido:', this.modelForm); // Loga o formulário inválido
      this.alertasService.showWarning('Atenção', 'Por favor, preencha todos os campos obrigatórios.'); // Exibe alerta de atenção
    }
  }

  /**
   * @description Filtra a lista de marcas com base no valor digitado pelo usuário no autocomplete.
   */
  private filterBrands() {
    this.modelForm.get('brand')!.valueChanges.pipe(
      startWith(''), // Inicia o valor do filtro vazio
      map(value => {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : ''; // Converte o valor para minúsculas
        const filtered = this.brands.filter(brand => brand.name.toLowerCase().includes(filterValue)); // Filtra as marcas

        this.noBrandFound = filtered.length === 0; // Define se nenhuma marca foi encontrada

        return filtered; // Retorna a lista filtrada
      })
    ).subscribe(filteredBrands => {
      this.filteredBrands = of(filteredBrands); // Atualiza o observable de marcas filtradas
    });
  }

  /**
   * @description Manipula o evento de seleção de uma marca no autocomplete.
   * @param event Evento disparado quando uma marca é selecionada.
   */
  onBrandSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedBrand = event.option.value; // Marca selecionada
    this.modelForm.get('brand')?.setValue(selectedBrand.name); // Define o valor da marca no formulário
    console.log('Marca selecionada:', selectedBrand); // Loga a marca selecionada
  }

  /**
   * @description Obtém o ID da marca selecionada com base no nome.
   * @returns ID da marca selecionada ou undefined.
   */
  private getSelectedBrandId(): number | undefined {
    const selectedBrandName = this.modelForm.get('brand')?.value; // Nome da marca selecionada
    const selectedBrand = this.brands.find(brand => brand.name === selectedBrandName); // Busca a marca correspondente na lista
    return selectedBrand ? selectedBrand.id : undefined; // Retorna o ID da marca ou undefined
  }

  /**
   * @description Verifica se o formulário está no modo de edição.
   * @returns Verdadeiro se estiver editando, falso caso contrário.
   */
  isEditing(): boolean {
    return this.editModel; // Retorna o estado de edição
  }

  /**
   * @description Monitora as alterações no campo de marca e habilita/desabilita o campo de nome.
   */
  private monitorBrandChanges(): void {
    this.modelForm.get('brand')!.valueChanges.subscribe(brandValue => {
      const selectedBrand = this.brands.find(brand => brand.name === brandValue); // Busca a marca correspondente
      if (selectedBrand) {
        this.modelForm.get('name')?.enable(); // Habilita o campo 'name'
      } else {
        this.modelForm.get('name')?.disable(); // Desabilita o campo 'name'
      }
    });
  }

  /**
   * @description Fecha o modal de formulário.
   */
  closeModal(): void {
    this.dialogRef.close(); // Fecha o modal atual
  }
  /**
   * Abre o modal de FAQ.
   */
  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: [
          {
            question: 'Como cadastrar um novo modelo?',
            answer: 'Para cadastrar um novo modelo, clique no botão "Novo modelo" localizado na parte inferior direita da tabela.'
          },
          {
            question: 'Como visualizar os detalhes de um modelo?',

            answer: 'Para visualizar os detalhes de um modelo existente, localize o modelo desejado na tabela e clique no botão de edição (ícone de lápis) ao lado do modelo. Isso abrirá um formulário com os detalhes do modelo, onde você poderá visualizar e editar as informações conforme necessário.'
          }
        ]
      },
      width: '500px',
      height: '400px'
    });
  }
}
