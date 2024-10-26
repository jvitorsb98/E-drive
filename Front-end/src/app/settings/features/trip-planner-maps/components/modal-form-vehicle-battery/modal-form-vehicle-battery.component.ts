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

/**
 * Componente modal para gerenciar o status da bateria do veículo.
 * Este componente permite que o usuário selecione um veículo e insira informações sobre a bateria.
 */
@Component({
  selector: 'app-modal-form-vehicle-battery',
  templateUrl: './modal-form-vehicle-battery.component.html',
  styleUrls: ['./modal-form-vehicle-battery.component.scss']
})
export class ModalFormVehicleBatteryComponent implements OnInit {
  vehicleStatusBatteryForm!: FormGroup; // Formulário para o status da bateria do veículo
  displayedColumns: string[] = ['icon', 'mark', 'model', 'version', 'choose']; // Colunas da tabela de veículos
  dataSource = new MatTableDataSource<IVehicleWithUserVehicle>(); // Fonte de dados para a tabela
  userVehicleList: UserVehicle[] = []; // Lista de veículos do usuário
  userVehicleDetails: IVehicleWithUserVehicle[] = []; // Detalhes dos veículos do usuário
  isStation: boolean = false; // Indica se o modal é para uma estação

  /**
   * Construtor do componente.
   * @param formBuilder Serviço para construção de formulários reativos.
   * @param userVehicleService Serviço para manipulação de veículos do usuário.
   * @param vehicleService Serviço para manipulação de veículos.
   * @param dialog Serviço de diálogo do Angular Material.
   * @param cdr Detector de mudanças para atualizar a UI.
   * @param alertasService Serviço para exibir alertas.
   * @param tripPlannerMapsService Serviço para planejamento de viagens.
   * @param dialogRef Referência ao diálogo atual.
   * @param data Dados passados ao abrir o modal.
   */
  constructor(
    private formBuilder: FormBuilder,
    private userVehicleService: UserVehicleService,
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private alertasService: AlertasService,
    private tripPlannerMapsService: TripPlannerMapsService,
    public dialogRef: MatDialogRef<ModalFormVehicleBatteryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { stepsArray: Step[]; place: any; isStation: boolean }
  ) {
    this.dataSource = new MatTableDataSource(this.userVehicleDetails); // Inicializa a fonte de dados da tabela
  }

  /**
   * Método chamado na inicialização do componente.
   * Constrói o formulário e carrega os dados necessários.
   */
  ngOnInit() {
    this.buildForm(); // Constrói o formulário
    this.populateForm(); // Preenche o formulário com dados existentes
    this.getListUserVehicles(); // Obtém a lista de veículos do usuário
  }

