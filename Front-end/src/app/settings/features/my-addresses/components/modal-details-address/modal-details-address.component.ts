import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataAddressDetails } from '../../../../core/models/inter-Address';

@Component({
  selector: 'app-modal-details-address',
  templateUrl: './modal-details-address.component.html',
  styleUrl: './modal-details-address.component.scss'
})
export class ModalDetailsAddressComponent {
  address!: DataAddressDetails;

  constructor(
    public dialogRef: MatDialogRef<ModalDetailsAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataAddressDetails,
  ) {
    this.address = data;
  }

  closeModal() {
    this.dialogRef.close();
  }
}
