import { Component, Inject } from '@angular/core';
import { Vehicle } from '../../../../../core/models/vehicle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Componente para exibir os detalhes de um veículo em um modal.
 *
 * **Passo a passo de chamada de métodos:**
 * 1. **constructor**: O modal é aberto com os dados do veículo recebidos via MAT_DIALOG_DATA.
 * 2. **closeModal**: Fecha o modal quando acionado.
 */
@Component({
  selector: 'app-modal-details-vehicle',
  templateUrl: './modal-details-vehicle.component.html',
  styleUrls: ['./modal-details-vehicle.component.scss']
})
export class ModalDetailsVehicleComponent {
  /**
   * Modelo de dados para o veículo exibido no modal.
   * @type {Vehicle}
   */
  vehicle!: Vehicle;

  /**
   * Construtor do componente.
   *
   * Inicializa o modelo com os dados do veículo recebidos através do parâmetro `data`.
   *
   * @param {MatDialogRef<ModalDetailsVehicleComponent>} dialogRef - Referência ao diálogo do modal.
   * @param {Vehicle} data - Dados do veículo recebidos para o modal.
   */
  constructor(
    public dialogRef: MatDialogRef<ModalDetailsVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle
  ) {
    this.vehicle = data; // Inicializa o modelo com os dados recebidos
  }

  /**
   * Método para fechar o modal.
   *
   * Este método é chamado quando o usuário deseja fechar o modal,
   * encerrando a instância do diálogo.
   */
  closeModal(): void {
    this.dialogRef.close();
  }
}
