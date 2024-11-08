// Angular Core
import { Component, Inject, ViewChild } from '@angular/core'; // Importações principais do Angular

// Angular Forms
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; // Ferramentas para construção de formulários e validação

// Angular Material
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; // Ferramentas para criar e manipular modais
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete'; // Componentes de autocompletar

// RxJS
import { map, Observable, of, startWith } from 'rxjs'; // Operadores RxJS para manipulação de observáveis

// Serviços
import { ModelService } from '../../../../../core/services/model/model.service'; // Serviço para operações com modelos
import { BrandService } from '../../../../../core/services/brand/brand.service'; // Serviço para operações com marcas
import { UserDataService } from '../../../../../core/services/user/userdata/user-data.service'; // Serviço para manipulação de dados do usuário
import { AlertasService } from '../../../../../core/services/Alertas/alertas.service'; // Serviço para exibir alertas no sistema

// Modelos
import { Model } from '../../../../../core/models/model'; // Modelo de dados de veículo
import { Brand } from '../../../../../core/models/brand'; // Modelo de dados de marca

// Componentes
import { FaqPopupComponent } from '../../../../../core/fragments/faq-popup/faq-popup.component'; // Componente de FAQ para informações úteis

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
  models: { name: string; id: number }[] = [];
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
    private userDataService: UserDataService,
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
    }
  }

  /**
   * @description Constrói o formulário reativo com os campos e validações necessárias.
   */
  buildForm() {
    this.modelForm = this.formBuilder.group({
      modelName: new FormControl(null, [Validators.required, Validators.minLength(3)]), // Campo nome desabilitado até que uma marca seja selecionada
      brand: new FormControl(null, [Validators.required]), // Campo marca obrigatório
    });
    this.disableBrand(); // Habilita o campo brand para cadastro e desabilita para edição
  }

  /**
   * @description Preenche o formulário com os dados do modelo quando estamos editando um modelo existente.
   */
  fillForm() {
    if (this.data.name) {
      this.modelForm.patchValue({
        modelName: this.data.name, // Preenche o nome do modelo
        brand: this.data.brand.name // Preenche a marca do modelo
      });
    }
  }

  /**
 * @description Carrega a lista de marcas disponíveis do serviço BrandService.
 *
 * Este método faz uma requisição para obter todas as marcas disponíveis, filtra apenas as marcas
 * que estão ativas e formata os dados para um formato que inclui o nome e o ID da marca.
 * Após carregar as marcas, configura o filtro para permitir a seleção no autocomplete.
 *
 * @returns {void}
 */
  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (brands: Brand[]) => {
        // Filtra e mapeia marcas ativas
        this.brands = brands
          .filter((brand: Brand) => brand.activated) // Filtra marcas ativas
          .map((brand: Brand) => ({ name: brand.name, id: brand.id })); // Mapeia os dados para o formato esperado
        this.setupAutocomplete(); // Configura o filtro de marcas para o autocomplete
      },
      error: (error) => {
        console.error('Erro ao carregar as marcas', error); // Loga o erro no console
      }
    });
  }

  /**
  * @description Carrega modelos (models) com base no ID da marca (brandId) fornecido.
  *
  * Este método faz uma requisição para o serviço de modelos, buscando todos os modelos associados
  * à marca especificada pelo ID. Ao receber a resposta, ele processa os dados, convertendo
  * cada modelo para um formato que inclui o nome capitalizado, o ID do modelo e o ID da marca.
  * Em seguida, reconfigura o autocomplete com os modelos carregados.
  *
  * @param {number} brandId - O ID da marca cujos modelos devem ser carregados.
  *
  * @returns {void} - Não retorna nenhum valor.
  */
  loadModels(brandId: number) {
    this.modelService.getModelsByBrandId(brandId).subscribe({
      next: (response: any) => {
        const models = response.content || [];
        if (Array.isArray(models)) {
          this.models = models.map(model => ({
            name: this.userDataService.capitalizeWords(model.name), // Capitaliza o nome do modelo
            id: model.id, // ID do modelo
            brandId: model.brand.id // ID da marca associada
          }));
          this.setupAutocomplete(); // Reconfigura o autocomplete com os dados carregados
        } else {
          console.error('Expected an array but got:', models); // Erro se não for um array
        }
      },
      error: (error) => {
        console.error('Erro ao carregar os modelos', error); // Log de erro ao carregar modelos
      }
    });
  }

  /**
 * @description Configura o autocomplete para a seleção de marcas.
 *
 * Este método inicializa o Observable `filteredBrands`, que escuta as alterações de valor do
 * controle de formulário correspondente à marca. Sempre que o valor é alterado, ele aplica um
 * filtro à lista de marcas, verificando se há marcas correspondentes e atualizando
 * a variável `noBrandFound` adequadamente.
 *
 * @returns {void} - Não retorna nenhum valor.
 */
  setupAutocomplete() {
    this.filteredBrands = this.modelForm.get('brand')!.valueChanges.pipe(
      startWith(''), // Inicia com um valor vazio para o filtro
      map(value => {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : ''; // Converte o valor para minúsculas
        const filtered = this.brands.filter(brand => brand.name.toLowerCase().includes(filterValue)); // Filtra as marcas
        this.noBrandFound = filtered.length === 0; // Verifica se há marcas filtradas
        return filtered; // Retorna a lista filtrada
      })
    );
  }

  /**
 * @description Método privado para filtrar um array de objetos com base em um valor de busca.
 *
 * Este método aplica um filtro a um array de objetos, retornando apenas os itens cujo campo
 * especificado (por padrão, o campo 'name') contém o valor de busca, ignorando diferenças de
 * maiúsculas e minúsculas. É utilizado para filtrar as opções disponíveis no autocomplete.
 *
 * @param {T[]} array - O array de objetos a ser filtrado.
 * @param {any} value - O valor de busca a ser aplicado como filtro.
 * @param {'version' | 'name'} field - O campo do objeto a ser filtrado (padrão é 'name').
 * @returns {T[]} - Um novo array contendo apenas os itens que correspondem ao filtro.
 */
  private _filter<T extends { version?: string, name?: string }>(
    array: T[],
    value: any,
    field: 'version' | 'name' = 'name'
  ): T[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : ''; // Converte o valor de busca para minúsculas
    return array.filter(item => item[field]?.toLowerCase().includes(filterValue)); // Filtra os itens do array
  }

  /**
 * @description Submete o formulário para criar ou atualizar um modelo de veículo.
 *
 * Este método verifica se o formulário é válido e, em seguida, determina se a operação é
 * uma atualização ou um cadastro. Com base nisso, ele coleta os dados do modelo, incluindo
 * o nome e o ID da marca selecionada, e faz uma requisição ao serviço correspondente.
 * Após a requisição, exibe uma mensagem de sucesso ou erro, conforme o resultado.
 *
 * @returns {void}
 */
  onSubmit() {
    if (this.modelForm.valid) {
      const actionSuccess = this.isEditing() ? 'atualizada' : 'cadastrada'; // Mensagem de sucesso
      const actionError = this.isEditing() ? 'atualizar' : 'cadastrar'; // Mensagem de erro

      const selectedBrandId = this.getSelectedBrandId(); // ID da marca selecionada

      // Coleta os dados do modelo a serem enviados
      const modelData = {
        ...this.data,
        name: this.modelForm.get('modelName')?.value, // Nome do modelo
        idBrand: selectedBrandId // ID da marca selecionada
      };

      // Faz a requisição para atualizar ou cadastrar o modelo
      const request$ = this.isEditing()
        ? this.modelService.update(modelData) // Atualiza o modelo existente
        : this.modelService.register(modelData); // Registra um novo modelo

      // Trata a resposta da requisição
      request$.subscribe({
        next: () => {
          this.alertasService.showSuccess('Sucesso!',
            `O modelo ${modelData.name} foi ${actionSuccess} com sucesso.`); // Mensagem de sucesso
          this.closeModal(); // Fecha o modal após a operação
        },
        error: (response) => {
          const errorMessage = response.error ||
            `Ocorreu um erro ao tentar ${actionError} o modelo.`; // Mensagem de erro
          this.alertasService.showError('Erro!', errorMessage); // Exibe alerta de erro
        }
      });
    } else {
      this.alertasService.showWarning('Atenção',
        'Por favor, preencha todos os campos obrigatórios.'); // Alerta se o formulário não é válido
    }
  }

  /**
   * @description Manipula a seleção de uma marca no autocomplete.
   *
   * O método atualiza o controle de formulário com a marca selecionada e, se a marca tiver um ID,
   * carrega os modelos associados. Também habilita ou desabilita o campo 'modelName' conforme
   * a seleção da marca.
   *
   * @param {MatAutocompleteSelectedEvent} event - Evento da marca selecionada.
   * @returns {void}
   */
  onBrandSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedBrand = event.option.value; // Marca selecionada
    this.modelForm.get('brand')?.setValue(selectedBrand.name); // Atualiza o valor da marca

    if (selectedBrand.id) {
      this.loadModels(selectedBrand.id); // Carrega modelos da marca selecionada
    }

    // Habilita ou desabilita o campo 'modelName'
    this.modelForm.get('modelName')?.[selectedBrand ? 'enable' : 'disable'](); // Usa o operador ternário para habilitar ou desabilitar
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
   * @description Alternar a visibilidade do autocomplete.
   * @param event Evento disparado pelo clique do botão.
   */
  toggleAutocomplete(event: Event) {
    event.stopPropagation();
    if (this.autocompleteTrigger.panelOpen) {
      this.autocompleteTrigger.closePanel();
    } else {
      this.autocompleteTrigger.openPanel();
    }
  }

  /**
  * @description Habilita ou desabilita os campos do formulário com base no modo de edição.
  */
  disableBrand() {
    if (this.isEditing()) {
      this.modelForm.get('modelName')?.enable(); // Habilita o campo modelName
      this.modelForm.get('brand')?.disable(); // Desabilita o campo brand
    } else {
      this.modelForm.get('brand')?.enable(); // Habilita o campo brand
      this.modelForm.get('modelName')?.disable(); // Desabilita o campo modelName
    }
  }

  /**
   * @description Verifica se o formulário está no modo de edição.
   * @returns Verdadeiro se estiver editando, falso caso contrário.
   */
  isEditing(): boolean {
    return this.editModel; // Retorna o estado de edição
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
      width: '500px',
      data: {
        faqs: [
          {
            question: 'Como cadastrar um novo modelo de veículo?',
            answer: 'Para cadastrar um novo modelo, clique no botão "Novo Modelo" localizado na parte inferior direita da tabela de modelos. Preencha o formulário com os dados necessários e clique em "Finalizar Cadastro" para concluir.'
          },
          {
            question: 'Como acessar e editar os detalhes de um modelo?',
            answer: 'Para visualizar ou editar os detalhes de um modelo existente, localize-o na lista e clique no ícone de edição (representado por um lápis). Isso abrirá um formulário onde você pode revisar e atualizar as informações do modelo conforme necessário.'
          },
          {
            question: 'O que fazer se uma marca de veículo não estiver listada?',
            answer: 'Caso a marca desejada não esteja disponível na lista, utilize o campo de busca para verificar se ela está registrada. Se a marca ainda não aparecer, entre em contato com o administrador para inclusão.'
          }
        ]
      }
    });
  }

}
