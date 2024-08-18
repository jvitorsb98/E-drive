import { ModelService } from './../../../../../core/services/model/model.service';
import { BrandService } from './../../../../../core/services/brand/brand.service';
import { VehicleService } from './../../../../../core/services/vehicle/vehicle.service';
import { Brand } from './../../../../../core/models/Brand';
import { Model } from './../../../../../core/models/Model';
import { Vehicle } from './../../../../../core/models/Vehicle';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UserDataService } from '../../../../../core/services/user/userdata/user-data.service';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styleUrls: ['./modal-form-vehicle.component.scss']
})
export class ModalFormVehicleComponent implements OnInit {

  userVehicleForm: FormGroup;

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
    public dialogRef: MatDialogRef<ModalFormVehicleComponent>,
  ) {
    this.userVehicleForm = this.formBuilder.group({
      motor: [null, Validators.required],
      version: [null, Validators.required],
      brand: [null, Validators.required],
      model: [null, Validators.required],
      category: [null, Validators.required],
      vehicleType: [null, Validators.required],
      propulsion: [null, Validators.required],
      autonomy: [null, Validators.required],
      year: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadBrands();
    this.setupAutocomplete();
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

  closeModal() {
    this.dialogRef.close();
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
    const selectedVehicle = event.option.value;
    this.userVehicleForm.get('version')?.setValue(selectedVehicle.version);
  

  }

}
