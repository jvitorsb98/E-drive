import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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

  constructor(
    private formBuilder: FormBuilder,
    private userVehicleService: UserVehicleService,
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
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
          // Filtra os veículos que estão ativados
          this.userVehicleList = response.content.filter(vehicle => vehicle.activated === true);
          console.log("Lista de veículos ativados do usuário:", this.userVehicleList);
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

      // Se houver apenas um veículo disponível, selecione-o automaticamente
      if (this.userVehicleDetails.length === 1) {
        this.vehicleStatusBatteryForm.patchValue({
          selectedVehicle: this.userVehicleDetails[0] // Marca o ID como selecionado
        });

        setTimeout(() => {
          const inputElement = document.querySelector('input[formControlName="bateriaRestante"]');
          console.log(inputElement);
          (inputElement as HTMLInputElement).focus(); // Asserção de tipo para HTMLInputElement
        }, 100);

      }

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

      // Obtém a saúde da bateria
      let batteryHealth = Number(formValue.saudeBateria);
      if (!batteryHealth) {
        const currentYear = new Date().getFullYear();
        const vehicleYear = formValue.selectedVehicle.year;
        const yearsOfUse = currentYear - vehicleYear;
        batteryHealth = Math.max(100 - (yearsOfUse * 2.3), 0); // Garante que a saúde da bateria não fique negativa
      }

      const autonomyElectricMode = formValue.selectedVehicle.autonomy?.autonomyElectricMode || 0;
      const remainingBattery = Number(formValue.bateriaRestante);
      let batteryPercentageAfterTrip = remainingBattery;
      // Cálculo do consumo de bateria
      for (const step of this.data.stepsArray) {
        const distance = step.distance;
        const batteryConsumptionPercentage = (distance / (autonomyElectricMode * (batteryPercentageAfterTrip / 100))) * 100;
        batteryPercentageAfterTrip -= batteryConsumptionPercentage;
        console.log(batteryPercentageAfterTrip)
        // Se a porcentagem de bateria após a viagem for menor ou igual a 0
        if (batteryPercentageAfterTrip <= 0) {
          batteryPercentageAfterTrip = 0;
          this.showInsufficientBatteryMessage(); // Mostra mensagem ao usuário
          return; // Para a função se a bateria for insuficiente
        }
      }

      // Alerta sobre a porcentagem de bateria restante
      if (batteryPercentageAfterTrip < 10) {
        Swal.fire({
          title: 'Aviso de Bateria Baixa',
          text: `Você chegará com apenas ${batteryPercentageAfterTrip.toFixed(2)}% de bateria. Você deseja continuar?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Continue',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            // Se o usuário continuar, fecha o modal com os dados
            this.dialogRef.close({
              canCompleteTrip: true,
              batteryPercentageAfterTrip: batteryPercentageAfterTrip.toFixed(2),
              selectedVehicle: formValue.selectedVehicle
            });
          } else {
            // Se o usuário cancelar, fecha o modal
            this.dialogRef.close({
              canCompleteTrip: false,
              batteryPercentageAfterTrip: batteryPercentageAfterTrip.toFixed(2),
              selectedVehicle: formValue.selectedVehicle
            });
          }
        });
      } else {
        // Se a bateria for suficiente, exibe apenas a porcentagem final
        Swal.fire({
          title: 'Status da Bateria',
          text: `Você chegará com ${batteryPercentageAfterTrip.toFixed(2)}% de bateria.`,
          icon: 'info',
          confirmButtonText: 'OK'
        }).then(() => {
          this.dialogRef.close({
            canCompleteTrip: true,
            batteryPercentageAfterTrip: batteryPercentageAfterTrip.toFixed(2),
            selectedVehicle: formValue.selectedVehicle
          });
        });
      }
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
