import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, of, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { FaqPopupComponent } from '../../../../../core/fragments/faq-popup/faq-popup.component';

import { IVehicleRequest, Vehicle } from '../../../../../core/models/vehicle';
import { Model } from '../../../../../core/models/model';
import { PaginatedResponse } from '../../../../../core/models/paginatedResponse';
import { VehicleType } from '../../../../../core/models/vehicle-type';
import { Category } from '../../../../../core/models/category';
import { Propulsion } from '../../../../../core/models/propulsion';
import { IAutonomyRequest } from '../../../../../core/models/autonomy';
import { HttpErrorResponse } from '@angular/common/http';
import { FormUtilsService } from '../../../../../shared/services/FormUtils/form-utils.service';
import { Brand } from '../../../../../core/models/brand';

import { CategoryService } from '../../../../../core/services/category/category.service';
import { ModelService } from '../../../../../core/services/model/model.service';
import { PropusionService } from '../../../../../core/services/propusion/propusion.service';
import { TypeVehicleService } from '../../../../../core/services/typeVehicle/type-vehicle.service';
import { VehicleService } from '../../../../../core/services/vehicle/vehicle.service';
import { BrandService } from '../../../../../core/services/brand/brand.service';
import { futureYearValidator } from '../../../../../shared/validators/future-year-validator'; import { genericTextValidator } from '../../../../../shared/validators/generic-text-validator';
import { UserDataService } from '../../../../../core/services/user/userdata/user-data.service';


/**
 * **Passo a passo de chamada de métodos:**
 *
 * 1. **loadBrands**: Carrega as marcas disponíveis para preenchimento no formulário.
 *    Este método é chamado durante a inicialização do componente.
 *
 * 2. **loadCategories**: Carrega as categorias disponíveis para preenchimento no formulário.
 *    Este método é chamado durante a inicialização do componente.
 *
 * 3. **loadTypes**: Carrega os tipos de veículos disponíveis para preenchimento no formulário.
 *    Este método é chamado durante a inicialização do componente.
 *
 * 4. **loadPropulsions**: Carrega as propulsões disponíveis para preenchimento no formulário.
 *    Este método é chamado durante a inicialização do componente.
 *
 * 5. **buildForm**: Constrói o formulário reativo para capturar os dados do veículo.
 *    Este método é chamado durante a inicialização do componente.
 *
 * 6. **onBrandChange**: Manipula a alteração da marca selecionada no formulário.
 *    Carrega os modelos relacionados à marca selecionada.
 *
 * 7. **isEditing**: Verifica se o formulário está em modo de edição.
 *    Retorna `true` se o veículo estiver sendo editado, caso contrário `false`.
 *
 * 8. **fillForm**: Preenche o formulário com os dados do veículo existente para edição.
 *    Este método é chamado quando o componente está no modo de edição.
 *
 * 9. **handleError**: Trata erros durante o carregamento de dados e exibe uma mensagem de erro usando SweetAlert2.
 *
 * 10. **closeModal**: Fecha o modal atual sem salvar alterações.
 *
 * 11. **resetForm**: Reseta os campos do formulário de veículo.
 *
 * 12. **openFAQModal**: Abre um modal de FAQ com informações sobre como utilizar o formulário de veículo.
 */
@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styleUrls: ['./modal-form-vehicle.component.scss']
})
export class ModalFormVehicleComponent {
  // Referência para o painel de autocomplete
  @ViewChild('brandInput', { read: MatAutocompleteTrigger }) autoBrandTrigger!: MatAutocompleteTrigger;
  @ViewChild('modelInput', { read: MatAutocompleteTrigger }) autoModelTrigger!: MatAutocompleteTrigger;
  @ViewChild('typeInput', { read: MatAutocompleteTrigger }) autoTypeTrigger!: MatAutocompleteTrigger;
  @ViewChild('categoryInput', { read: MatAutocompleteTrigger }) autoCategoryTrigger!: MatAutocompleteTrigger;
  @ViewChild('propulsionInput', { read: MatAutocompleteTrigger }) autoPropulsionTrigger!: MatAutocompleteTrigger;
  @ViewChild('versionInput', { read: MatAutocompleteTrigger }) autoVersionTrigger!: MatAutocompleteTrigger;

