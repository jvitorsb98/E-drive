// Importa os modelos necessários
import { UserVehicle } from '../../../../core/models/user-vehicle';
import { Vehicle } from '../../../../core/models/vehicle';

// Importa os serviços necessários
import { BrandService } from '../../../../core/services/brand/brand.service';
import { ModelService } from '../../../../core/services/model/model.service';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { UserDataService } from '../../../../core/services/user/userdata/user-data.service';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';

// Importa os módulos do Angular
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

// Importa o Swal para alertas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styleUrls: ['./modal-form-vehicle.component.scss']
})
export class ModalFormVehicleComponent implements OnInit {

  userVehicle!: UserVehicle;
  vehicle!: Vehicle
  userVehicleForm!: FormGroup;
  selectedVehicle: Vehicle | null = null;
  isAutonomyDataMissing = false;  // Variável para controlar a exibição do alerta
  editVehicle: boolean = false; // Variável para controlar a exibição do h1 do modal

  brands: { name: string; id: number }[] = [];
  models: { name: string; id: number }[] = [];
  vehicles: Vehicle[] = []; // Store fetched vehicles

  filteredBrands: Observable<{ name: string; id: number }[]> = of([]);
  filteredModels: Observable<{ name: string }[]> = of([]);
  filteredVersions: Observable<Vehicle[]> = of([]); // Now filtering vehicles based on version name

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private modelService: ModelService,
    private vehicleService: VehicleService,
    private userDataService: UserDataService,
    private userVehicleService: UserVehicleService,
    public dialogRef: MatDialogRef<ModalFormVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle, userVehicle: UserVehicle },
  ) { }

  ngOnInit() {
    this.initializeData();
    this.loadBrands();
    this.buildForm();
    this.setupAutocomplete();
  }

  buildForm() {
    this.userVehicleForm = this.formBuilder.group({
      version: [{ value: null, disabled: this.isEditMode() }, Validators.required],
      brand: [{ value: null, disabled: this.isEditMode() }, Validators.required],
      model: [{ value: null, disabled: this.isEditMode() }, Validators.required],
      mileagePerLiterRoad: [null, [Validators.pattern(/^\d{1,2}(\.\d)?$/)]], // Validação para aceitar números decimais com 1 casa
      mileagePerLiterCity: [null, [Validators.pattern(/^\d+(\.\d{1})?$/)]], // Validação para aceitar números decimais com 1 casa
      consumptionEnergetic: [null, [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],  // Validação para aceitar números decimais com 1 ou 2 casas
      autonomyElectricMode: [null, [Validators.pattern(/^\d+$/)]]  // Validação para aceitar somente números inteiros
    });
    if (this.data.userVehicle && this.data.vehicle) {
      this.editVehicle = true;
      this.fillForm();
    } else {
      console.warn('@Inject(MAT_DIALOG_DATA) public data Dados estão incompletos:', this.data);
    }
  }

  //Preenche o formulário com os dados do veículo para edição
  fillForm() {
    if (this.data.vehicle && this.data.vehicle.autonomy) {
      this.userVehicleForm.patchValue({
        version: this.data.vehicle.version,
        brand: this.data.vehicle.model.brand.name,
        model: this.data.vehicle.model.name,
        mileagePerLiterRoad: this.data.userVehicle.mileagePerLiterRoad,
        mileagePerLiterCity: this.data.userVehicle.mileagePerLiterCity,
        consumptionEnergetic: this.data.userVehicle.consumptionEnergetic,
        autonomyElectricMode: this.data.userVehicle.autonomyElectricMode
      });
      console.log('Formulário preenchido com:', this.userVehicleForm.value);
    } else {
      console.warn('Dados do veículo ou autonomia não encontrados para preenchimento.');
    }
  }

  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (response: any) => {
        this.brands = response.content.map((brand: any) => ({ name: brand.name, id: brand.id }));
        this.setupAutocomplete(); // Reconfigure the autocomplete with the loaded data
      },
      error: (error) => {
        console.error('Erro ao carregar as marcas', error);
      }
    });
  }

  loadModels(brandId: number) {
    this.modelService.getModelsByBrandId(brandId).subscribe({
      next: (response: any) => {
        const models = response.content || [];
        console.log('Models loaded:', response);

        if (Array.isArray(models)) {
          this.models = models.map(model => ({
            name: this.userDataService.capitalizeWords(model.name),
            id: model.id,
            brandId: model.brand.id
          }));
          this.setupAutocomplete(); // Reconfigure the autocomplete with the loaded data
        } else {
          console.error('Expected an array but got:', models);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar os modelos', error);
      }
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
    this.filteredBrands = this.userVehicleForm.get('brand')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value?.name || '');
        return this._filter(this.brands, filterValue);
      })
    );

    this.filteredModels = this.userVehicleForm.get('model')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value?.name || '');
        return this._filter(this.models, filterValue);
      })
    );

    this.filteredVersions = this.userVehicleForm.get('version')!.valueChanges.pipe(
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

  onBrandSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedBrand = event.option.value;
    this.userVehicleForm.get('brand')?.setValue(selectedBrand.name);

    if (selectedBrand.id) {
      this.loadModels(selectedBrand.id);
    }
  }

  onModelSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedModel = event.option.value;
    this.userVehicleForm.get('model')?.setValue(selectedModel.name);

    if (selectedModel.id) {
      this.loadVehiclesByModel(selectedModel.id);
    }
  }

  onVersionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedVehicle = event.option.value as Vehicle;
    this.selectedVehicle = selectedVehicle;
    if (selectedVehicle.id) {
      this.userVehicleForm.get('version')?.setValue(selectedVehicle.version);
      this.userVehicleForm.get('mileagePerLiterRoad')?.setValue(selectedVehicle.autonomy.mileagePerLiterRoad);
      this.userVehicleForm.get('mileagePerLiterCity')?.setValue(selectedVehicle.autonomy.mileagePerLiterCity);
      this.userVehicleForm.get('consumptionEnergetic')?.setValue(selectedVehicle.autonomy.consumptionEnergetic);
      this.userVehicleForm.get('autonomyElectricMode')?.setValue(selectedVehicle.autonomy.autonomyElectricMode);
    }

    this.isAutonomyDataMissing = !(
      selectedVehicle.autonomy.mileagePerLiterRoad &&
      selectedVehicle.autonomy.mileagePerLiterCity &&
      selectedVehicle.autonomy.consumptionEnergetic &&
      selectedVehicle.autonomy.autonomyElectricMode
    );


  }

  submitForm() {
    if (this.data && this.data.userVehicle) {
      console.log('Dados do veículo:', this.data.userVehicle);
      const formData = this.userVehicleForm.value;
      const dataUpdateAutonomy = {
        mileagePerLiterRoad: Number(formData.mileagePerLiterRoad),
        mileagePerLiterCity: Number(formData.mileagePerLiterCity),
        consumptionEnergetic: Number(formData.consumptionEnergetic),
        autonomyElectricMode: Number(formData.autonomyElectricMode),
      };

      const updateData = {
        dataUpdateAutonomy: dataUpdateAutonomy
      };

      this.userVehicleService.updateVehicleUser(this.data.userVehicle.id, updateData).subscribe(
        response => {
          console.log('Cadastro realizado com sucesso!', response);
          Swal.fire({
            title: 'Cadastro editado com sucesso!',
            icon: 'success',
            text: 'O veículo foi editado com sucesso.',
            showConfirmButton: true,
            confirmButtonColor: '#19B6DD',
          }).then(() => {
            this.closeModal();
          });
        },
        error => {
          console.error('Erro ao realizar update:', error);
          Swal.fire({
            title: 'Erro!',
            icon: 'error',
            text: 'Houve um problema ao realizar o update. Tente novamente mais tarde.',
            showConfirmButton: true,
            confirmButtonColor: 'red',
          });
        }
      );

    } else {
      if (this.userVehicleForm.valid) {
        const formData = this.userVehicleForm.value;
        const dataRegisterAutonomy = {
          mileagePerLiterRoad: formData.mileagePerLiterRoad,
          mileagePerLiterCity: formData.mileagePerLiterCity,
          consumptionEnergetic: formData.consumptionEnergetic,
          autonomyElectricMode: formData.autonomyElectricMode,
        };

        const dataRegisterVehicleUser = {
          vehicleId: this.selectedVehicle!.id, // Use o ID da versão do veículo
          dataRegisterAutonomy: dataRegisterAutonomy,
        };
        console.log(dataRegisterVehicleUser)

        this.userVehicleService.registerVehicleUser(dataRegisterVehicleUser).subscribe(
          response => {
            console.log('Cadastro realizado com sucesso!', response);
            Swal.fire({
              title: 'Cadastro realizado com sucesso!',
              icon: 'success',
              text: 'O veículo foi cadastrado com sucesso.',
              showConfirmButton: true,
              confirmButtonColor: '#19B6DD',
            }).then(() => {
              this.closeModal();
            });
          },
          error => {
            console.error('Erro ao realizar cadastro:', error);
            Swal.fire({
              title: 'Erro!',
              icon: 'error',
              text: 'Houve um problema ao realizar o cadastro. Tente novamente mais tarde.',
              showConfirmButton: true,
              confirmButtonColor: 'red'
            });
          }
        );

      } else {
        Swal.fire({
          title: 'Formulário inválido!',
          icon: 'warning',
          text: 'Por favor, preencha todos os campos obrigatórios.',
          showConfirmButton: true,
          confirmButtonColor: '#FFA726'
        });
      }
    }
  }

  private initializeData() {
    if (this.data) {
      this.vehicle = this.data.vehicle || {} as Vehicle;
      this.userVehicle = this.data.userVehicle || {} as UserVehicle;
      console.log('@Inject(MAT_DIALOG_DATA) public data UserVehicle:', this.userVehicle);
      console.log('@Inject(MAT_DIALOG_DATA) public data Vehicle:', this.vehicle);
    } else {
      console.warn('Nenhum dado foi injetado no modal.');
    }
  }

  private isEditMode(): boolean {
    return !!this.data.vehicle && !!this.data.userVehicle;
  }

  resetForm() {
    this.userVehicleForm.reset();
    this.isAutonomyDataMissing = false;
  }

  closeModal() {
    this.dialogRef.close();
  }

}
