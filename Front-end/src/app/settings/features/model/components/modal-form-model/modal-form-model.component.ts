import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModelService } from '../../../../core/services/model/model.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Model } from '../../../../core/models/model';
import Swal from 'sweetalert2';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { FaqPopupComponent } from '../../../../core/fragments/FAQ/faq-popup/faq-popup.component';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { BrandService } from '../../../../core/services/brand/brand.service';

@Component({
  selector: 'app-modal-form-model',
  templateUrl: './modal-form-model.component.html',
  styleUrl: './modal-form-model.component.scss'
})
export class ModalFormModelComponent {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  modelForm!: FormGroup;
  editModel: boolean = false;
  noBrandFound: boolean = false;
  brands: { name: string; id: number }[] = [];
  filteredBrands: Observable<{ name: string; id: number }[]> = of([]);

  constructor(
    private modelService: ModelService,
    private brandService: BrandService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalFormModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Model
  ) { }

  ngOnInit(): void {
    this.editModel = !!this.data?.name; // Atribui true se data.brand existir e false se não existir
    this.loadBrands();
    this.buildForm();
    if (this.editModel) {
      this.fillForm();
      this.modelForm.get('name')?.enable();
    }
  }

  buildForm() {
    this.modelForm = this.formBuilder.group({
      name: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.minLength(3)]),
      brand: new FormControl(null, [Validators.required]),
    });
    this.monitorBrandChanges();
  }

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

  loadBrands() {
    this.brandService.getAllBrands().subscribe({
      next: (response: any) => {
        this.brands = response.content.map((brand: any) => ({ name: brand.name, id: brand.id }));
        // Inicializa o filtro após carregar as marcas
        this._filterBrands();
      },
      error: (error) => {
        console.error('Erro ao carregar as marcas', error);
      }
    });
  }

  submitForm() {
    if (this.modelForm.valid) {
      console.log('Formulário válido:', this.modelForm.value);
      const action = this.isEditing() ? 'atualizada' : 'cadastrada'; // Usa o método isEditing para determinar a ação

      // Obtém o ID da marca selecionada
      const selectedBrandId = this.getSelectedBrandId();

      // Cria o objeto com os dados do modelo e o ID da marca
      const modelData = {
        ...this.data,
        name: this.modelForm.get('name')?.value,
        idBrand: selectedBrandId
      };

      const request$ = this.isEditing()
        ? this.modelService.updateModel(modelData)
        : this.modelService.registerModel(modelData);

      request$.pipe(
        catchError(() => {
          Swal.fire({
            title: 'Erro!',
            icon: 'error',
            text: `Ocorreu um erro ao ${action} o modelo. Tente novamente mais tarde.`,
            showConfirmButton: true,
            confirmButtonColor: 'red',
          });
          return of(null); // Continua a sequência de observáveis com um valor nulo
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
            this.closeModal(); // Envia os dados atualizados ao fechar o modal
          }
        });
      });
    } else {
      console.warn('Formulário inválido:', this.modelForm);
    }
  }

  private _filterBrands() {
    this.modelForm.get('brand')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
        const filtered = this.brands.filter(brand => brand.name.toLowerCase().includes(filterValue));

        // Atualiza a variável noBrandFound
        this.noBrandFound = filtered.length === 0;

        return filtered;
      })
    ).subscribe(filteredBrands => {
      this.filteredBrands = of(filteredBrands); // Atualiza o observable para o autocomplete
    });
  }

  onBrandSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedBrand = event.option.value;
    this.modelForm.get('brand')?.setValue(selectedBrand.name); // Atualiza o valor do input
    console.log('Marca selecionada:', selectedBrand);
  }

  private getSelectedBrandId(): number | undefined {
    const selectedBrandName = this.modelForm.get('brand')?.value;
    const selectedBrand = this.brands.find(brand => brand.name === selectedBrandName);
    return selectedBrand?.id;
  }

  toggleAutocomplete(event: Event) {
    event.stopPropagation(); // Impede que o clique cause conflito com o foco do input
    if (this.autocompleteTrigger.panelOpen) {
      this.autocompleteTrigger.closePanel();
    } else {
      this.autocompleteTrigger.openPanel();
    }
  }

  monitorBrandChanges(): void {
    this.modelForm.get('brand')?.valueChanges.subscribe((brandValue) => {
      const selectedBrand = this.brands.find(brand => brand.name === brandValue);

      if (selectedBrand) {
        // Habilita o campo 'name' quando uma marca válida for selecionada
        this.modelForm.get('name')?.enable();
      } else {
        // Desabilita o campo 'name' se não houver uma marca válida selecionada
        this.modelForm.get('name')?.disable();
      }
    });
  }

  isEditing(): boolean {
    return !!this.data; // Retorna true se this.data estiver definido, indicando que estamos editando
  }

  closeModal() {
    this.dialogRef.close();
  }

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
            answer: 'Para visualizar os detalhes de um modelo, clique no ícone de "olho" (visibility) ao lado do modelo que você deseja visualizar. Um modal será exibido mostrando todas as informações detalhadas sobre o modelo selecionado.'
          },
          {
            question: 'Como editar um modelo existente?',
            answer: 'Para editar um modelo, clique no ícone de "lápis" (edit) ao lado do modelo que você deseja modificar. Isso abrirá um modal com um formulário pré-preenchido com os dados do modelo. Faça as alterações necessárias e clique em "Salvar" para atualizar as informações.'
          },
          {
            question: 'Como excluir um modelo?',
            answer: 'Para excluir um modelo, clique no ícone de "lixeira" (delete) ao lado do modelo que você deseja remover. Você será solicitado a confirmar a exclusão. Após confirmar, o modelo será removido da lista.'
          },
          {
            question: 'Como buscar modelos específicos?',
            answer: 'Use o campo de busca localizado acima da tabela. Digite o nome do modelo que você deseja encontrar e a tabela será filtrada automaticamente para mostrar apenas os modelos que correspondem à sua pesquisa.'
          },
          {
            question: 'Como navegar entre as páginas da tabela?',
            answer: 'Use o paginador localizado na parte inferior da tabela para navegar entre as páginas de modelos. Você pode selecionar o número de itens por página e usar os botões de navegação para ir para a página anterior ou seguinte.'
          }
        ]
      }
    });
  }

}