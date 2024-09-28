import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserVehicle } from '../../../../core/models/user-vehicle';
import { IVehicleWithUserVehicle } from '../../../../core/models/vehicle-with-user-vehicle';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { UserDataService } from '../../../../core/services/user/userdata/user-data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IApiResponse } from '../../../../core/models/api-response';
import { Vehicle } from '../../../../core/models/vehicle';
import { catchError, forkJoin, map, of } from 'rxjs';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { numberValidator } from '../../../../shared/validators/number-validator';
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component';

@Component({
  selector: 'app-modal-setup-trip',
  templateUrl: './modal-setup-trip.component.html',
  styleUrl: './modal-setup-trip.component.scss'
})
export class ModalSetupTripComponent {
  vehicleStatusBatteryForm!: FormGroup;
  displayedColumns: string[] = ['icon', 'mark', 'model', 'version', 'choose'];
  dataSource = new MatTableDataSource<IVehicleWithUserVehicle>();
  userVehicleList: UserVehicle[] = [];
  userVehicleDetails: IVehicleWithUserVehicle[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private userVehicleService: UserVehicleService,
    private vehicleService: VehicleService,
    private userDataService: UserDataService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalSetupTripComponent>) {
    this.dataSource = new MatTableDataSource(this.userVehicleDetails);
  }

  ngOnInit() {
    this.buildForm();
    this.getListUserVehicles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
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

  // Deleta um veículo do usuário
  deleteUserVehicle(vehicleData: IVehicleWithUserVehicle) {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja realmente deletar o veículo? Esta ação não poderá ser desfeita.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#19B6DD',
      cancelButtonColor: '#ff6b6b',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deletando veículo:', vehicleData);
        this.userVehicleService.deleteUserVehicle(vehicleData.userVehicle.id).pipe(
          catchError(() => {
            Swal.fire({
              title: 'Erro!',
              icon: 'error',
              text: 'Ocorreu um erro ao deletar o veículo. Tente novamente mais tarde.',
              showConfirmButton: true,
              confirmButtonColor: 'red',
            });
            return of(null);
          })
        ).subscribe(() => {
          Swal.fire({
            title: 'Sucesso!',
            icon: 'success',
            text: 'O veículo foi deletado com sucesso!',
            showConfirmButton: true,
            confirmButtonColor: '#19B6DD',
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              this.getListUserVehicles();
            }
          });
        });
      }
    });
  }

  // Formata os dados do veículo
  formatVehicleData(vehicle: Vehicle): Vehicle {
    Todo: // verificar se é necessário manter essa função
    vehicle.model.name = this.userDataService.capitalizeWords(vehicle.model.name);
    vehicle.version = this.userDataService.capitalizeWords(vehicle.version);
    vehicle.motor = this.userDataService.capitalizeWords(vehicle.motor);
    vehicle.type.name = this.userDataService.getVehicleTypeDisplay(vehicle.type.name);
    return vehicle;
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