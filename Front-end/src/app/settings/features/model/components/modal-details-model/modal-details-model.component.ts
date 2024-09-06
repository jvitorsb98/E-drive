import { Component, Inject } from '@angular/core';
import { Model } from '../../../../core/models/model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-details-model',
  templateUrl: './modal-details-model.component.html',
  styleUrl: './modal-details-model.component.scss'
})
export class ModalDetailsModelComponent {
  model!: Model;

  constructor(
    public dialogRef: MatDialogRef<ModalDetailsModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Model,
  ) {
    this.model = data;
  }

  closeModal() {
    this.dialogRef.close();
  }
}
