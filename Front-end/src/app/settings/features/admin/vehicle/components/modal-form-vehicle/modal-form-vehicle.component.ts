import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, catchError } from 'rxjs';
import Swal from 'sweetalert2';
import { FaqPopupComponent } from '../../../../../core/fragments/faq-popup/faq-popup.component';
import { Vehicle } from '../../../../../core/models/vehicle';
import { BrandService } from '../../../../../core/services/brand/brand.service';
import { CategoryService } from '../../../../../core/services/category/category.service';
import { ModelService } from '../../../../../core/services/model/model.service';
import { PropusionService } from '../../../../../core/services/propusion/propusion.service';
import { TypeVehicleService } from '../../../../../core/services/typeVehicle/type-vehicle.service';
import { VehicleService } from '../../../../../core/services/vehicle/vehicle.service';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styleUrl: './modal-form-vehicle.component.scss'
})
export class ModalFormVehicleComponent {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  vehicleForm!: FormGroup;
  editVehicle: boolean = false;
  noCategoryFound: boolean = false;
  noBrandFound: boolean = false;
  brands: { name: string; id: number }[] = [];
  filteredBrands: Observable<{ name: string; id: number }[]> = of([]);
  categories: { name: string; id: number }[] = [];
  models: { name: string; id: number }[] = [];
  types: { name: string; id: number }[] = [];
  propulsions: { name: string; id: number }[] = [];
  filteredCategories: Observable<{ name: string; id: number }[]> = of([]);
  filteredModels: Observable<{ name: string }[]> = of([]);
  vehicles: Vehicle[] = [];

