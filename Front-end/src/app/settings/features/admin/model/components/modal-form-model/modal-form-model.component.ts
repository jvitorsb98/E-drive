// Angular Core
import { Component, Inject, ViewChild } from '@angular/core'; // Importa Component, Inject e ViewChild do núcleo Angular para criar componentes, injetar dados e acessar elementos do DOM

// Angular Forms
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; // Importa ferramentas para construir e validar formulários

// Angular Material
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; // Importa ferramentas para criar e manipular diálogos modais
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete'; // Importa componentes para autocompletar entradas

// SweetAlert2
import Swal from 'sweetalert2'; // Biblioteca para exibir alertas bonitos e personalizáveis

// RxJS
import { catchError, map, Observable, of, startWith } from 'rxjs'; // Importa operadores e tipos para manipulação de observáveis

// Serviços
import { ModelService } from '../../../../../core/services/model/model.service'; // Serviço para operações relacionadas a modelos
import { BrandService } from '../../../../../core/services/brand/brand.service'; // Serviço para operações relacionadas a marcas

// Modelos
import { Model } from '../../../../../core/models/model'; // Modelo de dados para modelos

// Componentes
import { FaqPopupComponent } from '../../../../../core/fragments/faq-popup/faq-popup.component'; // Componente de FAQ para exibir informações úteis
import { AlertasService } from '../../../../../core/services/Alertas/alertas.service';

@Component({
  selector: 'app-modal-form-model',
  templateUrl: './modal-form-model.component.html',
  styleUrls: ['./modal-form-model.component.scss'] // Corrigido para styleUrls
})
export class ModalFormModelComponent {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger; // Referência ao gatilho do autocomplete
  modelForm!: FormGroup; // Formulário para criar/editar modelos
  editModel: boolean = false; // Indica se estamos editando um modelo
  noBrandFound: boolean = false; // Indica se nenhuma marca foi encontrada
  brands: { name: string; id: number }[] = []; // Lista de marcas disponíveis
  filteredBrands: Observable<{ name: string; id: number }[]> = of([]); // Observable para marcas filtradas

  constructor(
    private modelService: ModelService, // Serviço para modelos
    private brandService: BrandService, // Serviço para marcas
    private formBuilder: FormBuilder, // Construtor de formulários
    private dialog: MatDialog, // Serviço de diálogo
    public dialogRef: MatDialogRef<ModalFormModelComponent>,
    private alertasService: AlertasService, // Injeção do serviço de alertas
    // Referência ao diálogo
    @Inject(MAT_DIALOG_DATA) public data: Model // Dados recebidos para o modal
  ) { }

  ngOnInit(): void {
    this.editModel = !!this.data?.name; // Atribui true se data.name existir, indicando que estamos editando
    this.loadBrands(); // Carrega a lista de marcas
    this.buildForm(); // Constrói o formulário
    if (this.editModel) {
      this.fillForm(); // Preenche o formulário com dados existentes, se estiver editando
      this.modelForm.get('name')?.enable(); // Habilita o campo 'name' para edição
    }
  }

  // Constrói o formulário com validação
  buildForm() {
    this.modelForm = this.formBuilder.group({
      name: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.minLength(3)]),
      brand: new FormControl(null, [Validators.required]),
    });
    this.monitorBrandChanges(); // Monitora alterações no campo 'brand'
  }

  // Preenche o formulário com dados existentes
  fillForm() {
    if (this.data.name) {
      this.modelForm.patchValue({
        name: this.data.name,
        brand: this.data.brand.name
        // activated: this.data.activated
      });
      console.log("fillForm", this.modelForm.value);
    } else {
      console.warn('Dados estão incompletos:', this.data);
    }
  }

  // Carrega a lista de marcas disponíveis
  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (response: any) => {
        // Filtra as marcas ativadas
        this.brands = response.content
          .filter((brand: any) => brand.activated) // Verifica se activated é true
          .map((brand: any) => ({ name: brand.name, id: brand.id }));
        
        this.filterBrands(); // Inicializa o filtro após carregar as marcas
      },
      error: (error) => {
        console.error('Erro ao carregar as marcas', error);
      }
    });
  }
  

  // Submete o formulário para criar ou atualizar um modelo
  // Submete o formulário
