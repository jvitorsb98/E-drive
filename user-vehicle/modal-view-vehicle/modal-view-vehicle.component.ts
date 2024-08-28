import { Vehicle } from './../../../../../core/models/vehicle';
import { VehicleService } from './../../../../../core/services/vehicle/vehicle.service';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserVehicle } from '../../../../../core/models/user-vehicle';

@Component({
  selector: 'app-modal-view-vehicle',
  templateUrl: './modal-view-vehicle.component.html',
  styleUrls: ['./modal-view-vehicle.component.scss']
})
export class ModalViewVehicleComponent {

  userVehicle: UserVehicle;
  vehicle!: Vehicle; // Variável para armazenar os detalhes do veículo

  constructor(
    public dialogRef: MatDialogRef<ModalViewVehicleComponent>,
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
