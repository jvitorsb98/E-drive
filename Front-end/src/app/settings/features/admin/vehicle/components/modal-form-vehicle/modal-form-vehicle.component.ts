import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { FaqPopupComponent } from '../../../../../core/fragments/faq-popup/faq-popup.component';
import { IVehicleRequest, Vehicle } from '../../../../../core/models/vehicle';
import { BrandService } from '../../../../../core/services/brand/brand.service';
import { CategoryService } from '../../../../../core/services/category/category.service';
import { ModelService } from '../../../../../core/services/model/model.service';
import { PropusionService } from '../../../../../core/services/propusion/propusion.service';
import { TypeVehicleService } from '../../../../../core/services/typeVehicle/type-vehicle.service';
import { VehicleService } from '../../../../../core/services/vehicle/vehicle.service';
import { Model } from '../../../../../core/models/model';
import { PaginatedResponse } from '../../../../../core/models/paginatedResponse';
import { VehicleType } from '../../../../../core/models/vehicle-type';
import { Category } from '../../../../../core/models/category';
import { Propulsion } from '../../../../../core/models/propulsion';
import { IAutonomyRequest } from '../../../../../core/models/autonomy';
import { HttpErrorResponse } from '@angular/common/http';
import { FormUtilsService } from '../../../../../shared/services/FormUtils/form-utils.service';
import { Brand } from '../../../../../core/models/brand';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styleUrls: ['./modal-form-vehicle.component.scss'] // Corrigido 'styleUrl' para 'styleUrls'
})
export class ModalFormVehicleComponent {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  vehicleForm!: FormGroup;
  editVehicle = false;
  noCategoryFound = false;
  noBrandFound = false;

  brands: { name: string; id: number }[] = [];
  filteredBrands: Observable<{ name: string; id: number }[]> = of([]);
  categories: { name: string; id: number }[] = [];
  models: { name: string; id: number }[] = [];
  types: { name: string; id: number }[] = [];
  propulsions: { name: string; id: number }[] = [];

  filteredCategories: Observable<{ name: string; id: number }[]> = of([]);
  filteredModels: Observable<{ name: string }[]> = of([]);
  vehicles: Vehicle[] = [];

  constructor(
    private vehicleService: VehicleService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private modelService: ModelService,
    private propulsionService: PropusionService,
    private vehicleTypeService: TypeVehicleService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalFormVehicleComponent>,
    public formutils: FormUtilsService,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle
  ) { }

  ngOnInit(): void {
    this.editVehicle = !!this.data?.motor;
    this.loadBrands();
    this.loadCategories();
    this.loadTypes();
    this.buildForm();
    this.loadPropulsions();
    if (this.editVehicle) {
      this.fillForm();
    }

    this.vehicleForm.get('brand')?.valueChanges.subscribe(this.onBrandChange.bind(this));

    // Inicializa os observadores de campo
    if (!this.editVehicle) {
      this.initializeFieldObservers();
    }
  }