  vehicleForm!: FormGroup; // Formulário reativo
  editVehicle = false; // Indica se o formulário está em modo de edição
  isBrandValid = false; // Indica se nenhuma marca foi encontrada

  brands: { name: string; id: number }[] = []; // Lista de marcas
  categories: { name: string; id: number }[] = []; // Lista de categorias
  models: { name: string; id: number }[] = []; // Lista de modelos
  types: { name: string; id: number }[] = []; // Lista de tipos
  propulsions: { name: string; id: number }[] = []; // Lista de propulsões

  filteredBrands: Observable<{ name: string; id: number }[]> = of([]); // Lista filtrada de marcas
  filteredModels: Observable<{ name: string }[]> = of([]); // Lista filtrada de modelos
  filteredTypes: Observable<{ name: string; id: number }[]> = of([]); // Lista filtrada de tipos
  filteredVersions: Observable<Vehicle[]> = of([]); // Now filtering vehicles based on version name
  filteredCategories: Observable<{ name: string; id: number }[]> = of([]); // Lista filtrada de categorias
  filteredPropulsions: Observable<{ name: string; id: number }[]> = of([]); // Lista filtrada de propulsões

  vehicles: Vehicle[] = []; // Lista de veículos

  /**
  * Construtor do componente ModalFormVehicleComponent
  *
  * @param vehicleService - Serviço responsável por operações relacionadas a veículos
  * @param categoryService - Serviço responsável por operações relacionadas a categorias
  * @param brandService - Serviço responsável por operações relacionadas a marcas
  * @param modelService - Serviço responsável por operações relacionadas a modelos
  * @param propulsionService - Serviço responsável por operações relacionadas a propulsões
  * @param vehicleTypeService - Serviço responsável por operações relacionadas a tipos de veículos
  * @param formBuilder - Utilizado para criar formulários reativos
  * @param dialog - Serviço para abertura de diálogos modais
  * @param dialogRef - Referência ao diálogo aberto para manipulação de eventos
  * @param data - Dados injetados no diálogo, contendo informações do veículo
  */
  constructor(
    private vehicleService: VehicleService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private modelService: ModelService,
    private propulsionService: PropusionService,
    private vehicleTypeService: TypeVehicleService,
    private userDataService: UserDataService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalFormVehicleComponent>,
    public formUtils: FormUtilsService,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle
  ) { }

  /**
   * Método executado ao inicializar o componente. Define o formulário, carrega as listas
   * de marcas, categorias, tipos e propulsões, e preenche os dados do formulário se for uma edição.
   */
  ngOnInit(): void {
    this.editVehicle = !!this.data?.motor;
    this.loadBrands();
    this.loadCategories();
    this.loadTypes();
    this.buildForm();
    this.setupAutocomplete();
    this.loadPropulsions();
    if (this.editVehicle) {
      this.fillForm();
    }

    // this.vehicleForm.get('brand')?.valueChanges.subscribe(this.onBrandChange.bind(this));

    // Adiciona um listener ao campo 'brand' para atualizar a validade sempre que o usuário digitar
    // this.vehicleForm.get('brand')?.valueChanges.subscribe(() => {
    //   this.onBrandInputChange(); // Chama a função para verificar a validade da marca
    // });

    // Inicializa os observadores de campo
    if (!this.editVehicle) {
      this.initializeFieldObservers();
    }
  }

