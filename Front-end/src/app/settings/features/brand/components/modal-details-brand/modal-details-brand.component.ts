import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Brand } from '../../../../core/models/brand';

@Component({
  selector: 'app-modal-details-brand',
  templateUrl: './modal-details-brand.component.html',
  styleUrl: './modal-details-brand.component.scss'
})
export class ModalDetailsBrandComponent {

  brand!: Brand;

  constructor(
    public dialogRef: MatDialogRef<ModalDetailsBrandComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.brand = data;
  }

  closeModal() {
    this.dialogRef.close();
  }
}