onSubmit() {
  if (this.modelForm.valid) {
    console.log('Formulário válido:', this.modelForm.value);

    // Determina a ação com base na edição
    const actionSucess = this.isEditing() ? 'atualizada' : 'cadastrada';
    const actionsError = this.isEditing() ? 'atualizar' : 'cadastrar';
    
    // Obtém o ID da marca selecionada
    const selectedBrandId = this.getSelectedBrandId();

    // Cria o objeto de dados do modelo
    const modelData = {
      ...this.data,
      name: this.modelForm.get('name')?.value,
      idBrand: selectedBrandId
    };

    // Definindo a requisição com base na ação (cadastro ou atualização)
    const request$ = this.isEditing()
      ? this.modelService.update(modelData) // Atualiza o modelo
      : this.modelService.register(modelData); // Cadastra um novo modelo

    // Realiza a requisição e separa as ações para sucesso e erro
    request$.subscribe({
      next: () => {
        this.alertasService.showSuccess('Sucesso!', `O modelo ${this.modelForm.value.name} foi ${actionSucess} com sucesso.`);
        this.closeModal(); // Fecha o modal após a confirmação
      },
      error: (response) => {
        const errorMessage = response.error || `Ocorreu um erro ao tentar ${actionsError} o modelo.`;
        this.alertasService.showError('Erro!', errorMessage); // Ação de erro
      }
    });
  } else {
    console.warn('Formulário inválido:', this.modelForm);
    this.alertasService.showWarning('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
  }
}

  
  
  // Filtra a lista de marcas com base na entrada do usuário
  private filterBrands() {
    this.modelForm.get('brand')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
        const filtered = this.brands.filter(brand => brand.name.toLowerCase().includes(filterValue));

        this.noBrandFound = filtered.length === 0; // Atualiza a variável noBrandFound

        return filtered;
      })
    ).subscribe(filteredBrands => {
      this.filteredBrands = of(filteredBrands); // Atualiza o observable para o autocomplete
    });
  }

  // Manipula a seleção de uma marca no autocomplete
  onBrandSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedBrand = event.option.value;
    this.modelForm.get('brand')?.setValue(selectedBrand.name); // Atualiza o valor do input
    console.log('Marca selecionada:', selectedBrand);
  }

  // Obtém o ID da marca selecionada
  private getSelectedBrandId(): number | undefined {
    const selectedBrandName = this.modelForm.get('brand')?.value;
    const selectedBrand = this.brands.find(brand => brand.name === selectedBrandName);
    return selectedBrand?.id;
  }

  // Alterna a abertura do painel de autocomplete
  toggleAutocomplete(event: Event) {
    event.stopPropagation(); // Impede que o clique cause conflito com o foco do input
    if (this.autocompleteTrigger.panelOpen) {
      this.autocompleteTrigger.closePanel();
    } else {
      this.autocompleteTrigger.openPanel();
    }
  }

  // Monitora alterações no campo 'brand' para habilitar/desabilitar o campo 'name'
  monitorBrandChanges(): void {
    this.modelForm.get('brand')?.valueChanges.subscribe((brandValue) => {
      const selectedBrand = this.brands.find(brand => brand.name === brandValue);

      if (selectedBrand) {
        this.modelForm.get('name')?.enable(); // Habilita o campo 'name' se uma marca válida for selecionada
      } else {
        this.modelForm.get('name')?.disable(); // Desabilita o campo 'name' se não houver uma marca válida selecionada
      }
    });
  }

  // Verifica se estamos editando um modelo
  isEditing(): boolean {
    return !!this.data; // Retorna true se this.data estiver definido
  }

  // Fecha o modal
  closeModal() {
    this.dialogRef.close();
  }

  // Abre o modal de FAQ
  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: [
          {
            question: 'Como cadastrar um novo modelo?',
            answer: 'Para cadastrar um novo modelo, clique no botão "Novo modelo" localizado na parte inferior direita da tabela. Isso abrirá um formulário onde você poderá inserir os detalhes do novo modelo. Após preencher o formulário, clique em "Finalizar cadastro" para adicionar o novo modelo à lista.'
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
