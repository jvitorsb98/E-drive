import { Component, Inject } from '@angular/core';
import { UserVehicle } from '../../../../core/models/user-vehicle';
import { Vehicle } from '../../../../core/models/vehicle';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';

@Component({
  selector: 'app-modal-details-vehicle',
  templateUrl: './modal-details-vehicle.component.html',
  styleUrl: './modal-details-vehicle.component.scss'
})
export class ModalDetailsVehicleComponent {
  userVehicle: UserVehicle;
  vehicle!: Vehicle; // Variável para armazenar os detalhes do veículo

  constructor(
    public dialogRef: MatDialogRef<ModalDetailsVehicleComponent>,
    private vehicleService: VehicleService,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle, userVehicle: UserVehicle },
  ) {
    this.userVehicle = data.userVehicle;
    this.vehicle = data.vehicle;
    this.loadVehicleDetails(this.userVehicle.vehicleId); // Carrega os detalhes do veículo
  }

  // Método para carregar os detalhes do veículo
  loadVehicleDetails(vehicleId: number) {
    this.vehicleService.getVehicleDetails(vehicleId).subscribe({
      next: (vehicle: Vehicle) => {
        this.vehicle = vehicle;
        console.log("Detalhes do veículo:", this.vehicle);
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes do veículo:', error);
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
