import { ModelService } from './../../../../../core/services/model/model.service';
import { BrandService } from './../../../../../core/services/brand/brand.service';
import { VehicleService } from './../../../../../core/services/vehicle/vehicle.service';
import { Vehicle } from '../../../../../core/models/vehicle';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UserDataService } from '../../../../../core/services/user/userdata/user-data.service';
import { UserVehicleService } from '../../../../../core/services/user/uservehicle/user-vehicle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styleUrls: ['./modal-form-vehicle.component.scss']
})
export class ModalFormVehicleComponent implements OnInit {

  userVehicleForm!: FormGroup;
  selectedVehicle: Vehicle | null = null;
  isAutonomyDataMissing = false;  // Variável para controlar a exibição do alerta

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
    @Inject(MAT_DIALOG_DATA) public data: Vehicle,
  ) { }

  ngOnInit() {
    this.loadBrands();
    this.setupAutocomplete();
  }

  buildForm() {
    this.userVehicleForm = this.formBuilder.group({
      version: [null, Validators.required],
      brand: [null, Validators.required],
      model: [null, Validators.required],
      mileagePerLiterRoad: [null],
      mileagePerLiterCity: [null],
      consumptionEnergetic: [null],
      autonomyElectricMode: [null]
    });

    if (this.data && this.data.id) {
      this.fillForm();
    }
  }

  //Preenche o formulário com os dados do veículo para edição
  fillForm() {
    this.userVehicleForm.patchValue({
      version: this.data.version,
      brand: this.data.model.brand.name,
      model: this.data.model.name,
      mileagePerLiterRoad: this.data.autonomy.mileagePerLiterRoad,
      mileagePerLiterCity: this.data.autonomy.mileagePerLiterCity,
      consumptionEnergetic: this.data.autonomy.consumptionEnergetic,
      autonomyElectricMode: this.data.autonomy.autonomyElectricMode
    });
  }

  loadBrands() {
    this.brandService.getAllBrands().subscribe(
      (response: any) => {
        this.brands = response.content.map((brand: any) => ({ name: brand.name, id: brand.id }));
        this.setupAutocomplete(); // Reconfigure the autocomplete with the loaded data
      },
      (error) => {
        console.error('Erro ao carregar as marcas', error);
      }
    );
  }

  loadModels(brandId: number) {
    this.modelService.getModelsByBrandId(brandId).subscribe(
      (response: any) => {
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
      (error) => {
        console.error('Erro ao carregar os modelos', error);
      }
    );
  }

  loadVehiclesByModel(modelId: number) {
    this.vehicleService.getVehiclesByModel(modelId).subscribe(
      (response: any) => {
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
      (error) => {
        console.error('Erro ao carregar os veículos', error);
      }
    );
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

      const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzI0MjAxMjA1LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.iGgOMfFOZb7bPzdpzkkmFNaRWJpGHEL7lHDr6ATribc';
      this.userVehicleService.registerVehicleUser(dataRegisterVehicleUser, authToken).subscribe(
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
            confirmButtonColor: '#19B6DD',
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Formulário inválido!',
        icon: 'warning',
        text: 'Por favor, preencha todos os campos obrigatórios.',
        showConfirmButton: true,
        confirmButtonColor: '#19B6DD',
      });
    }
  }

  resetForm() {
    this.userVehicleForm.reset();
    this.isAutonomyDataMissing = false;
  }

  closeModal() {
    this.dialogRef.close();
  }

}
