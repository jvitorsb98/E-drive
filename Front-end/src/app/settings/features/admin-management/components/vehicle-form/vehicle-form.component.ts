import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, catchError, startWith, map } from 'rxjs';
import Swal from 'sweetalert2';
import { FaqPopupComponent } from '../../../../core/fragments/FAQ/faq-popup/faq-popup.component';
import { Model } from '../../../../core/models/model';
import { BrandService } from '../../../../core/services/brand/brand.service';
import { ModelService } from '../../../../core/services/model/model.service';
import { ModalFormModelComponent } from '../../../model/components/modal-form-model/modal-form-model.component';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { Vehicle } from '../../../../core/models/vehicle';
import { UserDataService } from '../../../../core/services/user/userdata/user-data.service';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.scss'
})
export class VehicleFormComponent {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  versionForm!: FormGroup;
  editVersion: boolean = false;
  noBrandFound: boolean = false;

  brands: { name: string; id: number }[] = [];
  models: { name: string; id: number }[] = [];

  filteredBrands: Observable<{ name: string; id: number }[]> = of([]);
  filteredModels: Observable<{ name: string; id: number }[]> = of([]);

  constructor(
    private vehicleService: VehicleService,
    private brandService: BrandService,
    private modelService: ModelService,
    private formBuilder: FormBuilder,
    private userDataService: UserDataService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalFormModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle
  ) { }

  ngOnInit(): void {
    this.editVersion = !!this.data?.version; // Atribui true se data.brand existir e false se não existir
    this.loadBrands();
    this.buildForm();
    if (this.editVersion) {
      this.fillForm();
      this.versionForm.get('')?.enable();
    }
  }

  buildForm() {
    this.versionForm = this.formBuilder.group({
      brand: new FormControl(null, [Validators.required]),
      model: new FormControl(null, [Validators.required]),

    });
    // this.monitorFormChanges('brand', 'model', (brandValue) => {
    //   return this.brands.some(brand => brand.name === brandValue);
    // });
  }