  private buildForm(): void {
    this.vehicleForm = this.formBuilder.group({
      brand: new FormControl(null, [Validators.required]),
      model: new FormControl(!this.editVehicle ? !this.editVehicle ? { value: null, disabled: true } : null : null, [Validators.required]),
      type: new FormControl(!this.editVehicle ? !this.editVehicle ? { value: null, disabled: true } : null : null, [Validators.required]),
      category: new FormControl(!this.editVehicle ? !this.editVehicle ? { value: null, disabled: true } : null : null, [Validators.required]),
      propulsion: new FormControl(!this.editVehicle ? !this.editVehicle ? { value: null, disabled: true } : null : null, [Validators.required]),
      motor: new FormControl(!this.editVehicle ? { value: null, disabled: true } : null, [Validators.required, Validators.minLength(2)]),
      version: new FormControl(!this.editVehicle ? { value: null, disabled: true } : null, [Validators.required, Validators.minLength(2)]),
      year: new FormControl(!this.editVehicle ? { value: null, disabled: true } : null, [Validators.required, Validators.min(1886)]),
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

  fillForm() {
    if (this.data.motor) {
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
    this.formutils.observeFieldChanges(this.vehicleForm,'brand', 'model');
    this.formutils.observeFieldChanges(this.vehicleForm,'model', 'type');
    this.formutils.observeFieldChanges(this.vehicleForm,'type', 'category');
    this.formutils.observeFieldChanges(this.vehicleForm,'category', 'propulsion');
    this.formutils.observeFieldChanges(this.vehicleForm,'propulsion', 'motor');
    this.formutils.observeFieldChanges(this.vehicleForm,'motor', 'version');
    this.formutils.observeFieldChanges(this.vehicleForm,'version', 'year');
    this.formutils.observeFieldChanges(this.vehicleForm,'year', 'mileagePerLiterRoad');
    this.formutils.observeFieldChanges(this.vehicleForm,'mileagePerLiterRoad', 'mileagePerLiterCity');
    this.formutils.observeFieldChanges(this.vehicleForm,'mileagePerLiterCity', 'consumptionEnergetic');
    this.formutils.observeFieldChanges(this.vehicleForm,'consumptionEnergetic', 'autonomyElectricMode');
  }

  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (response: any) => {
        this.brands = response.content.map((brand: Brand) => ({ name: brand.name, id: brand.id }));
      },
      error: (error) => this.handleError('brands', error),
    });
  }

  private loadModels(idBrand: number): void {
    this.modelService.getModelsByBrandId(idBrand).subscribe({
      next: (response: any) => {
        this.models = response.content.map((model: Model) => ({ name: model.name, id: model.id }));
      },
      error: (error) => this.handleError('models', error),
    });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (response: PaginatedResponse<VehicleType>) => {
        this.categories = response.content.map((category: Category) => ({ name: category.name, id: category.id }));
      },
      error: (error) => this.handleError('categories', error),
    });
  }

  private loadTypes(): void {
    this.vehicleTypeService.getAll().subscribe({
      next: (response: PaginatedResponse<VehicleType>) => {
        this.types = response.content.map((type: VehicleType) => ({ name: type.name, id: type.id }));
      },
      error: (error) => this.handleError('types', error),
    });
  }

  private loadPropulsions(): void {
    this.propulsionService.getAll().subscribe({
      next: (response: PaginatedResponse<Propulsion>) => {
        this.propulsions = response.content.map((propulsion: Propulsion) => ({ name: propulsion.name, id: propulsion.id }));
      },
      error: (error) => this.handleError('propulsions', error),
    });
  }

  private onBrandChange(selectedBrand: string): void {
    const brand = this.brands.find(b => b.name === selectedBrand);
    if (brand) {
      this.loadModels(brand.id);
    } else {
      this.models = [];
    }
  }

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

  private getSelectedModelId(): number | undefined {
    return this.models.find(model => model.name === this.vehicleForm.get('model')?.value)?.id;
  }

  private getSelectedCategoryId(): number | undefined {
    return this.categories.find(category => category.name === this.vehicleForm.get('category')?.value)?.id;
  }

  private getSelectedTypeId(): number | undefined {
    return this.types.find(type => type.name === this.vehicleForm.get('type')?.value)?.id;
  }

  private getSelectedPropulsionId(): number | undefined {
    return this.propulsions.find(propulsion => propulsion.name === this.vehicleForm.get('propulsion')?.value)?.id;
  }

  private showSuccessMessage(action: string): void {
    Swal.fire({
      title: 'Success!',
      icon: 'success',
      text: `Vehicle successfully ${action}`,
    });
    this.dialogRef.close(true);
  }

  private showErrorMessage(error:string,action: string): void {
    Swal.fire({
      title: 'Error!',
      icon: 'error',
      text: `${error}`,
    });
  }

  private handleError(context: string, error: HttpErrorResponse): void {
    Swal.fire({
      title: 'Error!',
      icon: 'error',
      text: `Failed to load ${context}. Please try again.`,
    });
  }

  isEditing(): boolean {
    return this.editVehicle;
  }

  closeModal() {
    this.dialogRef.close();
  }

  resetForm(): void {
    this.vehicleForm.reset();
  }

  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
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
