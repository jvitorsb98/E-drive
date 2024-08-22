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
import { UserVehicle } from '../../../../../core/models/user-vehicle';

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
  ) {
    this.vehicle = data.vehicle;
    this.userVehicle = data.userVehicle;
    console.log('UserVehicle:', this.userVehicle);
    console.log('Vehicle:', this.vehicle);
  }

  ngOnInit() {
    this.loadBrands();
    this.buildForm();
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
    if (this.data && this.data.userVehicle) {
      if (this.data && this.data.vehicle.model.brand.name) {
        this.fillForm();
      } else {
        console.warn('Dados do veículo estão incompletos:', this.data);
      }
    }
  }

  //Preenche o formulário com os dados do veículo para edição
  fillForm() {
    if (this.data && this.data.vehicle.model.brand && this.data.userVehicle.userId) {
      this.userVehicleForm.patchValue({
        version: this.data.vehicle.version,
        brand: this.data.vehicle.model.brand.name,
        model: this.data.vehicle.model.name,
        mileagePerLiterRoad: this.data.vehicle.autonomy.mileagePerLiterRoad,
        mileagePerLiterCity: this.data.vehicle.autonomy.mileagePerLiterCity,
        consumptionEnergetic: this.data.vehicle.autonomy.consumptionEnergetic,
        autonomyElectricMode: this.data.vehicle.autonomy.autonomyElectricMode
      });
    } else {
      console.warn('Dados do veículo não estão completos:', this.data);
    }
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

  // submitForm() {
  //   if (this.userVehicleForm.valid) {
  //     const formData = this.userVehicleForm.value;
  //     const dataRegisterAutonomy = {
  //       mileagePerLiterRoad: formData.mileagePerLiterRoad,
  //       mileagePerLiterCity: formData.mileagePerLiterCity,
  //       consumptionEnergetic: formData.consumptionEnergetic,
  //       autonomyElectricMode: formData.autonomyElectricMode,
  //     };

  //     const dataRegisterVehicleUser = {
  //       vehicleId: this.selectedVehicle!.id, // Use o ID da versão do veículo
  //       dataRegisterAutonomy: dataRegisterAutonomy,
  //     };
  //     console.log(dataRegisterVehicleUser)

  //     const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzI0Mjc0ODAwLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.rKhZS09niDJ3I-0Y93xKg8BR3gX2yBCcmnn8b7PwM48';
  //     this.userVehicleService.registerVehicleUser(dataRegisterVehicleUser, authToken).subscribe(
  //       response => {
  //         console.log('Cadastro realizado com sucesso!', response);
  //         Swal.fire({
  //           title: 'Cadastro realizado com sucesso!',
  //           icon: 'success',
  //           text: 'O veículo foi cadastrado com sucesso.',
  //           showConfirmButton: true,
  //           confirmButtonColor: '#19B6DD',
  //         }).then(() => {
  //           this.closeModal();
  //         });
  //       },
  //       error => {
  //         console.error('Erro ao realizar cadastro:', error);
  //         Swal.fire({
  //           title: 'Erro!',
  //           icon: 'error',
  //           text: 'Houve um problema ao realizar o cadastro. Tente novamente mais tarde.',
  //           showConfirmButton: true,
  //           confirmButtonColor: '#19B6DD',
  //         });
  //       }
  //     );
  //   } else {
  //     Swal.fire({
  //       title: 'Formulário inválido!',
  //       icon: 'warning',
  //       text: 'Por favor, preencha todos os campos obrigatórios.',
  //       showConfirmButton: true,
  //       confirmButtonColor: '#19B6DD',
  //     });
  //   }
  // }

  submitForm() {

    const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpc3MiOiJBUEkgVm9sbC5tZWQiLCJpZCI6MSwiZXhwIjoxNzI0MzAwMzM0LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9.pWfF-VLmrAzlfAvbuChk-E2NGIrWEowpLpcip-zCISE';
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

      this.userVehicleService.updateVehicleUser(this.data.userVehicle.id, updateData, authToken).subscribe(
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
            });
          }
        );

      } else {
        Swal.fire({
          title: 'Formulário inválido!',
          icon: 'warning',
          text: 'Por favor, preencha todos os campos obrigatórios.',
          showConfirmButton: true,
        });
      }
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
