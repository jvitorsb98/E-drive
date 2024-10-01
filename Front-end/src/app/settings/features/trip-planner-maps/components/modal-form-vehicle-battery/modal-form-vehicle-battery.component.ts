import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { IApiResponse } from '../../../../core/models/api-response';
import { UserVehicle } from '../../../../core/models/user-vehicle';
import { forkJoin, map } from 'rxjs';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { Vehicle } from '../../../../core/models/vehicle';
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component';
import { numberValidator } from '../../../../shared/validators/number-validator';
import { MatTableDataSource } from '@angular/material/table';
import { IVehicleWithUserVehicle } from '../../../../core/models/vehicle-with-user-vehicle';
import { Step } from '../../../../core/models/step';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-form-vehicle-battery',
  templateUrl: './modal-form-vehicle-battery.component.html',
  styleUrls: ['./modal-form-vehicle-battery.component.scss']
})
export class ModalFormVehicleBatteryComponent implements OnInit {
  vehicleStatusBatteryForm!: FormGroup;
  displayedColumns: string[] = ['icon', 'mark', 'model', 'version', 'choose'];
  dataSource = new MatTableDataSource<IVehicleWithUserVehicle>();
  userVehicleList: UserVehicle[] = [];
  userVehicleDetails: IVehicleWithUserVehicle[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginação
  @ViewChild(MatSort) sort!: MatSort; // Ordenação

  constructor(
    private formBuilder: FormBuilder,
    private userVehicleService: UserVehicleService,
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalFormVehicleBatteryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { stepsArray: Step[]; place: any }
  ) {
    this.dataSource = new MatTableDataSource(this.userVehicleDetails);
  }

  ngOnInit() {
    this.buildForm();
    this.populateForm();
    this.getListUserVehicles();
  }

  buildForm() {
    this.vehicleStatusBatteryForm = this.formBuilder.group({
      selectedVehicle: new FormControl(null, [Validators.required]),
      bateriaRestante: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$'), numberValidator]),
      saudeBateria: new FormControl(null, [Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$'), numberValidator])
    });
  }

  populateForm() {
    this.vehicleStatusBatteryForm.patchValue({
      selectedVehicle: this.data.place.selectedVehicle || null,
      bateriaRestante: this.data.place.bateriaRestante || null,
      saudeBateria: this.data.place.saudeBateria || null,
    });
    console.log("Formulário pré-preenchido:", this.vehicleStatusBatteryForm.value);
  }

  getListUserVehicles() {
    this.userVehicleService.getAllUserVehicle().subscribe({
      next: (response: IApiResponse<UserVehicle[]>) => {
        if (response?.content && Array.isArray(response.content)) {
          this.userVehicleList = response.content;
          console.log("Lista de veículos do usuário:", this.userVehicleList);
          this.loadVehicleDetails();
        } else {
          console.error('Expected an array in response.content but got:', response.content);
        }
      },
      error: (err) => {
        console.error('Error fetching userVehicles:', err);
      }
    });
  }

  loadVehicleDetails() {
    const vehicleDetailsObservables = this.userVehicleList.map(userVehicle =>
      this.vehicleService.getVehicleDetails(userVehicle.vehicleId).pipe(
        map((vehicle: Vehicle) => ({ vehicle, userVehicle }))
      )
    );

    forkJoin(vehicleDetailsObservables).subscribe((vehiclesWithUserVehicles) => {
      this.userVehicleDetails = vehiclesWithUserVehicles.map(({ vehicle, userVehicle }) => ({
        ...vehicle,
        userVehicle
      }));

      this.dataSource.data = this.userVehicleDetails;
      console.log("Detalhes dos veículos carregados:", this.userVehicleDetails);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    console.log("Filtro aplicado:", filterValue);
  }

  submitBatteryStatus() {
    if (this.vehicleStatusBatteryForm.valid) {
      const formValue = this.vehicleStatusBatteryForm.value;
      console.log("Dados do formulário enviados:", formValue);
  
      const autonomyElectricMode = formValue.selectedVehicle.autonomy?.autonomyElectricMode || 0;
      const bateriaRestante = Number(formValue.bateriaRestante);
      const saudeBateria = formValue.saudeBateria || 0;
  
      let batteryPercentageAfterTrip = bateriaRestante;
  
      for (const step of this.data.stepsArray) {
        const distance = step.distance;
        const batteryConsumptionPercentage = (distance / autonomyElectricMode) * 100;
  
        batteryPercentageAfterTrip -= batteryConsumptionPercentage;
  
        if (batteryPercentageAfterTrip <= 0) {
          batteryPercentageAfterTrip = 0;
          this.showInsufficientBatteryMessage(); // Exibir mensagem ao usuário
          return; // Interromper a função se a bateria for insuficiente
        }
      }
  
      console.log("Porcentagem de bateria restante ao final da viagem:", batteryPercentageAfterTrip.toFixed(2) + "%");
      // Retornar os dados necessários ao fechar o modal
      this.dialogRef.close({
        canCompleteTrip: true,
        batteryPercentageAfterTrip: batteryPercentageAfterTrip,
        selectedVehicle: formValue.selectedVehicle // Adicione o veículo selecionado se necessário
      });

    } else {
      console.error("Formulário inválido");
      return;
    }
  }
  
  showInsufficientBatteryMessage() {
    Swal.fire({
      title: 'Erro!',
      text: 'A viagem não pode ser realizada. Bateria insuficiente.',
      icon: 'error',
      confirmButtonText: 'Fechar'
    });
  }
  

  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: [
          // FAQs aqui
        ]
      },
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