  /**
   * Constrói o formulário do veículo com suas validações.
   */
  private buildForm(): void {
    this.vehicleForm = this.formBuilder.group({
      brand: new FormControl(null, [Validators.required]),

      // Inicializa os campos desabilitados no modo de criação, habilitados no modo de edição
      model: new FormControl(this.editVehicle ? this.data.model : { value: null, disabled: !this.editVehicle }, [Validators.required]),
      type: new FormControl(this.editVehicle ? this.data.type : { value: null, disabled: !this.editVehicle }, [Validators.required]),
      category: new FormControl(this.editVehicle ? this.data.category : { value: null, disabled: !this.editVehicle }, [Validators.required]),
      propulsion: new FormControl(this.editVehicle ? this.data.propulsion : { value: null, disabled: !this.editVehicle }, [Validators.required]),

      motor: new FormControl(this.editVehicle ? this.data.motor : { value: null, disabled: !this.editVehicle }, [Validators.required, genericTextValidator(2, 20)]),
      version: new FormControl(this.editVehicle ? this.data.version : { value: null, disabled: !this.editVehicle }, [Validators.required, genericTextValidator(2, 20)]),
      year: new FormControl(this.editVehicle ? this.data.year : { value: null, disabled: !this.editVehicle }, [Validators.required, futureYearValidator]),

      mileagePerLiterRoad: new FormControl(!this.editVehicle ? { value: null, disabled: true } : null, [
        Validators.pattern(/^\d+(\.\d+)?$/),
        Validators.required
      ]),
      mileagePerLiterCity: new FormControl(!this.editVehicle ? { value: null, disabled: true } : null, [
        Validators.pattern(/^\d+(\.\d+)?$/),
        Validators.required
      ]),
      consumptionEnergetic: new FormControl(!this.editVehicle ? { value: null, disabled: true } : null, [
        Validators.pattern(/^\d+(\.\d+)?$/),
        Validators.required
      ]),
      autonomyElectricMode: new FormControl(!this.editVehicle ? { value: null, disabled: true } : null, [
        Validators.pattern(/^\d+(\.\d+)?$/),
        Validators.required
      ]),

      activated: new FormControl(true, [Validators.required]),
    });
  }

  /**
   * Preenche o formulário com os dados do veículo quando estiver em modo de edição.
   */
  fillForm() {
    if (this.data.motor) {
      this.loadModels(this.data.model.brand.id);
      this.vehicleForm.patchValue({
        motor: this.data.motor,
        version: this.data.version,
        brand: this.data.model.brand.name,
        model: this.data.model.name,
        category: this.data.category.name,
        type: this.data.type.name,
        propulsion: this.data.propulsion.name,
        mileagePerLiterCity: this.data.autonomy.mileagePerLiterCity,
        mileagePerLiterRoad: this.data.autonomy.mileagePerLiterRoad,
        consumptionEnergetic: this.data.autonomy.consumptionEnergetic,
        autonomyElectricMode: this.data.autonomy.autonomyElectricMode,
        year: this.data.year,
        activated: this.data.activated,
      });
    }
  }

