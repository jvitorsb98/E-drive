import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styleUrl: './modal-form-vehicle.component.scss'
})
export class ModalFormVehicleComponent {

  userVehicleForm!: FormGroup;
  
}
