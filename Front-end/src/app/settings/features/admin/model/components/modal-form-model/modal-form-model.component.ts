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

  /**
   * Construtor do componente ModalFormModel.
   *
   * @param modelService Serviço para operações relacionadas a modelos.
   * @param brandService Serviço para operações relacionadas a marcas.
   * @param formBuilder Construtor de formulários.
   * @param dialog Serviço de diálogo.
   * @param dialogRef Referência ao diálogo.
   * @param data Dados do modelo recebidos no modal.
   */
  constructor(
    private modelService: ModelService,
    private brandService: BrandService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalFormModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Model
  ) { }

  /**
   * Método chamado quando o componente é inicializado.
   *
   * **Passo a passo de chamada de métodos:**
   * 1. **ngOnInit**: O modal é aberto com os dados do modelo recebidos via `MAT_DIALOG_DATA`.
   * 2. **loadBrands**: Carrega as marcas disponíveis.
   * 3. **buildForm**: Constrói o formulário do modelo.
   * 4. **fillForm**: Preenche o formulário com os dados do modelo (se em modo de edição).
   */
  ngOnInit(): void {
    this.editModel = !!this.data?.name;
    this.loadBrands();
    this.buildForm();
    if (this.editModel) {
      this.fillForm();
      this.modelForm.get('name')?.enable();
    }
  }

  /**
   * Constrói o formulário com validação.
   */
  buildForm() {
    this.modelForm = this.formBuilder.group({
      name: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.minLength(3)]),
      brand: new FormControl(null, [Validators.required]),
    });
    this.monitorBrandChanges();
  }

  /**
   * Preenche o formulário com os dados do modelo, se estiver editando.
   */
  fillForm() {
    if (this.data.name) {
      this.modelForm.patchValue({
        name: this.data.name,
        brand: this.data.brand.name
      });
      console.log("fillForm", this.modelForm.value);
    } else {
      console.warn('Dados estão incompletos:', this.data);
    }
  }

  /**
   * Carrega a lista de marcas disponíveis a partir do serviço.
   */
  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (response: any) => {
        this.brands = response.content.map((brand: any) => ({ name: brand.name, id: brand.id }));
        this.filterBrands();
      },
      error: (error) => {
        console.error('Erro ao carregar as marcas', error);
      }
    });
  }

  /**
   * Submete o formulário para criar ou atualizar um modelo.
   */
  onSubmit() {
    if (this.modelForm.valid) {
      const action = this.isEditing() ? 'atualizada' : 'cadastrada';

      const selectedBrandId = this.getSelectedBrandId();

      const modelData = {
        ...this.data,
        name: this.modelForm.get('name')?.value,
        idBrand: selectedBrandId
      };

      const request$ = this.isEditing()
        ? this.modelService.update(modelData)
        : this.modelService.register(modelData);

      request$.pipe(
        catchError(() => {
          Swal.fire({
            title: 'Erro!',
            icon: 'error',
            text: `Ocorreu um erro ao ${action} o modelo. Tente novamente mais tarde.`,
            showConfirmButton: true,
            confirmButtonColor: 'red',
          });
          return of(null);
        })
      ).subscribe(() => {
        Swal.fire({
          title: 'Sucesso!',
          icon: 'success',
          text: `O modelo ${this.modelForm.value.name} foi ${action} com sucesso.`,
          showConfirmButton: true,
          confirmButtonColor: '#19B6DD',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.closeModal();
          }
        });
      });
    } else {
      console.warn('Formulário inválido:', this.modelForm);
    }
  }

  /**
   * Filtra a lista de marcas com base na entrada do usuário.
   */
  private filterBrands() {
    this.modelForm.get('brand')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
        const filtered = this.brands.filter(brand => brand.name.toLowerCase().includes(filterValue));

        this.noBrandFound = filtered.length === 0;

        return filtered;
      })
    ).subscribe(filteredBrands => {
      this.filteredBrands = of(filteredBrands);
    });
  }

  /**
   * Manipula a seleção de uma marca no autocomplete.
   *
   * @param event O evento de seleção do autocomplete.
   */
  onBrandSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedBrand = event.option.value;
    this.modelForm.get('brand')?.setValue(selectedBrand.name);
    console.log('Marca selecionada:', selectedBrand);
  }

  /**
   * Obtém o ID da marca selecionada.
   *
   * @returns O ID da marca selecionada ou undefined.
   */
  private getSelectedBrandId(): number | undefined {
    const selectedBrandName = this.modelForm.get('brand')?.value;
    const selectedBrand = this.brands.find(brand => brand.name === selectedBrandName);
    return selectedBrand?.id;
  }

  /**
   * Alterna a abertura do painel de autocomplete.
   *
   * @param event O evento de clique.
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
   * Monitora alterações no campo 'brand' para habilitar/desabilitar o campo 'name'.
   */
  monitorBrandChanges(): void {
    this.modelForm.get('brand')?.valueChanges.subscribe((brandValue) => {
      const selectedBrand = this.brands.find(brand => brand.name === brandValue);

      if (selectedBrand) {
        this.modelForm.get('name')?.enable();
      } else {
        this.modelForm.get('name')?.disable();
      }
    });
  }

  /**
   * Verifica se estamos editando um modelo.
   *
   * @returns Retorna true se for edição.
   */
  isEditing(): boolean {
    return !!this.data;
  }

  /**
   * Fecha o modal.
   */
  closeModal() {
    this.dialogRef.close();
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
