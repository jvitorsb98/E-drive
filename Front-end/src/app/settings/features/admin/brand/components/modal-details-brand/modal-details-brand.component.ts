import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Modelos
import { Brand } from '../../../../../core/models/brand';

@Component({
  selector: 'app-modal-details-brand',
  templateUrl: './modal-details-brand.component.html',
  styleUrls: ['./modal-details-brand.component.scss']
})
export class ModalDetailsBrandComponent {

  // A marca que será exibida no modal
  brand!: Brand;

  constructor(
    public dialogRef: MatDialogRef<ModalDetailsBrandComponent>, // Referência ao diálogo
    @Inject(MAT_DIALOG_DATA) public data: Brand, // Dados recebidos para exibição no modal
  ) {
    // Inicializa a marca com os dados recebidos
    this.brand = data;
  }

  // Método para fechar o modal
  closeModal() {
    this.dialogRef.close();
  }
}
