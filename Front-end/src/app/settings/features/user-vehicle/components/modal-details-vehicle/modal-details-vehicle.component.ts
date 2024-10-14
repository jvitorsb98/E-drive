// Importa o decorador Component e o decorador Inject do Angular core
import { Component, Inject } from '@angular/core';

// Importa o modelo UserVehicle, que representa um veículo associado a um usuário
import { UserVehicle } from '../../../../core/models/user-vehicle';

// Importa o modelo Vehicle, que representa um veículo
import { Vehicle } from '../../../../core/models/vehicle';

// Importa MAT_DIALOG_DATA e MatDialogRef para manipulação de diálogos
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Importa o serviço VehicleService para operações relacionadas a veículos
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';

// Define o componente 'ModalDetailsVehicleComponent'
@Component({
  selector: 'app-modal-details-vehicle', // Seletor para o componente
  templateUrl: './modal-details-vehicle.component.html', // Caminho para o template HTML
  styleUrls: ['./modal-details-vehicle.component.scss'] // Caminho para os estilos SCSS
})
export class ModalDetailsVehicleComponent {
  // Variável para armazenar os detalhes do veículo associado ao usuário
  userVehicle: UserVehicle;

  // Variável para armazenar os detalhes do veículo
  vehicle!: Vehicle;

  constructor(
    // Referência ao diálogo do componente, usada para fechar o modal
    public dialogRef: MatDialogRef<ModalDetailsVehicleComponent>,

    // Serviço para operações relacionadas a veículos
    private vehicleService: VehicleService,

    // Dados passados ao diálogo, que incluem o veículo e o veículo associado ao usuário
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle, userVehicle: UserVehicle },
  ) {
    // Inicializa as variáveis com os dados fornecidos ao diálogo
    this.userVehicle = data.userVehicle;
    this.vehicle = data.vehicle;

    // Carrega os detalhes do veículo usando o ID do veículo associado ao usuário
    this.loadVehicleDetails(this.userVehicle.vehicleId);
  }

  // Método para carregar os detalhes do veículo com base no ID do veículo
  loadVehicleDetails(vehicleId: number) {
    console.log(this.userVehicle)
    this.vehicleService.getVehicleDetails(vehicleId).subscribe({
      next: (vehicle: Vehicle) => {
        // Atualiza a variável de detalhes do veículo e exibe no console
        this.vehicle = vehicle;
        console.log("Detalhes do veículo:", this.vehicle);
      },
      error: (error) => {
        // Exibe erro no console em caso de falha ao carregar os detalhes
        console.error('Erro ao carregar detalhes do veículo:', error);
      }
    });
  }

  // Método para fechar o modal
  closeModal() {
    this.dialogRef.close();
  }
}
