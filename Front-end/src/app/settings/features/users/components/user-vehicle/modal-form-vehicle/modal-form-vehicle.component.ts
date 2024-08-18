import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styleUrl: './modal-form-vehicle.component.scss'
})
export class ModalFormVehicleComponent {

  userVehicleForm!: FormGroup;
  brands: Array<{ name: string }> = [
    { name: 'Toyota' },
    { name: 'Honda' },
    { name: 'Ford' }
  ];
  models: Array<{ name: string }> = [
    { name: 'Corolla' },
    { name: 'Civic' },
    { name: 'Mustang' }
  ];
  versions: Array<{ name: string }> = [
    { name: '3020' },
    { name: '2021' },
    { name: '2022' }
  ];
  filteredModels!: Observable<Array<{ name: string }>>;
  filteredVersions!: Observable<Array<{ name: string }>>;
  filteredBrands!: Observable<Array<{ name: string }>>;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalFormVehicleComponent>,
  ) { }

  ngOnInit() {
    this.buildedForm();
    this.setupAutocomplete();
  }

  buildedForm() {
    this.userVehicleForm = this.formBuilder.group({
      motor: new FormControl(null, [Validators.required]),
      version: new FormControl(null, [Validators.required]),
      brand: new FormControl(null, [Validators.required]),
      model: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      vehicleType: new FormControl(null, [Validators.required]),
      propulsion: new FormControl(null, [Validators.required]),
      autonomy: new FormControl(null, [Validators.required]),
      year: new FormControl(null, [Validators.required]),
    });
  }

  setupAutocomplete() {
    this.filteredBrands = this.userVehicleForm.get('brand')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(this.brands, value))
    );

    this.filteredModels = this.userVehicleForm.get('model')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(this.models, value))
    );

    this.filteredVersions = this.userVehicleForm.get('version')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(this.versions, value))
    );
  }

  private _filter(array: Array<{ name: string }>, value: string): Array<{ name: string }> {
    const filterValue = value.toLowerCase();
    return array.filter(item => item.name.toLowerCase().includes(filterValue));
  }

  closeModal() {
    this.dialogRef.close();
  }

}