  // TODO: Ta cheio de bugs identificar-los e corrigir-los e melhorar o design ta feio.
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
    @Inject(MAT_DIALOG_DATA) public data: Vehicle
  ) { }

  ngOnInit(): void {
    this.editVehicle = !!this.data?.motor;
    this.loadBrands();
    this.loadCategories();
    this.loadTypes();
    this.loadPropulsions();
    this.buildForm();
    if (this.editVehicle) {
      this.fillForm();
    }

    // Monitorar mudanças no campo brand para carregar modelos
    this.vehicleForm.get('brand')?.valueChanges.subscribe((selectedBrand) => {
      const brand = this.brands.find(b => b.name === selectedBrand);
      if (brand) {
        this.loadModels(brand.id);
      } else {
        this.models = []; // Limpa os modelos caso a marca não seja válida
      }
    });
  }

  buildForm() {
    this.vehicleForm = this.formBuilder.group({
      motor: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      version: new FormControl(null, [Validators.required]),
      brand: new FormControl(null, [Validators.required]),
      model: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      propulsion: new FormControl(null, [Validators.required]),
      autonomy: this.formBuilder.group({
        mileagePerLiterRoad: [null, [Validators.pattern(/^\d{1,2}(\.\d)?$/)]], // Validação para aceitar números decimais com 1 casa
        mileagePerLiterCity: [null, [Validators.pattern(/^\d+(\.\d{1})?$/)]], // Validação para aceitar números decimais com 1 casa
        consumptionEnergetic: [null, [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],  // Validação para aceitar números decimais com 1 ou 2 casas
        autonomyElectricMode: [null, [Validators.pattern(/^\d+$/)]]  // Validação para aceitar somente números inteiros
      }),
      year: new FormControl(null, [Validators.required, Validators.min(1886)]),
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
        autonomy: {
          mileagePerLiterCity: this.data.autonomy.mileagePerLiterCity,
          mileagePerLiterRoad: this.data.autonomy.mileagePerLiterRoad,
          consumptionEnergetic: this.data.autonomy.consumptionEnergetic,
          autonomyElectricMode: this.data.autonomy.autonomyElectricMode
        },
        year: this.data.year,
        activated: this.data.activated,
      });
    }
  }

  loadBrands() {
    this.brandService.getAllBrands().subscribe({
      next: (response: any) => {
        this.brands = response.content.map((brand: any) => ({ name: brand.name, id: brand.id }));
      },
      error: (error) => {
        console.error('Error loading brands', error);
      }
    });
  }

  loadModels(idBrand: number) {
    this.modelService.getModelsByBrandId(idBrand).subscribe({
      next: (response: any) => {
        this.models = response.content.map((model: any) => ({ name: model.name, id: model.id }));
      },
      error: (error) => {
        console.error('Error loading models', error);
      }
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (response: any) => {
        this.categories = response.content.map((category: any) => ({ name: category.name, id: category.id }));
      },
      error: (error) => {
        console.error('Error loading categories', error);
      }
    });
  }

  loadTypes() {
    this.vehicleTypeService.getAll().subscribe({
      next: (response: any) => {
        this.types = response.content.map((type: any) => ({ name: type.name, id: type.id }));
      },
      error: (error) => {
        console.error('Error loading vehicle types', error);
      }
    });
  }

  loadPropulsions() {
    this.propulsionService.getAll().subscribe({
      next: (response: any) => {
        this.propulsions = response.content.map((propulsion: any) => ({ name: propulsion.name, id: propulsion.id }));
      },
      error: (error) => {
        console.error('Error loading propulsions', error);
      }
    });
  }

  submitForm() {
    if (this.vehicleForm.valid) {
      const action = this.isEditing() ? 'updated' : 'registered';

      const vehicleData = {
        ...this.data,
        motor: this.vehicleForm.get('motor')?.value,
        version: this.vehicleForm.get('version')?.value,
        modelId: this.getSelectedModelId(),
        categoryId: this.getSelectedCategoryId(),
        typeId: this.getSelectedTypeId(),
        propulsionId: this.getSelectedPropulsionId(),
        autonomy: this.vehicleForm.get('autonomy')?.value,
        year: this.vehicleForm.get('year')?.value,
        activated: this.vehicleForm.get('activated')?.value
      };

      const request$ = this.isEditing()
        ? this.vehicleService.update(vehicleData.id, vehicleData)
        : this.vehicleService.register(vehicleData);

      if (this.isEditing()) {

        this.vehicleService.update(vehicleData.id, vehicleData)
      }

      request$.pipe(
        catchError(() => {
          Swal.fire({
            title: 'Error!',
            icon: 'error',
            text: `An error occurred while ${action} the vehicle. Please try again later.`,
            showConfirmButton: true,
            confirmButtonColor: 'red',
          });
          return of(null);
        })
      ).subscribe(() => {
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          text: `The vehicle has been successfully ${action}.`,
          showConfirmButton: true,
          confirmButtonColor: '#19B6DD',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.closeModal();
          }
        });
      });
    } else {
      console.warn('Invalid form:', this.vehicleForm);
    }
  }

  private getSelectedModelId(): number | undefined {
    const selectedModelName = this.vehicleForm.get('model')?.value;
    const selectedModel = this.models.find(model => model.name === selectedModelName);
    return selectedModel?.id;
  }

  private getSelectedCategoryId(): number | undefined {
    const selectedCategoryName = this.vehicleForm.get('category')?.value;
    const selectedCategory = this.categories.find(category => category.name === selectedCategoryName);
    return selectedCategory?.id;
  }

  private getSelectedTypeId(): number | undefined {
    const selectedTypeName = this.vehicleForm.get('type')?.value;
    const selectedType = this.types.find(type => type.name === selectedTypeName);
    return selectedType?.id;
  }

  private getSelectedPropulsionId(): number | undefined {
    const selectedPropulsionName = this.vehicleForm.get('propulsion')?.value;
    const selectedPropulsion = this.propulsions.find(propulsion => propulsion.name === selectedPropulsionName);
    return selectedPropulsion?.id;
  }

  isEditing(): boolean {
    return !!this.data;
  }

  closeModal() {
    this.dialogRef.close();
  }

  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: [
          { question: 'How to register a new vehicle?', answer: '...' },
          { question: 'How to update a vehicle?', answer: '...' }
        ]
      }
    });
  }
}

