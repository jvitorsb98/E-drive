// Modelos de dados utilizados no componente
import { UserVehicle } from './../../../../core/models/user-vehicle';
import { Vehicle } from '../../../../core/models/vehicle';
import { IApiResponse } from '../../../../core/models/api-response';
import { IVehicleWithUserVehicle } from '../../../../core/models/vehicle-with-user-vehicle';
import { Step } from '../../../../core/models/step';
import { PaginatedResponse } from '../../../../core/models/paginatedResponse';

// Importações principais do Angular
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Serviços do Angular Material relacionados a modais e tabelas
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Serviços personalizados utilizados pelo componente
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { TripPlannerMapsService } from '../../../../core/services/trip-planner-maps/trip-planner-maps.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';

// Componentes e validadores personalizados
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component';
import { numberValidator } from '../../../../shared/validators/number-validator';

// Operadores RxJS para manipulação de observables
import { catchError, forkJoin, map, of } from 'rxjs';
import { BatteryService } from '../../../../core/services/trip-planner-maps/baterry/battery.service';


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

  // config de paginacao e ordenacao da tabela
  totalVehicles: number = 0; // Total de enderecos disponíveis
  pageIndex: number = 0; // Índice da página atual
  pageSize: number = 3; // Tamanho da página
  currentPage: number = 0; // Página atual
  isFilterActive: boolean = false; // Indica se o filtro está ativo
  filteredData: IVehicleWithUserVehicle[] = []; // Dados filtrados
  searchKey: any; // Chave de busca para filtro

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
    private batteryService: BatteryService,
    private alertasService: AlertasService,
    private tripPlannerMapsService: TripPlannerMapsService,
    public dialogRef: MatDialogRef<ModalFormVehicleBatteryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { stepsArray: Step[]; place: any; isStation: boolean }
  ) {
    this.dataSource = new MatTableDataSource(this.userVehicleDetails); // Inicializa a fonte de dados da tabela
  }

  /**
 * @description Inicializa o componente, construindo o formulário, preenchendo-o com dados
 * existentes e obtendo a lista de veículos do usuário.
 */
  ngOnInit() {
    this.buildForm(); // Constrói o formulário
    this.populateForm(); // Preenche o formulário com dados existentes
    this.getListUserVehicles(); // Obtém a lista de veículos do usuário
  }

  /**
 * @description Constrói o formulário `vehicleStatusBatteryForm` com campos para o veículo selecionado,
 * bateria restante e saúde da bateria, aplicando as validações necessárias.
 * 
 * - `selectedVehicle`: Campo obrigatório que exige a seleção de um veículo.
 * - `bateriaRestante`: Campo obrigatório que aceita apenas números entre 0 e 100.
 * - `saudeBateria`: Campo opcional que aceita apenas números entre 0 e 100.
 */
  buildForm() {
    this.vehicleStatusBatteryForm = this.formBuilder.group({
      selectedVehicle: new FormControl(null, [Validators.required]), // Veículo selecionado (obrigatório)
      bateriaRestante: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$'), numberValidator]), // Bateria restante (obrigatório)
      saudeBateria: new FormControl(null, [Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$'), numberValidator]) // Saúde da bateria (opcional)
    });
  }

  /**
  * @description Preenche o formulário `vehicleStatusBatteryForm` com os dados existentes do veículo, 
  * como o veículo selecionado, a bateria restante e a saúde da bateria. 
  * Utiliza `patchValue` para atualizar apenas os campos especificados.
  */
  populateForm() {
    this.vehicleStatusBatteryForm.patchValue({
      selectedVehicle: this.data.place.selectedVehicle || null, // Veículo selecionado ou `null` se não houver dados
      bateriaRestante: this.data.place.bateriaRestante || null, // Bateria restante ou `null` se não houver dados
      saudeBateria: this.data.place.saudeBateria || null // Saúde da bateria ou `null` se não houver dados
    });
  }

  /**
 * @description Obtém a lista de veículos do usuário a partir do serviço `userVehicleService`. 
 * Filtra a lista para incluir apenas veículos ativados e carrega os detalhes dos veículos.
 * Loga mensagens no console para monitoramento e tratamento de erros.
 *
 * @param {IApiResponse<UserVehicle[]>} response - Resposta da API contendo uma lista de veículos do usuário.
 * @param {any} err - Objeto de erro retornado em caso de falha na requisição.
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
 * @description Carrega os detalhes dos veículos para cada `userVehicle` na lista `userVehicleList`. 
 * Utiliza `forkJoin` para realizar chamadas paralelas e atualiza a fonte de dados da tabela com os 
 * detalhes dos veículos. Se houver apenas um veículo, seleciona-o automaticamente e foca no campo 
 * de bateria restante.
 *
 * @param {Array<Observable<{ vehicle: Vehicle, userVehicle: UserVehicle }>>} vehicleDetailsObservables - 
 * Observáveis que contêm os detalhes de cada veículo associados a `userVehicle`.
 * @param {Array<{ vehicle: Vehicle, userVehicle: UserVehicle }>} vehiclesWithUserVehicles - Resultado 
 * da combinação de observáveis, contendo detalhes do veículo e dados do `userVehicle`.
 */
  loadVehicleDetails() {
    const vehicleDetailsObservables = this.userVehicleList.map(userVehicle =>
      this.vehicleService.getVehicleDetails(userVehicle.vehicleId).pipe(
        map((vehicle: Vehicle) => ({ vehicle, userVehicle })) // Mapeia os detalhes dos veículos
      )
    );

    // Atualiza a lista de detalhes dos veículos com dados combinados
    forkJoin(vehicleDetailsObservables).subscribe((vehiclesWithUserVehicles) => {
      this.userVehicleDetails = vehiclesWithUserVehicles.map(({ vehicle, userVehicle }) => ({
        ...vehicle,
        userVehicle
      }));

      // Atualiza a fonte de dados da tabela com os detalhes dos veículos
      this.dataSource.data = this.userVehicleDetails;
      console.log("Detalhes dos veículos carregados:", this.userVehicleDetails);

      if (this.userVehicleDetails.length === 1) {
        this.vehicleStatusBatteryForm.patchValue({
          selectedVehicle: this.userVehicleDetails[0] // Seleciona automaticamente se houver apenas um veículo
        });

        // Foca no campo de bateria restante após um pequeno atraso
        setTimeout(() => {
          const inputElement = document.querySelector('input[formControlName="bateriaRestante"]');
          console.log(inputElement);
          (inputElement as HTMLInputElement).focus(); // Foca no campo de bateria restante
        }, 100);
      }
    });
  }

  /**
  * @description Aplica um filtro de pesquisa na lista de veículos do usuário. Obtém veículos do serviço, 
  * filtra por veículos ativados, e busca detalhes adicionais dos veículos. Atualiza a fonte de dados da 
  * tabela com os resultados filtrados. Em caso de erro, exibe uma mensagem de erro.
  *
  * @param {Event} event - Evento do input utilizado para capturar o valor do filtro.
  */
  applyFilter(event: Event) {
    try {
      this.isFilterActive = true; // Marca que o filtro está ativo
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.searchKey = event;

      // Reseta para a primeira página do paginator
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }

      // Chama o serviço para obter todos os veículos do usuário
      this.userVehicleService.listAll(0, this.totalVehicles)
        .pipe(
          catchError((error) => {
            this.alertasService.showError("Erro !!", error.message);
            return of([]); // Retorna um array vazio em caso de erro
          })
        )
        .subscribe((response: PaginatedResponse<UserVehicle> | never[]) => {
          if (Array.isArray(response)) {
            // Verifica se o retorno é um array vazio
            if (response.length === 0) {
              this.dataSource.data = [];
              return;
            }
          } else {
            //TODO - melhorar esse filtro
            this.userVehicleList = response.content;

            // Filtra os veículos que estão ativados
            const activeVehicles = this.userVehicleList.filter(vehicle => vehicle.activated);

            // Cria um array de observables para buscar detalhes dos veículos ativados
            const vehicleDetailsObservables = activeVehicles.map(userVehicle =>
              this.vehicleService.getVehicleDetails(userVehicle.vehicleId).pipe(
                map((vehicle: Vehicle) => ({ vehicle, userVehicle }))
              )
            );

            //  Usa forkJoin para esperar até que todas as requisições estejam completas
            forkJoin(vehicleDetailsObservables).subscribe((vehiclesWithUserVehicles) => {
              // Atualiza os dados com veículo e informações de UserVehicle
              this.userVehicleDetails = vehiclesWithUserVehicles.map(({ vehicle, userVehicle }) => {
                return {
                  ...vehicle,
                  userVehicle // Inclui o UserVehicle no veículo
                };
              });

              // Filtra os dados para verificar correspondência com o valor do filtro
              this.filteredData = this.userVehicleDetails.filter(vehicle =>
                vehicle.model.name.toLowerCase().includes(filterValue) ||
                vehicle.version.toLowerCase().includes(filterValue) ||
                vehicle.model.brand.name.toLowerCase().includes(filterValue));

              // Atualiza a tabela com os dados filtrados ou limpa se nenhum resultado for encontrado
              if (this.filteredData.length > 0) {
                this.dataSource.data = this.filteredData;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              } else {
                this.dataSource.data = [];
              }
            });
          }
        });
    } catch (error: any) {
      this.alertasService.showError("Erro !!", error.message);
    }
  }

  /**
   * @description Processa o status da bateria com base nos valores do formulário e no modo de operação (estação ou planejamento de viagem).
   * Se o veículo está em uma estação, verifica a possibilidade de completar a viagem. No modo de planejamento, calcula
   * as estações de carregamento necessárias para completar a viagem com a bateria atual e exibe os detalhes ao usuário.
   *
   * @returns {void}
   */
  submitBatteryStatus() {
    if (this.vehicleStatusBatteryForm.valid) {
      const formValue = this.vehicleStatusBatteryForm.value;
      const remainingBattery = Number(formValue.bateriaRestante);
      let batteryHealth = Number(formValue.saudeBateria);

      // Verifica se o modo é "estação" e se a saúde da bateria não foi informada (assume 100%)
      if (this.data.isStation) {
        const { canCompleteTrip, batteryPercentageAfterTrip } = this.batteryService.calculateBatteryStatus(
          formValue.selectedVehicle,
          remainingBattery,
          batteryHealth,
          this.data.stepsArray
        );

        // Exibe um alerta de erro se a viagem não puder ser completada
        if (!canCompleteTrip) {
          this.alertasService.showError('Erro!', 'A viagem não pode ser realizada. Bateria insuficiente.'); // Alerta de erro se a viagem não pode ser completada
          return;
        }

        // Informa o usuário do status da bateria ao final da viagem
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

              // Exibe o alerta com a tabela de postos de carregamento
              this.alertasService.showTableAlert(message, headers, rows).then(() => {
                this.dialogRef.close({
                  canCompleteTrip: true,
                  chargingStations: chargingStationsMap.keys(),
                  selectedVehicle: formValue.selectedVehicle,
                  batteryPercentageAfterTrip: batteryPercentageAfterTrip.toFixed(2),
                });
              });
            } else {

              // Informa que a viagem pode ser completada sem paradas
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

            // Exibe um alerta de erro se a viagem não puder ser completada devido à falta de postos de carregamento
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
   *  @description Abre um modal com perguntas frequentes relacionadas ao status da bateria do veículo.
   */
  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: []
      },
    });
  }

  /**
   *  @description Fecha o modal atual.
   */
  closeModal() {
    this.dialogRef.close();
  }
}