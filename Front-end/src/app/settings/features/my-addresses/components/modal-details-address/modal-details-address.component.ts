// Modelo de dados para endereço
import { DataAddressDetails } from '../../../../core/models/inter-Address';

// Imports do Angular Material para modais
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-details-address',
  templateUrl: './modal-details-address.component.html',
  styleUrls: ['./modal-details-address.component.scss'] // Corrigido para 'styleUrls'
})
export class ModalDetailsAddressComponent {
  address!: DataAddressDetails; // Dados do endereço a serem exibidos

  constructor(
    public dialogRef: MatDialogRef<ModalDetailsAddressComponent>, // Referência ao diálogo
    @Inject(MAT_DIALOG_DATA) public data: DataAddressDetails, // Dados injetados no diálogo
  ) {
    this.address = data; // Inicializa o endereço com os dados passados
  }

  // Fecha o modal
  closeModal() {
    this.dialogRef.close();
  }
}
