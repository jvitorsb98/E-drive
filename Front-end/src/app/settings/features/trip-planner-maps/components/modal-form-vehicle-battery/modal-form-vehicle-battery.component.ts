import { UserVehicle } from './../../../../core/models/user-vehicle';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { IApiResponse } from '../../../../core/models/api-response';
import { forkJoin, map } from 'rxjs';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { Vehicle } from '../../../../core/models/vehicle';
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component';
import { numberValidator } from '../../../../shared/validators/number-validator';
import { MatTableDataSource } from '@angular/material/table';
import { IVehicleWithUserVehicle } from '../../../../core/models/vehicle-with-user-vehicle';
import { Step } from '../../../../core/models/step';
import Swal from 'sweetalert2';
import { TripPlannerMapsService } from '../../../../core/services/trip-planner-maps/trip-planner-maps.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service'; 

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
  isStation: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userVehicleService: UserVehicleService,
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private alertasService: AlertasService,
    private tripPlannerMapsService: TripPlannerMapsService, 
    public dialogRef: MatDialogRef<ModalFormVehicleBatteryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { stepsArray: Step[]; place: any; isStation: boolean } // Adicione o atributo isStation aqui
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
      const remainingBattery = Number(formValue.bateriaRestante);
      let batteryHealth = Number(formValue.saudeBateria);
  
      if (this.data.isStation) {
        // Chama o serviço para calcular o status da bateria
        const { canCompleteTrip, batteryPercentageAfterTrip } = this.tripPlannerMapsService.calculateBatteryStatus(
          formValue.selectedVehicle,
          remainingBattery,
          batteryHealth,
          this.data.stepsArray
        );
  
        if (!canCompleteTrip) {
          this.alertasService.showError('Erro!', 'A viagem não pode ser realizada. Bateria insuficiente.'); // Alerta de erro
          return;
        }
  
        // Aqui lidamos com o caso em que é possível completar a viagem
        this.alertasService.showInfo(
          'Status da Bateria',
          `Você chegará com ${batteryPercentageAfterTrip.toFixed(2)}% de bateria.`
        ).then(() => {
          this.dialogRef.close({
            canCompleteTrip: true,
            batteryPercentageAfterTrip: batteryPercentageAfterTrip.toFixed(2),
            selectedVehicle: formValue.selectedVehicle
          });
        });
      }  else {
        // Modo de planejamento de viagem
        this.tripPlannerMapsService.calculateChargingStations(
          formValue.selectedVehicle,
          remainingBattery,
          batteryHealth,
          this.data.stepsArray
        ).then(({ chargingStations, canCompleteTrip, canCompleteWithoutStops, batteryPercentageAfterTrip }) => {
          if (canCompleteTrip) {
            // Se a viagem puder ser completada, mesmo que com paradas
            if (!canCompleteWithoutStops) {
              // Se houver postos de carregamento necessários
              const chargingStationList = chargingStations
              .map(station => `${station.name} (${this.formatAddress(station.formatted_address)})`)
              .join('\n'); // Usar quebra de linha para separar os postos
            
            const message = `Você precisará passar por ${chargingStations.length} posto${chargingStations.length > 1 ? 's' : ''} de carregamento`;
            console.log(chargingStationList[0])
            const listStations = `${chargingStationList}`
            this.alertasService.showInfo(message, listStations).then(() => {
              // Mostrar a lista de postos de carregamento e suas localizações
              this.dialogRef.close({
                canCompleteTrip: true,
                chargingStations: chargingStations,
                selectedVehicle: formValue.selectedVehicle,
                batteryPercentageAfterTrip: batteryPercentageAfterTrip.toFixed(2),
              });
            });
            } else {
              // Se a viagem puder ser completada sem paradas
              this.alertasService.showInfo(
                'Status da Bateria',
                `Você pode completar a viagem sem paradas, chegando com ${batteryPercentageAfterTrip.toFixed(2)}% de bateria.`
              ).then(() => {
                this.dialogRef.close({
                  canCompleteTrip: true,
                  selectedVehicle: formValue.selectedVehicle,
                  batteryPercentageAfterTrip: batteryPercentageAfterTrip.toFixed(2),
                });
              });
            }
          } else {
            // Se a viagem não pode ser completada
            this.alertasService.showError(
              'Erro!',
              "Viagem não pode ser completada pela falta de postos no percurso" // Utiliza a mensagem retornada pelo cálculo
            );
          }
        }).catch(error => {
          console.error('Erro ao calcular os postos de carregamento:', error);
          this.alertasService.showError('Erro!', 'Não foi possível calcular os postos de carregamento.');
        });
      }
    } else {
      console.error("Formulário inválido");
      return;
    }
  }
  

  // Função para formatar o endereço
  formatAddress(address: string): string {
  const parts = address.split(','); // Divide a string em partes

  // Verifica se o endereço possui pelo menos 3 partes
  if (parts.length >= 3) {
    const street = parts[0].trim(); // Pega o nome da rua
    const cityState = parts[1].trim(); // Pega a cidade e o estado
    const country = parts[2].trim(); // Pega o país

    // Formata o endereço desejado
    return `${street}, ${cityState}, ${country}`;
  }

  // Se não houver partes suficientes, retorna o endereço original
  return address;
}

  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: [

        ]
      },
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
