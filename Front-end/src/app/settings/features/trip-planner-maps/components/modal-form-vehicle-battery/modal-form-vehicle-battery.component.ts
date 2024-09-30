import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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

@Component({
  selector: 'app-modal-form-vehicle-battery',
  templateUrl: './modal-form-vehicle-battery.component.html',
  styleUrl: './modal-form-vehicle-battery.component.scss'
})
export class ModalFormVehicleBatteryComponent {
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
    public dialogRef: MatDialogRef<ModalFormVehicleBatteryComponent>) {
    this.dataSource = new MatTableDataSource(this.userVehicleDetails);
  }

  ngOnInit() {
    this.buildForm();
    this.getListUserVehicles();
  }

  buildForm() {
    this.vehicleStatusBatteryForm = this.formBuilder.group({
      selectedVehicle: new FormControl(null, [Validators.required]),
      bateriaRestante: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$'), numberValidator]),
      saudeBateria: new FormControl(null, [Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$'), numberValidator])
    });
  }

  // Obtém a lista de veículos do usuário
  getListUserVehicles() {
    this.userVehicleService.getAllUserVehicle().subscribe({
      next: (response: IApiResponse<UserVehicle[]>) => {
        console.log('Response from getAllUserVehicle:', response);

        if (response && response.content && Array.isArray(response.content)) {
          this.userVehicleList = response.content;

          // Cria um array de observables para buscar detalhes dos veículos
          const vehicleDetailsObservables = this.userVehicleList.map(userVehicle =>
            this.vehicleService.getVehicleDetails(userVehicle.vehicleId).pipe(
              map((vehicle: Vehicle) => ({ vehicle, userVehicle }))
            )
          );

          // Usa forkJoin para esperar até que todas as requisições estejam completas
          forkJoin(vehicleDetailsObservables).subscribe((vehiclesWithUserVehicles) => {
            // Atualiza os dados com veículo e informações de UserVehicle
            this.userVehicleDetails = vehiclesWithUserVehicles.map(({ vehicle, userVehicle }) => {
              return {
                ...vehicle,
                userVehicle // Inclui o UserVehicle no veículo
              };
            });

            this.dataSource.data = this.userVehicleDetails;
            console.log(this.dataSource);
          });
        } else {
          console.error('Expected an array in response.content but got:', response.content);
        }
      },
      error: (err) => {
        console.error('Error fetching userVehicles:', err);
      }
    });
  }

  // Aplica o filtro na tabela
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: [
          {
            question: 'Como preencher a marca do veículo?',
            answer: 'No campo "Marca do veículo", digite o nome da marca. Se a marca já estiver cadastrada, sugestões aparecerão abaixo do campo. Selecione uma das opções para preencher automaticamente os campos de modelo e versão.'
          },
          {
            question: 'Como os campos de modelo e versão são preenchidos?',
            answer: 'Os campos "Modelo do veículo" e "Versão do veículo" serão preenchidos automaticamente após você selecionar uma marca. Certifique-se de revisar esses campos para garantir que as informações estão corretas.'
          },
          {
            question: 'O que devo inserir no campo "Bateria restante"?',
            answer: 'Neste campo, insira a porcentagem da carga da bateria restante, como "75" para 75%. Este campo é obrigatório para o cadastro do status da bateria.'
          },
          {
            question: 'Como preencher a "Saúde da bateria"?',
            answer: 'A "Saúde da bateria" deve ser inserida em um formato numérico que indica o estado geral da bateria, com valores entre 0 e 100, onde 100 representa uma bateria nova. Este campo é opcional.'
          },
          {
            question: 'O que acontece se eu deixar o campo "Bateria restante" em branco?',
            answer: 'Se você tentar adicionar o status da bateria sem preencher o campo "Bateria restante", um erro será exibido abaixo do campo, e a ação será bloqueada até que o campo obrigatório seja preenchido.'
          },
          {
            question: 'Como posso cancelar o cadastro?',
            answer: 'Para cancelar o cadastro e voltar à tela anterior, clique no botão "Cancelar". Isso descartará todas as informações que você digitou até o momento.'
          },
          {
            question: 'Quais campos são obrigatórios?',
            answer: 'O único campo obrigatório é "Bateria restante e marca". Os campos de modelo e versão e são preenchidos automaticamente, mas não são obrigatórios para a finalização do cadastro.'
          }
        ]
      },
    });
  }

  closeModal() {
    this.dialogRef.close(); // Fecha o modal
  }

}
