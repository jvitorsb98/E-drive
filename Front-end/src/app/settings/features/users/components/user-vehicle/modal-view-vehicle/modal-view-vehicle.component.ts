import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from '../../../../../core/models/vehicle';

@Component({
  selector: 'app-modal-view-vehicle',
  templateUrl: './modal-view-vehicle.component.html',
  styleUrl: './modal-view-vehicle.component.scss'
})
export class ModalViewVehicleComponent {

  userVehicle: Vehicle;

  constructor(
    public dialogRef: MatDialogRef<ModalViewVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle,
  ) {
    this.userVehicle = data;
    console.log('Data from modal:', this.userVehicle);
  }

  closeModal() {
    this.dialogRef.close();
  }

}