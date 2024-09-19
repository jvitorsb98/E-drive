import { Component, Inject } from '@angular/core';
import { Vehicle } from '../../../../../core/models/vehicle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-details-vehicle',
  templateUrl: './modal-details-vehicle.component.html',
  styleUrl: './modal-details-vehicle.component.scss'
})
export class ModalDetailsVehicleComponent {
  vehicle!: Vehicle; // Modelo de dados para o componente

  constructor(
    public dialogRef: MatDialogRef<ModalDetailsVehicleComponent>, // Referência ao diálogo
    @Inject(MAT_DIALOG_DATA) public data: Vehicle // Dados recebidos para o modal
  ) {
    this.vehicle = data; // Inicializa o modelo com os dados recebidos
  }

  // Método para fechar o modal
  closeModal() {
    this.dialogRef.close();
  }
}
