import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';
import { IApiResponse } from '../../../../core/models/api-response';
import { UserVehicle } from '../../../../core/models/user-vehicle';
import { forkJoin, map, Observable, of, startWith } from 'rxjs';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { Vehicle } from '../../../../core/models/vehicle';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { IVehicleDetails } from '../../../../core/models/vehicleDetails';
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component';
import { numberValidator } from '../../../../shared/validators/number-validator';

@Component({
  selector: 'app-modal-form-vehicle-battery',
  templateUrl: './modal-form-vehicle-battery.component.html',
  styleUrl: './modal-form-vehicle-battery.component.scss'
})
export class ModalFormVehicleBatteryComponent {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger; // Referência ao gatilho do autocomplete
  vehicleStatusBatteryForm!: FormGroup;
  userVehicleList: UserVehicle[] = [];
  userVehicleDetails: IVehicleDetails[] = [];
  brands: { name: string; id: number }[] = [];
  filteredBrands: Observable<{ name: string, id: number }[]> = of([]);

  constructor(
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private userVehicleService: UserVehicleService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalFormVehicleBatteryComponent>) { }

  ngOnInit(): void {
    this.getListUserVehicles();
    this.buildForm();
    this.setupAutocomplete();
  }

  buildForm() {
    this.vehicleStatusBatteryForm = this.formBuilder.group({
      brand: new FormControl(null, [Validators.required]),
      model: new FormControl({ value: '', disabled: true }), // Campo desabilitado
      version: new FormControl({ value: '', disabled: true }), // Campo desabilitado
      bateriaRestante: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$'), numberValidator]),
      saudeBateria: new FormControl(null, [Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*$'), numberValidator])
    });
  }

  setupAutocomplete() {
    this.filteredBrands = this.vehicleStatusBatteryForm.get('brand')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => {
        const filteredDetails = name ? this.filterBrands(name) : this.userVehicleDetails.slice();

        // Atribui os detalhes filtrados à variável brands
        this.brands = filteredDetails.map(detail => ({
          name: detail.vehicleBrand,
          id: detail.userVehicle.id
        }));

        // Retorna o array de marcas para o autocomplete
        return this.brands;
      })
    );
  }

  // Função de filtragem
  private filterBrands(name: string): IVehicleDetails[] {
    const filterValue = name.toLowerCase();
    return this.userVehicleDetails.filter(option => option.vehicleBrand.toLowerCase().includes(filterValue));
  }

  getListUserVehicles() {
    this.userVehicleService.getAllUserVehicle().subscribe({
      next: (response: IApiResponse<UserVehicle[]>) => {
        if (response && response.content && Array.isArray(response.content)) {
          this.userVehicleList = response.content;
          this.fetchVehicleDetails(this.userVehicleList);
        } else {
          console.error('Expected an array in response.content but got:', response.content);
        }
      },
      error: (err) => {
        console.error('Error fetching userVehicles:', err);
      }
    });
  }

  fetchVehicleDetails(userVehicleList: UserVehicle[]) {
    const vehicleDetailsObservables = userVehicleList.map(userVehicle =>
      this.vehicleService.getVehicleDetails(userVehicle.vehicleId)
    );

    forkJoin(vehicleDetailsObservables).subscribe((vehicleDetails: Vehicle[]) => {
      this.userVehicleDetails = this.combineUserVehicleAndDetails(userVehicleList, vehicleDetails);
      this.setupAutocomplete(); // Configurar o autocomplete após obter os detalhes do veículo
    });
  }

  combineUserVehicleAndDetails(userVehicles: UserVehicle[], vehicles: Vehicle[]): IVehicleDetails[] {
    return userVehicles.map((userVehicle, index) => {
      const vehicle = vehicles[index];
      return {
        vehicleModel: vehicle.model.name,       // Adiciona o modelo do veículo
        vehicleVersion: vehicle.version,         // Adiciona a versão do veículo
        vehicleBrand: vehicle.model.brand.name,  // Adiciona a marca do veículo
        userVehicle                             // Inclui o UserVehicle completo
      };
    });
  }

  onBrandSelected(event: MatAutocompleteSelectedEvent) {
    const selectedBrand = event.option.value;
    this.vehicleStatusBatteryForm.get('brand')?.setValue(selectedBrand.name);
    // Preencher os modelos e versões com base na marca selecionada
    const selectedUserVehicle = this.userVehicleDetails.find(userVehicle => userVehicle.vehicleBrand === selectedBrand.name);

    if (selectedUserVehicle) {
      this.vehicleStatusBatteryForm.patchValue({
        brand: selectedBrand.name, // Armazenando apenas o nome da marca
        model: selectedUserVehicle.vehicleModel,
        version: selectedUserVehicle.vehicleVersion
      });
    } else {
      // Se a marca selecionada não tiver um veículo associado, você pode querer lidar com isso
      this.vehicleStatusBatteryForm.patchValue({
        model: null,
        version: null
      });
    }
  }

  // Alterna a abertura do painel de autocomplete
  toggleAutocomplete(event: Event) {
    event.stopPropagation(); // Impede que o clique cause conflito com o foco do input
    if (this.autocompleteTrigger.panelOpen) {
      this.autocompleteTrigger.closePanel();
    } else {
      this.autocompleteTrigger.openPanel();
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