  initializeFieldObservers(): void {
    this.formUtils.observeFieldChanges(this.vehicleForm, 'motor', 'version');
    this.formUtils.observeFieldChanges(this.vehicleForm, 'version', 'year');
    this.formUtils.observeFieldChanges(this.vehicleForm, 'year', 'mileagePerLiterRoad');
    this.formUtils.observeFieldChanges(this.vehicleForm, 'mileagePerLiterRoad', 'mileagePerLiterCity');
    this.formUtils.observeFieldChanges(this.vehicleForm, 'mileagePerLiterCity', 'consumptionEnergetic');
    this.formUtils.observeFieldChanges(this.vehicleForm, 'consumptionEnergetic', 'autonomyElectricMode');
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
   * Carrega a lista de modelos disponíveis de uma marca selecionada.
   * @param idBrand - Identificador da marca selecionada
   */
  loadModels(idBrand: number) {
    this.modelService.getModelsByBrandId(idBrand).subscribe({
      next: (response: any) => {
        this.models = response.content.map((model: Model) => ({ name: model.name, id: model.id }));
        this.setupAutocomplete();
      },
      error: (error) => this.handleError('models', error),
    });
  }

  /**
   * Carrega a lista de categorias disponíveis chamando o serviço correspondente.
   */
  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (response: PaginatedResponse<VehicleType>) => {
        this.categories = response.content.map((category: Category) => ({ name: category.name, id: category.id }));
        this.setupAutocomplete();
      },
      error: (error) => this.handleError('categories', error),
    });
  }

  /**
   * Carrega a lista de tipos de veículos disponíveis chamando o serviço correspondente.
   */
  private loadTypes(): void {
    this.vehicleTypeService.getAll().subscribe({
      next: (response: PaginatedResponse<VehicleType>) => {
        this.types = response.content.map((type: VehicleType) => ({ name: type.name, id: type.id }));
        this.setupAutocomplete(); // Reconfigure the autocomplete with the loaded data
      },
      error: (error) => this.handleError('types', error),
    });
  }

  /**
   * Carrega a lista de propulsões disponíveis chamando o serviço correspondente.
   */
  private loadPropulsions(): void {
    this.propulsionService.getAll().subscribe({
      next: (response: PaginatedResponse<Propulsion>) => {
        this.propulsions = response.content.map((propulsion: Propulsion) => ({ name: propulsion.name, id: propulsion.id }));
        this.setupAutocomplete(); // Reconfigure the autocomplete with the loaded data
      },
      error: (error) => this.handleError('propulsions', error),
    });
  }

  loadVehiclesByModel(modelId: number) {
    this.vehicleService.getVehiclesByModel(modelId).subscribe({
      next: (response: any) => {
        const vehicles = response.content || [];

        if (Array.isArray(vehicles)) {
          this.vehicles = vehicles.map(vehicle => ({
            ...vehicle,
            version: this.userDataService.capitalizeWords(vehicle.version),
          }));

          this.setupAutocomplete(); // Reconfigure autocomplete with the filtered vehicle list
        } else {
          console.error('Expected an array but got:', vehicles);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar os veículos', error);
      }
    });
  }

  setupAutocomplete() {
    this.filteredBrands = this.vehicleForm.get('brand')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value?.name || '');
        return this._filter(this.brands, filterValue);
      })
    );

    this.filteredModels = this.vehicleForm.get('model')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value?.name || '');
        return this._filter(this.models, filterValue);
      })
    );

    this.filteredTypes = this.vehicleForm.get('type')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value?.name || '');
        return this._filter(this.types, filterValue);
      })
    );

    this.filteredCategories = this.vehicleForm.get('category')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value?.name || '');
        return this._filter(this.categories, filterValue);
      })
    );

    this.filteredPropulsions = this.vehicleForm.get('propulsion')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value?.name || '');
        return this._filter(this.propulsions, filterValue);
      })
    );

    this.filteredVersions = this.vehicleForm.get('version')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value || '');
        return this._filter(this.vehicles, filterValue, 'version');
      })
    );
  }

  private _filter<T extends { version?: string, name?: string }>(array: T[], value: any, field: 'version' | 'name' = 'name'): T[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return array.filter(item => item[field]?.toLowerCase().includes(filterValue));
  }

  /**
 * Envia o formulário após validação.
 *
 * Se o formulário for inválido, um aviso será registrado e a operação será encerrada.
 * Caso contrário, a requisição para cadastrar ou atualizar o veículo será construída e enviada.
 */
  submitForm(): void {
    if (this.vehicleForm.invalid) {
      console.warn('Invalid form:', this.vehicleForm);
      return;
    }
    const vehicleData = this.buildVehicleRequest();
    const actionSucess = this.isEditing() ? 'atualizada' : 'cadastrada';
    const actionsError = this.isEditing() ? 'atualizar' : 'cadastrar';

    const request$ = this.isEditing()
      ? this.vehicleService.update(this.data.id, vehicleData)
      : this.vehicleService.register(vehicleData);


    request$.subscribe({
      next: (response) => {
        console.log('Response received:', response); // Aqui você pega o response no caso de sucesso
        this.showSuccessMessage(actionSucess);
      },
      error: (response) => {
        this.showErrorMessage(response.error, actionsError);
      }
    });
  }

  private buildVehicleRequest(): IVehicleRequest {
    const autonomyData: IAutonomyRequest = {
      mileagePerLiterCity: this.vehicleForm.get('mileagePerLiterCity')?.value,
      mileagePerLiterRoad: this.vehicleForm.get('mileagePerLiterRoad')?.value,
      consumptionEnergetic: this.vehicleForm.get('consumptionEnergetic')?.value,
      autonomyElectricMode: this.vehicleForm.get('autonomyElectricMode')?.value,
    };

    return {
      motor: this.vehicleForm.get('motor')?.value,
      version: this.vehicleForm.get('version')?.value,
      modelId: this.getSelectedModelId()!,
      categoryId: this.getSelectedCategoryId()!,
      typeId: this.getSelectedTypeId()!,
      propulsionId: this.getSelectedPropulsionId()!,
      dataRegisterAutonomy: autonomyData,
      year: this.vehicleForm.get('year')?.value,
    };
  }

  /**
 * Obtém o ID do modelo selecionado.
 *
 * @returns {number | undefined} ID do modelo ou undefined se não encontrado
 */
  private getSelectedModelId(): number | undefined {
    return this.models.find(model => model.name === this.vehicleForm.get('model')?.value)?.id;
  }

  /**
 * Obtém o ID da categoria selecionada.
 *
 * @returns {number | undefined} ID da categoria ou undefined se não encontrado
 */
  private getSelectedCategoryId(): number | undefined {
    return this.categories.find(category => category.name === this.vehicleForm.get('category')?.value)?.id;
  }

  /**
 * Obtém o ID do tipo de veículo selecionado.
 *
 * @returns {number | undefined} ID do tipo de veículo ou undefined se não encontrado
 */
  private getSelectedTypeId(): number | undefined {
    return this.types.find(type => type.name === this.vehicleForm.get('type')?.value)?.id;
  }

  /**
 * Obtém o ID da propulsão selecionada.
 *
 * @returns {number | undefined} ID da propulsão ou undefined se não encontrado
 */
  private getSelectedPropulsionId(): number | undefined {
    return this.propulsions.find(propulsion => propulsion.name === this.vehicleForm.get('propulsion')?.value)?.id;
  }

  /**
  * Manipula a seleção de uma marca no campo de autocomplete.
  * @param event - Evento de seleção de marca
  */
  onBrandSelected(event: MatAutocompleteSelectedEvent): void {
    // Obtém a marca selecionada do evento de autocomplete
    const selectedBrand = event.option.value;

    // Verifica se uma marca válida foi selecionada
    if (selectedBrand && selectedBrand.id) {
      // Usa o método genérico para atualizar o campo 'brand'
      this.formUtils.updateFormField(
        this.vehicleForm,
        'brand', // Nome do campo no formulário
        selectedBrand, // Valor selecionado
        (id: number) => this.loadModels(id), // Função para carregar modelos
        'model' // Próximo campo a ser habilitado
      );
    } else {
      // Caso nenhuma marca válida seja selecionada, trata a situação
      this.formUtils.resetAndDisableFields(this.vehicleForm, ['model', 'type', 'category', 'propulsion']);
    }
  }

  onModelSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedModel = event.option.value;

    if (selectedModel && selectedModel.id) {
      this.formUtils.updateFormField(
        this.vehicleForm,
        'model',
        selectedModel,
        null, // Nenhuma função de carregamento necessária para o modelo
        'type' // O próximo campo a ser habilitado
      );
    } else {
      // Se o modelo não for selecionado, desabilita os campos 'type', 'category' e 'propulsion'
      this.formUtils.resetAndDisableFields(this.vehicleForm, ['type', 'category', 'propulsion']);
    }
  }

  onTypeSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedType = event.option.value;

    // Verifica se um tipo válido foi selecionado
    if (selectedType) {
      this.formUtils.updateFormField(
        this.vehicleForm,
        'type', // Nome do campo no formulário
        selectedType, // Valor selecionado
        (id: number) => this.loadVehiclesByModel(id), // Função para carregar veículos, se necessário
        'category' // O próximo campo a ser habilitado
      );
    } else {
      // Se o tipo não for selecionado, desabilita o campo category
      this.formUtils.resetAndDisableFields(this.vehicleForm, ['category']);
    }
  }

  onCategorySelected(event: MatAutocompleteSelectedEvent): void {
    const selectedCategory = event.option.value;

    // Verifica se uma categoria válida foi selecionada
    if (selectedCategory) {
      this.formUtils.updateFormField(
        this.vehicleForm,
        'category', // Nome do campo no formulário
        selectedCategory, // Valor selecionado
        (id: number) => this.loadVehiclesByModel(id), // Função para carregar veículos, se necessário
        'propulsion' // O próximo campo a ser habilitado
      );
    } else {
      // Se a categoria não for selecionada, desabilita o campo propulsion
      this.formUtils.resetAndDisableFields(this.vehicleForm, ['propulsion']);
    }
  }

  onPropulsionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedPropulsion = event.option.value;

    // Verifica se a propulsão foi selecionada corretamente
    if (selectedPropulsion) {
      this.formUtils.updateFormField(
        this.vehicleForm,
        'propulsion', // Nome do campo no formulário
        selectedPropulsion, // Valor selecionado
        (id: number) => this.loadVehiclesByModel(id), // Função para carregar veículos, se necessário
        'motor' // O próximo campo a ser habilitado
      );
    } else {
      // Se a propulsão não for selecionada, desabilita o campo motor
      this.formUtils.resetAndDisableFields(this.vehicleForm, ['motor']);
    }
  }

  // Método para verificar se a marca digitada é válida
  onBrandInputChange(): void {
    const inputBrand = this.vehicleForm.get('brand')?.value;

    // Verifica se a marca digitada existe nas opções disponíveis
    this.filteredBrands.subscribe(brands => {
      this.formUtils.isFieldValid['brand'] = brands.some(brand => brand.name.toLowerCase() === inputBrand.toLowerCase());

      // Resetar e desabilitar o campo 'model' se o usuário está digitando no campo 'brand'
      if (inputBrand) {
        this.formUtils.resetAndDisableFields(this.vehicleForm, ['model', 'type', 'category', 'propulsion']);
      }
    });
  }

  // Método para verificar se o modelo digitado é válido
  onModelInputChange(): void {
    const inputModel = this.vehicleForm.get('model')?.value;

    this.filteredModels.subscribe(models => {
      // Verifica se o modelo digitado existe nas opções disponíveis
      this.formUtils.isFieldValid['model'] = models.some(model => model.name.toLowerCase() === inputModel.toLowerCase());

      // Se houver um valor no campo de modelo
      if (inputModel) {
        this.formUtils.resetAndDisableFields(this.vehicleForm, ['type', 'category', 'propulsion']);
      }
    });
  }

  // Método para verificar se o tipo digitado é válido
  onTypeInputChange(): void {
    const inputType = this.vehicleForm.get('type')?.value;

    this.filteredTypes.subscribe(types => {
      // Verifica se o tipo digitado existe nas opções disponíveis
      this.formUtils.isFieldValid['type'] = types.some(type => type.name.toLowerCase() === inputType.toLowerCase());

      // Se houver um valor no campo de tipo
      if (inputType) {
        this.formUtils.resetAndDisableFields(this.vehicleForm, ['category', 'propulsion']);
      }
    });
  }

  // Método para verificar se a categoria digitada é válida
  onCategoryInputChange(): void {
    const inputCategory = this.vehicleForm.get('category')?.value;

    this.filteredCategories.subscribe(categories => {
      // Verifica se a categoria digitada existe nas opções disponíveis
      this.formUtils.isFieldValid['category'] = categories.some(category => category.name.toLowerCase() === inputCategory.toLowerCase());

      // Se houver um valor no campo de categoria
      if (inputCategory) {
        this.formUtils.resetAndDisableFields(this.vehicleForm, ['propulsion']);
      }
    });
  }

  // Método para verificar se a propulsão digitada é válida
  onPropulsionInputChange(): void {
    const inputPropulsion = this.vehicleForm.get('propulsion')?.value;

    this.filteredPropulsions.subscribe(propulsions => {
      // Verifica se a propulsão digitada existe nas opções disponíveis
      this.formUtils.isFieldValid['propulsion'] = propulsions.some(propulsion => propulsion.name.toLowerCase() === inputPropulsion.toLowerCase());

      // Se houver um valor no campo de propulsão
      if (inputPropulsion) {
        this.vehicleForm.get('motor')?.reset(); // Reseta o campo de motor
        this.vehicleForm.get('motor')?.disable(); // Desabilita o campo de motor
      }
    });
  }

  /**
 * Exibe uma mensagem de sucesso após a operação.
 *
 * @param {string} action - Ação realizada (cadastrar ou atualizar)
 */
  private showSuccessMessage(action: string): void {
    Swal.fire({
      title: 'Success!',
      icon: 'success',
      text: `Vehicle successfully ${action}`,
    });
    this.dialogRef.close(true);
  }

  private showErrorMessage(error: string, action: string): void {
    Swal.fire({
      title: 'Error!',
      icon: 'error',
      text: `${error}`,
    });
  }

  /**
 * Manipula erros ao carregar dados.
 *
 * @param {string} context - Contexto da operação que falhou
 * @param {HttpErrorResponse} error - Erro recebido
 */
  private handleError(context: string, error: HttpErrorResponse): void {
    Swal.fire({
      title: 'Error!',
      icon: 'error',
      text: `Failed to load ${context}. Please try again.`,
    });
  }

  // Alterna a abertura do painel de autocomplete
  toggleAutocomplete(field: string, event: MouseEvent) {
    event.stopPropagation();

    let trigger: MatAutocompleteTrigger | undefined;

    // Determine qual trigger usar baseado no campo
    switch (field) {
      case 'brand':
        trigger = this.autoBrandTrigger;
        break;
      case 'model':
        trigger = this.autoModelTrigger;
        break;
      case 'type':
        trigger = this.autoTypeTrigger;
        break;
      case 'category':
        trigger = this.autoCategoryTrigger;
        break;
      case 'propulsion':
        trigger = this.autoPropulsionTrigger;
        break;
      case 'version':
        trigger = this.autoVersionTrigger;
        break;
      default:
        console.error('Campo não reconhecido:', field);
        return;
    }

    // Verifica se o trigger é válido antes de chamar os métodos
    if (trigger) {
      if (trigger.panelOpen) {
        trigger.closePanel();
      } else {
        trigger.openPanel();
      }
    } else {
      console.error('Trigger não encontrado para o campo:', field);
    }
  }

  /**
 * Verifica se está em modo de edição.
 *
 * @returns {boolean} true se estiver editando, false caso contrário
 */
  isEditing(): boolean {
    return this.editVehicle;
  }

  /**
 * Fecha o modal atual.
 */
  closeModal() {
    this.dialogRef.close();
  }

  /**
 * Reseta o formulário para seu estado inicial.
 */
  resetForm(): void {
    this.vehicleForm.reset();
  }

  /**
 * Abre um modal de perguntas frequentes sobre o veículo.
 */
  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      width: '500px',
      data: {
        faqs: [
          { question: 'Como criar um veículo?', answer: 'Preencha todos os campos obrigatórios e clique em "Cadastrar Veículo".' },
          { question: 'Como editar um veículo?', answer: 'Selecione um veículo existente para editar, faça as alterações necessárias e clique em "Atualizar Veículo".' },
          { question: 'O que significa o campo "Motor"?', answer: 'Informe o tipo de motor do veículo, como "Elétrico", "Combustão", etc.' },
          { question: 'Quando devo preencher o campo "Versão"?', answer: 'Este campo só aparece quando o campo "Motor" está preenchido corretamente. Insira a versão específica do veículo.' },
          { question: 'Como escolher a marca?', answer: 'O campo "Marca" será exibido após o preenchimento da "Versão". Escolha uma marca da lista disponibilizada.' },
          { question: 'E se a marca não aparecer?', answer: 'Se nenhuma marca for exibida, certifique-se de que o campo "Versão" está preenchido corretamente. Caso contrário, entre em contato com o suporte.' },
          { question: 'Como preencher o campo "Modelo"?', answer: 'Após selecionar a marca, escolha o modelo correspondente ao veículo.' },
          { question: 'O que são "Tipo" e "Categoria"?', answer: 'Esses campos especificam o tipo de veículo (como SUV, Sedan) e sua categoria (como compacta, esportiva).' },
          { question: 'Como preencher o campo "Propulsão"?', answer: 'Selecione a propulsão do veículo, como "Elétrico", "Híbrido", etc., após definir a categoria.' },
          { question: 'Como definir o "Ano" do veículo?', answer: 'Informe o ano de fabricação do veículo. O campo aceita apenas números com 4 dígitos.' },
          { question: 'Como preencher os campos de "Quilometragem"?', answer: 'Informe a quilometragem por litro ou energia do veículo tanto na estrada quanto na cidade, caso seja um veículo de combustão ou híbrido.' },
          { question: 'O que é "Autonomia em modo elétrico"?', answer: 'Este campo especifica a autonomia do veículo quando está operando no modo totalmente elétrico.' }
        ]
      }
    });
  }
}
