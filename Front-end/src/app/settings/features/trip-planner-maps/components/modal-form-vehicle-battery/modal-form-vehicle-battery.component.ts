import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { IApiResponse } from '../../../../core/models/api-response';
import { UserVehicle } from '../../../../core/models/user-vehicle';

@Component({
  selector: 'app-modal-form-vehicle-battery',
  templateUrl: './modal-form-vehicle-battery.component.html',
  styleUrl: './modal-form-vehicle-battery.component.scss'
})
export class ModalFormVehicleBatteryComponent {

  userVehicleList: UserVehicle[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userVehicleService: UserVehicleService,
    public dialogRef: MatDialogRef<ModalFormVehicleBatteryComponent>) { }


  // Obtém a lista de veículos do usuário
  getListUserVehicles() {
    this.userVehicleService.getAllUserVehicle().subscribe({
      next: (response: IApiResponse<UserVehicle[]>) => {
        console.log('Response from getAllUserVehicle:', response);

        if (response && response.content && Array.isArray(response.content)) {
          this.userVehicleList = response.content;
        } else {
          console.error('Expected an array in response.content but got:', response.content);
        }
      },
      error: (err) => {
        console.error('Error fetching userVehicles:', err);
      }
    });
  }

  closeModal() {
    this.dialogRef.close(); // Fecha o modal
  }
}