  /**
   * Constrói o formulário reativo para o status da bateria do veículo.
   */
  buildForm() {
    this.vehicleStatusBatteryForm = this.formBuilder.group({
      selectedVehicle: new FormControl(null, [Validators.required]), // Veículo selecionado (obrigatório)
      bateriaRestante: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$'), numberValidator]), // Bateria restante (obrigatório)
      saudeBateria: new FormControl(null, [Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$'), numberValidator]) // Saúde da bateria (opcional)
    });
  }

  /**
   * Preenche o formulário com os dados existentes passados ao modal.
   */
  populateForm() {
    this.vehicleStatusBatteryForm.patchValue({
      selectedVehicle: this.data.place.selectedVehicle || null,
      bateriaRestante: this.data.place.bateriaRestante || null,
      saudeBateria: this.data.place.saudeBateria || null,
    });
  }

  /**
   * Obtém a lista de veículos do usuário e filtra apenas os ativados.
   */
  getListUserVehicles() {
    this.userVehicleService.getAllUserVehicle().subscribe({
      next: (response: IApiResponse<UserVehicle[]>) => {
        if (response?.content && Array.isArray(response.content)) {
          this.userVehicleList = response.content.filter(vehicle => vehicle.activated === true); // Filtra os veículos ativados
          console.log("Lista de veículos ativados do usuário:", this.userVehicleList);
          this.loadVehicleDetails(); // Carrega os detalhes dos veículos
        } else {
          console.error('Expected an array in response.content but got:', response.content);
        }
      },
      error: (err) => {
        console.error('Error fetching userVehicles:', err); // Loga erro ao buscar veículos do usuário
      }
    });
  }

  /**
   * Carrega os detalhes dos veículos associados ao usuário.
   */
  loadVehicleDetails() {
    const vehicleDetailsObservables = this.userVehicleList.map(userVehicle =>
      this.vehicleService.getVehicleDetails(userVehicle.vehicleId).pipe(
        map((vehicle: Vehicle) => ({ vehicle, userVehicle })) // Mapeia os detalhes dos veículos
      )
    );

    forkJoin(vehicleDetailsObservables).subscribe((vehiclesWithUserVehicles) => {
      this.userVehicleDetails = vehiclesWithUserVehicles.map(({ vehicle, userVehicle }) => ({
        ...vehicle,
        userVehicle
      }));

      this.dataSource.data = this.userVehicleDetails; // Atualiza a fonte de dados da tabela
      console.log("Detalhes dos veículos carregados:", this.userVehicleDetails);

      if (this.userVehicleDetails.length === 1) {
        this.vehicleStatusBatteryForm.patchValue({
          selectedVehicle: this.userVehicleDetails[0] // Seleciona automaticamente se houver apenas um veículo
        });

        setTimeout(() => {
          const inputElement = document.querySelector('input[formControlName="bateriaRestante"]');
          console.log(inputElement);
          (inputElement as HTMLInputElement).focus(); // Foca no campo de bateria restante
        }, 100);
      }
    });
  }

  /**
   * Aplica um filtro à tabela com base na entrada do usuário.
   * @param event Evento disparado pela entrada do filtro.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Aplica o filtro

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Retorna à primeira página se houver paginação
    }
    console.log("Filtro aplicado:", filterValue);
  }

  /**
   * Envia o status da bateria após validações no formulário.
   */
  submitBatteryStatus() {
    if (this.vehicleStatusBatteryForm.valid) {
      const formValue = this.vehicleStatusBatteryForm.value;
      const remainingBattery = Number(formValue.bateriaRestante);
      let batteryHealth = Number(formValue.saudeBateria);

      if (this.data.isStation) {
        const { canCompleteTrip, batteryPercentageAfterTrip } = this.tripPlannerMapsService.calculateBatteryStatus(
          formValue.selectedVehicle,
          remainingBattery,
          batteryHealth,
          this.data.stepsArray
        );

        if (!canCompleteTrip) {
          this.alertasService.showError('Erro!', 'A viagem não pode ser realizada. Bateria insuficiente.'); // Alerta de erro se a viagem não pode ser completada
          return;
        }

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
      } else {
        // Modo de planejamento de viagem
        this.tripPlannerMapsService.calculateChargingStations(
          formValue.selectedVehicle,
          remainingBattery,
          batteryHealth,
          this.data.stepsArray
        ).then(({ chargingStationsMap, canCompleteTrip, canCompleteWithoutStops, batteryPercentageAfterTrip }) => {
          if (canCompleteTrip) {
            if (!canCompleteWithoutStops) {
              // Define os cabeçalhos da tabela
              const headers = ['Nome do Posto', 'Endereço', 'Porcentagem de Bateria'];

              // Cria as linhas da tabela com os dados dos postos de carregamento
              const rows = Array.from(chargingStationsMap.entries()).map(([posto, currentBatteryPercentage]) => {
                const displayName = posto.name.toLowerCase() === "estação de carregamento para veículos elétricos".toLowerCase() ? "Posto" : posto.name;
            
                // Extraindo o endereço e removendo o CEP e o país
                const addressParts = posto.formatted_address.split(','); 
                const filteredAddress = addressParts.slice(0, -2).join(',').trim(); // Remove as últimas duas partes (CEP e país)
            
                return [
                    displayName,
                    filteredAddress,
                    `${currentBatteryPercentage.toFixed(2)}%`,
                ];
            });
            


            const message = `Você precisará passar por ${chargingStationsMap.size} posto${chargingStationsMap.size > 1 ? 's' : ''}
             de carregamento para chegar ao destino com ${batteryPercentageAfterTrip.toFixed(2)}% de bateria.`;

              // Exibe o alerta com a tabela
              this.alertasService.showTableAlert(message, headers, rows).then(() => {
                this.dialogRef.close({
                  canCompleteTrip: true,
                  chargingStations: chargingStationsMap.keys(),
                  selectedVehicle: formValue.selectedVehicle,
                  batteryPercentageAfterTrip: batteryPercentageAfterTrip.toFixed(2),
                });
              });
            } else {
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
            this.alertasService.showError(
              'Erro!',
              "Viagem não pode ser completada pela falta de postos no percurso"
            );
          }
        }).catch(error => {
          console.error('Erro ao calcular os postos de carregamento:', error);
          this.alertasService.showError('Erro!', 'Não foi possível calcular os postos de carregamento.');
        });
      }
    } else {
      console.error("Formulário inválido"); // Loga erro se o formulário for inválido
      return;
    }
  }

  /**
   * Abre um modal com perguntas frequentes relacionadas ao status da bateria do veículo.
   */
  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: []
      },
    });
  }

  /**
   * Fecha o modal atual.
   */
  closeModal() {
    this.dialogRef.close();
  }
}