  fillForm() {
    if (this.data.version) {
      this.versionForm.patchValue({
        brand: this.data.model.brand.name,
        model: this.data.model.name,
        category: this.data.category,
        year: this.data.year,
        version: this.data.version,
        motor: this.data.motor,
        activated: this.data.activated
      });
      console.log("fillForm", this.versionForm.value);
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
      error: (error: any) => {
        console.error('Erro ao carregar as marcas', error);
      }
    });
  }

  loadModels(brandId: number) {
    this.modelService.getModelsByBrandId(brandId).subscribe({
      next: (response: any) => {
        const models = response.content || [];

        if (Array.isArray(models)) {
          this.models = models.map(model => ({
            name: this.userDataService.capitalizeWords(model.name),
            id: model.id,
            brandId: model.brand.id
          }));
        } else {
          console.error('Expected an array but got:', models);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar os modelos', error);
      }
    });
  }

  submitForm() {
    if (this.versionForm.valid) {
      console.log('Formulário válido:', this.versionForm.value);
      const action = this.isEditing() ? 'atualizada' : 'cadastrada'; // Usa o método isEditing para determinar a ação

      // Obtém o ID da marca selecionada
      const selectedBrandId = this.getSelectedItemId('brand', this.brands);
;

      // Cria o objeto com os dados do version e o ID da marca
      const versionData = {
        ...this.data,
        name: this.versionForm.get('name')?.value,
        idBrand: selectedBrandId
      };

      const request$ = this.isEditing()
        ? this.vehicleService.update(versionData.id,versionData)
        : this.vehicleService.register(versionData);

      request$.pipe(
        catchError(() => {
          Swal.fire({
            title: 'Erro!',
            icon: 'error',
            text: `Ocorreu um erro ao ${action} o version. Tente novamente mais tarde.`,
            showConfirmButton: true,
            confirmButtonColor: 'red',
          });
          return of(null); // Continua a sequência de observáveis com um valor nulo
        })
      ).subscribe(() => {
        Swal.fire({
          title: 'Sucesso!',
          icon: 'success',
          text: `O version ${this.versionForm.value.name} foi ${action} com sucesso.`,
          showConfirmButton: true,
          confirmButtonColor: '#19B6DD',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.closeModal(); // Envia os dados atualizados ao fechar o modal
          }
        });
      });
    } else {
      console.warn('Formulário inválido:', this.versionForm);
    }
  }

  private _filterBrands() {
    this.versionForm.get('brand')!.valueChanges.pipe(
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

  /* NOTE - Método para Atualizar o valor do campo no formulário ao selecionar um item no autocomplete
  - O primeiro parametro é o evento do autocomplete e o segundo é o nome do campo que será atualizado
  - Se o ID do item estiver disponível e a função de carregamento for passada, executa a função de carregamento
  - A função de carregamento recebe o ID do item selecionado
  - Modo de uso com id: this.onFieldSelected(event, 'fieldName', (id) => { this.loadFunction(id); });
  - exemplo: this.onFieldSelected(event, 'brand', loadModels.bind(this); });
  - Modo de uso sem id: this.onFieldSelected(event, 'fieldName');
  - exemplo: this.onFieldSelected(event, 'model');
  */
  onFieldSelected(event: MatAutocompleteSelectedEvent, fieldName: string, loadFunction?: (id: any) => void): void {
    const selectedItem = event.option.value;

    // Atualiza o valor do campo no formulário
    this.versionForm.get(fieldName)?.setValue(selectedItem.name);

    // Se o ID do item estiver disponível e a função de carregamento for passada, executa a função de carregamento
    if (selectedItem.id && loadFunction) {
      loadFunction(selectedItem.id);
    }
  }


  /**
 * Obtém o ID do item selecionado com base no nome do campo do formulário e na lista de itens fornecida.
 *
 * @param fieldName - O nome do campo do formulário cujo valor é usado para encontrar o item.
 *                    Por exemplo, 'brand' ou 'model'.
 * @param items - A lista de objetos na qual o item selecionado será procurado.
 *                Por exemplo, this.brands ou this.models.
 * @param itemKey - (Opcional) A chave do objeto utilizada para comparar o valor do campo.
 *                  O padrão é 'name'. Pode ser alterado se o valor do campo do formulário
 *                  corresponde a uma chave diferente no objeto.
 *
 * @returns O ID do item selecionado, ou `undefined` se o item não for encontrado ou não tiver um ID.
 *
 * @example
 * // Obtém o ID da marca selecionada
 * const brandId = this.getSelectedItemId('brand', this.brands);
 *
 * @example
 * // Obtém o ID do modelo selecionado
 * const modelId = this.getSelectedItemId('model', this.models);
 *
 * TODO: Certifique-se de que a lista de itens e o campo do formulário estejam sincronizados para garantir
 *        que o método retorne resultados corretos.
 *
 * NOTE: A chave `itemKey` deve corresponder ao nome da propriedade nos objetos da lista de itens.
 *        Se a propriedade não for 'name', passe o nome correto ao chamar o método.
 */
  private getSelectedItemId(fieldName: string, items: any[], itemKey: string = 'name'): number | undefined {
    const selectedItemName = this.versionForm.get(fieldName)?.value;
    const selectedItem = items.find(item => item[itemKey] === selectedItemName);
    return selectedItem?.id;
  }


  toggleAutocomplete(event: Event) {
    event.stopPropagation(); // Impede que o clique cause conflito com o foco do input
    if (this.autocompleteTrigger.panelOpen) {
      this.autocompleteTrigger.closePanel();
    } else {
      this.autocompleteTrigger.openPanel();
    }
  }

  /* NOTE - Método para monitorar mudanças em um campo dependente e habilitar/desabilitar o campo dependente correspondente de forma flexível
  - Modo de uso: this.monitorFormChanges('controlName', 'dependentControlName', (value) => { return condition; });
  - Exemplo: this.monitorFormChanges('brand', 'model', (brandValue) => { return this.brands.some(brand => brand.name === brandValue); } );
  */
  monitorFormChanges(controlName: string, dependentControlName: string, conditionFn: (value: any) => boolean): void {
    this.versionForm.get(controlName)?.valueChanges.subscribe((controlValue) => {
      if (conditionFn(controlValue)) {
        // Habilita o campo dependente quando a condição for verdadeira
        this.versionForm.get(dependentControlName)?.enable();
      } else {
        // Desabilita o campo dependente quando a condição for falsa
        this.versionForm.get(dependentControlName)?.disable();
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
            question: 'Como cadastrar um novo version?',
            answer: 'Para cadastrar um novo version, clique no botão "Novo version" localizado na parte inferior direita da tabela. Isso abrirá um formulário onde você poderá inserir os detalhes do novo version. Após preencher o formulário, clique em "Finalizar cadastro" para adicionar o novo version à lista.'
          },
          {
            question: 'Como visualizar os detalhes de um version?',
            answer: 'Para visualizar os detalhes de um version, clique no ícone de "olho" (visibility) ao lado do version que você deseja visualizar. Um modal será exibido mostrando todas as informações detalhadas sobre o version selecionado.'
          },
          {
            question: 'Como editar um version existente?',
            answer: 'Para editar um version, clique no ícone de "lápis" (edit) ao lado do version que você deseja modificar. Isso abrirá um modal com um formulário pré-preenchido com os dados do version. Faça as alterações necessárias e clique em "Salvar" para atualizar as informações.'
          },
          {
            question: 'Como excluir um version?',
            answer: 'Para excluir um version, clique no ícone de "lixeira" (delete) ao lado do version que você deseja remover. Você será solicitado a confirmar a exclusão. Após confirmar, o version será removido da lista.'
          },
          {
            question: 'Como buscar versions específicos?',
            answer: 'Use o campo de busca localizado acima da tabela. Digite o nome do version que você deseja encontrar e a tabela será filtrada automaticamente para mostrar apenas os versions que correspondem à sua pesquisa.'
          },
          {
            question: 'Como navegar entre as páginas da tabela?',
            answer: 'Use o paginador localizado na parte inferior da tabela para navegar entre as páginas de versions. Você pode selecionar o número de itens por página e usar os botões de navegação para ir para a página anterior ou seguinte.'
          }
        ]
      }
    });
  }


}
