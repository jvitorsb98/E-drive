
// Importa os modelos necessários
import { UserVehicle } from '../../../../core/models/user-vehicle';
import { Vehicle } from '../../../../core/models/vehicle';

// Importa os serviços necessários
import { BrandService } from '../../../../core/services/brand/brand.service';
import { ModelService } from '../../../../core/services/model/model.service';
import { VehicleService } from '../../../../core/services/vehicle/vehicle.service';
import { UserDataService } from '../../../../core/services/user/userdata/user-data.service';
import { UserVehicleService } from '../../../../core/services/user/uservehicle/user-vehicle.service';

// Importa os módulos do Angular
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

// Importa o Swal para alertas
import Swal from 'sweetalert2';
import { FaqPopupComponent } from '../../../../core/fragments/faq-popup/faq-popup.component';
import { CategoryService } from '../../../../core/services/category/category.service';
import { CategoryAvgAutonomyStatsService } from '../../../../core/services/category-avg-autonomy-stats-service/category-avg-autonomy-stats.service';
import { DataCategoryAvgAutonomyStats } from '../../../../core/models/DataCategoryAvgAutonomyStats';
import { Brand } from '../../../../core/models/brand';

@Component({
  selector: 'app-modal-form-vehicle',
  templateUrl: './modal-form-vehicle.component.html',
  styleUrls: ['./modal-form-vehicle.component.scss']
})
export class ModalFormVehicleComponent implements OnInit {

  // Referência para o painel de autocomplete
  @ViewChild('brandInput', { read: MatAutocompleteTrigger }) autoBrandTrigger!: MatAutocompleteTrigger;
  @ViewChild('modelInput', { read: MatAutocompleteTrigger }) autoModelTrigger!: MatAutocompleteTrigger;
  @ViewChild('versionInput', { read: MatAutocompleteTrigger }) autoVersionTrigger!: MatAutocompleteTrigger;

  userVehicle!: UserVehicle;
  vehicle!: Vehicle
  userVehicleForm!: FormGroup;
  selectedVehicle: Vehicle | null = null;
  isAutonomyDataMissing = false;  // Variável para controlar a exibição do alerta
  editVehicle: boolean = false; // Variável para controlar a exibição do h1 do modal
  isAutonomyGeneratedByAverage: boolean = false;

  brands: { name: string; id: number }[] = [];
  models: { name: string; id: number }[] = [];
  vehicles: Vehicle[] = []; // Store fetched vehicles

  filteredBrands: Observable<{ name: string; id: number }[]> = of([]);
  filteredModels: Observable<{ name: string }[]> = of([]);
  filteredVersions: Observable<Vehicle[]> = of([]); // Now filtering vehicles based on version name

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private modelService: ModelService,
    private vehicleService: VehicleService,
    private userDataService: UserDataService,
    private dialog: MatDialog, // Serviço para abrir modais
    private userVehicleService: UserVehicleService,
    private categoryService: CategoryService, // Adicione o serviço
    private categoryAvgAutonomyStatsService: CategoryAvgAutonomyStatsService,
    public dialogRef: MatDialogRef<ModalFormVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle, userVehicle: UserVehicle },
  ) { }

  ngOnInit() {
    this.initializeData();
    this.loadBrands();
    this.buildForm();
    this.setupAutocomplete();
  }

  buildForm() {
    this.userVehicleForm = this.formBuilder.group({
      version: [{ value: null, disabled: this.isEditMode() }, Validators.required],
      brand: [{ value: null, disabled: this.isEditMode() }, Validators.required],
      model: [{ value: null, disabled: this.isEditMode() }, Validators.required],
      batteryCapacity: [null, [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      mileagePerLiterRoad: [null, [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      mileagePerLiterCity: [null, [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      consumptionEnergetic: [null, [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      autonomyElectricMode: [null, [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    }
    );
    console.log('Validadores do formulário:', this.userVehicleForm.errors);

    if (this.data.userVehicle && this.data.vehicle) {
      this.editVehicle = true;
      this.fillForm();
    } else {
      console.warn('@Inject(MAT_DIALOG_DATA) public data Dados estão incompletos:', this.data);
    }
  }

  loadAverageAutonomy(selectedVehicle: Vehicle) {
    const category = selectedVehicle.category; // Ou como você obtém a categoria do veículo

    this.categoryAvgAutonomyStatsService.getAvgAutonomyStats(category.id).subscribe({
      next: (averageStats: DataCategoryAvgAutonomyStats) => {
        console.log(selectedVehicle)
        this.userVehicleForm.patchValue({
          autonomyElectricMode: averageStats.avgAutonomyElectricMode,
          batteryCapacity: Number((( Number(this.userVehicleForm.get('consumptionEnergetic')?.value) / 3.6) * averageStats.avgAutonomyElectricMode ).toFixed(2))
        });
        this.isAutonomyGeneratedByAverage = true;
      },
      error: (error) => {
        console.error('Erro ao carregar a média de autonomia:', error);
      }
    });
  }

  //Preenche o formulário com os dados do veículo para edição
  fillForm() {
    if (this.data.vehicle && this.data.vehicle.autonomy) {
      this.userVehicleForm.patchValue({
        version: this.data.vehicle.version,
        brand: this.data.vehicle.model.brand.name,
        model: this.data.vehicle.model.name,
        mileagePerLiterRoad: this.data.userVehicle.mileagePerLiterRoad,
        mileagePerLiterCity: this.data.userVehicle.mileagePerLiterCity,
        consumptionEnergetic: this.data.userVehicle.consumptionEnergetic,
        autonomyElectricMode: this.data.userVehicle.autonomyElectricMode,
        batteryCapacity: this.data.userVehicle.batteryCapacity
      });


      console.log('Formulário preenchido com:', this.userVehicleForm.value);
    } else {
      console.warn('Dados do veículo ou autonomia não encontrados para preenchimento.');
    }
  }

  /**
* @description Carrega a lista de marcas disponíveis do serviço BrandService.
*
* Este método faz uma requisição para obter todas as marcas disponíveis, filtra apenas as marcas
* que estão ativas e formata os dados para um formato que inclui o nome e o ID da marca.
* Após carregar as marcas, configura o filtro para permitir a seleção no autocomplete.
*
* @returns {void}
*/
  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (brands: Brand[]) => {
        // Filtra e mapeia marcas ativas
        this.brands = brands
          .filter((brand: Brand) => brand.activated) // Filtra marcas ativas
          .map((brand: Brand) => ({ name: brand.name, id: brand.id })); // Mapeia os dados para o formato esperado
        this.setupAutocomplete(); // Reconfigure the autocomplete with the loaded data
      },
      error: (error) => {
        console.error('Erro ao carregar as marcas', error); // Loga o erro no console
      }
    });
  }

  loadModels(brandId: number) {
    this.modelService.getModelsByBrandId(brandId).subscribe({
      next: (response: any) => {
        const models = response.content || [];
        console.log('Models loaded:', response);

        if (Array.isArray(models)) {
          this.models = models
          .filter(model => model.activated) // Filtra apenas modelos ativos
          .map(model => ({
            name: this.userDataService.capitalizeWords(model.name),
            id: model.id,
            brandId: model.brand.id
          }));
          this.setupAutocomplete(); // Reconfigure the autocomplete with the loaded data
        } else {
          console.error('Expected an array but got:', models);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar os modelos', error);
      }
    });
  }

  loadVehiclesByModel(modelId: number) {
    this.vehicleService.getVehiclesByModel(modelId).subscribe({
      next: (response: any) => {
        const vehicles = response.content || [];

        if (Array.isArray(vehicles)) {
          this.vehicles = vehicles
          .filter(vehicle => vehicle.activated) // Filtra apenas veículos ativos
          .map(vehicle => ({
            ...vehicle,
            version: this.userDataService.capitalizeWords(vehicle.version),
          }));

          this.setupAutocomplete(); // Reconfigure autocomplete with the filtered vehicle list
        } else {
          console.error('Expected an array but got:', vehicles);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar os veículos', error);
      }
    });
  }

  setupAutocomplete() {
    this.filteredBrands = this.userVehicleForm.get('brand')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value?.name || '');
        return this._filter(this.brands, filterValue);
      })
    );

    this.filteredModels = this.userVehicleForm.get('model')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value?.name || '');
        return this._filter(this.models, filterValue);
      })
    );

    this.filteredVersions = this.userVehicleForm.get('version')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value : (value || '');
        return this._filter(this.vehicles, filterValue, 'version');
      })
    );
  }

  private _filter<T extends { version?: string, name?: string }>(array: T[], value: any, field: 'version' | 'name' = 'name'): T[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return array.filter(item => item[field]?.toLowerCase().includes(filterValue));
  }

  onBrandSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedBrand = event.option.value;
    this.userVehicleForm.get('brand')?.setValue(selectedBrand.name);

    if (selectedBrand.id) {
      this.loadModels(selectedBrand.id);
    }
  }

  onModelSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedModel = event.option.value;
    this.userVehicleForm.get('model')?.setValue(selectedModel.name);

    if (selectedModel.id) {
      this.loadVehiclesByModel(selectedModel.id);
    }
  }

  private calculateBatteryCapacity(consumptionEnergetic: number, autonomyElectricMode: number): string | null {
    if (consumptionEnergetic != null && autonomyElectricMode != null) {
      const capacity = (consumptionEnergetic * autonomyElectricMode) / 3.6;
      return capacity.toFixed(2); // Formata o número com 2 casas decimais
    }
    return null
  }

  onVersionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedVehicle = event.option.value as Vehicle;
    this.selectedVehicle = selectedVehicle;
    if (selectedVehicle.id) {
      this.userVehicleForm.get('version')?.setValue(selectedVehicle.version);
      this.userVehicleForm.get('mileagePerLiterRoad')?.setValue(selectedVehicle.autonomy.mileagePerLiterRoad);
      this.userVehicleForm.get('mileagePerLiterCity')?.setValue(selectedVehicle.autonomy.mileagePerLiterCity);
      this.userVehicleForm.get('consumptionEnergetic')?.setValue(selectedVehicle.autonomy.consumptionEnergetic);
      this.userVehicleForm.get('autonomyElectricMode')?.setValue(selectedVehicle.autonomy.autonomyElectricMode);
    }


    if (selectedVehicle.autonomy.autonomyElectricMode == null) {
      this.loadAverageAutonomy(selectedVehicle);
    }else{
      this.userVehicleForm.patchValue({
        batteryCapacity: Number((( Number(this.userVehicleForm.get('consumptionEnergetic')?.value) / 3.6) * selectedVehicle.autonomy.autonomyElectricMode ).toFixed(2))
      });
    }


    this.isAutonomyDataMissing = !(
      selectedVehicle.autonomy.mileagePerLiterRoad &&
      selectedVehicle.autonomy.mileagePerLiterCity &&
      selectedVehicle.autonomy.consumptionEnergetic &&
      selectedVehicle.autonomy.autonomyElectricMode
    );


  }

  submitForm() {
    if (this.data && this.data.userVehicle) {
      console.log('Dados do veículo:', this.data.userVehicle);
      const formData = this.userVehicleForm.value;

      if (formData.batteryCapacity == null) {
        formData.batteryCapacity = (Number(formData.consumptionEnergetic) / 3.6) * Number(formData.autonomyElectricMode)
      } else if (formData.autonomyElectricMode == null) {
        formData.autonomyElectricMode = Number(formData.batteryCapacity) / (Number(formData.consumptionEnergetic) * 3.6)
      }
      const dataUpdateAutonomy = {
        mileagePerLiterRoad: Number(formData.mileagePerLiterRoad),
        mileagePerLiterCity: Number(formData.mileagePerLiterCity),
        consumptionEnergetic: Number(formData.consumptionEnergetic),
        autonomyElectricMode: Number(formData.autonomyElectricMode),
        batteryCapacity: Number(formData.batteryCapacity)
      };


      const updateData = {
        dataUpdateAutonomy: dataUpdateAutonomy
      };

      this.userVehicleService.updateVehicleUser(this.data.userVehicle.id, updateData).subscribe(
        response => {
          console.log('Cadastro realizado com sucesso!', response);
          Swal.fire({
            title: 'Cadastro editado com sucesso!',
            icon: 'success',
            text: 'O veículo foi editado com sucesso.',
            showConfirmButton: true,
            confirmButtonColor: '#19B6DD',
          }).then(() => {
            this.closeModal();
          });
        },
        error => {
          console.error('Erro ao realizar update:', error);
          Swal.fire({
            title: 'Erro!',
            icon: 'error',
            text: 'Houve um problema ao realizar o update. Tente novamente mais tarde.',
            showConfirmButton: true,
            confirmButtonColor: 'red',
          });
        }
      );

    } else {
      if (this.userVehicleForm.valid) {
        const formData = this.userVehicleForm.value;
        if (formData.batteryCapacity == null) {
          formData.batteryCapacity = (Number(formData.consumptionEnergetic) * 3.6) / Number(formData.autonomyElectricMode)
        } else if (formData.autonomyElectricMode == null) {
          formData.autonomyElectricMode = Number(formData.batteryCapacity) / (Number(formData.consumptionEnergetic) * 3.6)
        }
        const dataRegisterAutonomy = {
          mileagePerLiterRoad: formData.mileagePerLiterRoad,
          mileagePerLiterCity: formData.mileagePerLiterCity,
          consumptionEnergetic: formData.consumptionEnergetic,
          autonomyElectricMode: formData.autonomyElectricMode,
          batteryCapacity: Number(formData.batteryCapacity)
        };

        const dataRegisterVehicleUser = {
          vehicleId: this.selectedVehicle!.id, // Use o ID da versão do veículo
          dataRegisterAutonomy: dataRegisterAutonomy,
        };
        console.log(dataRegisterVehicleUser)

        this.userVehicleService.registerVehicleUser(dataRegisterVehicleUser).subscribe(
          response => {
            console.log('Cadastro realizado com sucesso!', response);
            Swal.fire({
              title: 'Cadastro realizado com sucesso!',
              icon: 'success',
              text: 'O veículo foi cadastrado com sucesso.',
              showConfirmButton: true,
              confirmButtonColor: '#19B6DD',
            }).then(() => {
              this.closeModal();
            });
          },
          error => {
            console.error('Erro ao realizar cadastro:', error);
            Swal.fire({
              title: 'Erro!',
              icon: 'error',
              text: 'Houve um problema ao realizar o cadastro. Tente novamente mais tarde.',
              showConfirmButton: true,
              confirmButtonColor: 'red'
            });
          }
        );

      } else {
        Swal.fire({
          title: 'Formulário inválido!',
          icon: 'warning',
          text: 'Por favor, preencha todos os campos obrigatórios.',
          showConfirmButton: true,
          confirmButtonColor: '#FFA726'
        });
      }
    }
  }

  private initializeData() {
    if (this.data) {
      this.vehicle = this.data.vehicle || {} as Vehicle;
      this.userVehicle = this.data.userVehicle || {} as UserVehicle;
      console.log('@Inject(MAT_DIALOG_DATA) public data UserVehicle:', this.userVehicle);
      console.log('@Inject(MAT_DIALOG_DATA) public data Vehicle:', this.vehicle);
    } else {
      console.warn('Nenhum dado foi injetado no modal.');
    }
  }

  // Alterna a abertura do painel de autocomplete
  toggleAutocomplete(field: string, event: MouseEvent) {
    event.stopPropagation();

    let trigger: MatAutocompleteTrigger | undefined;

    // Determine qual trigger usar baseado no campo
    switch (field) {
      case 'brand':
        trigger = this.autoBrandTrigger;
        break;
      case 'model':
        trigger = this.autoModelTrigger;
        break;
      case 'version':
        trigger = this.autoVersionTrigger;
        break;
      default:
        console.error('Campo não reconhecido:', field);
        return;
    }

    // Verifica se o trigger é válido antes de chamar os métodos
    if (trigger) {
      if (trigger.panelOpen) {
        trigger.closePanel();
      } else {
        trigger.openPanel();
      }
    } else {
      console.error('Trigger não encontrado para o campo:', field);
    }
  }

  private isEditMode(): boolean {
    return !!this.data.vehicle && !!this.data.userVehicle;
  }

  resetForm() {
    this.userVehicleForm.reset();
    this.isAutonomyGeneratedByAverage = false;
    this.isAutonomyDataMissing = false;
  }

  closeModal() {
    this.dialogRef.close();
  }

  openFAQModal() {
    this.dialog.open(FaqPopupComponent, {
      data: {
        faqs: [
          {
            question: 'Como cadastrar um novo veículo?',
            answer: 'Para cadastrar um novo veículo, clique no botão "Novo veículo" localizado na parte inferior direita da tabela. Isso abrirá um formulário onde você poderá inserir os detalhes do veículo. Após preencher o formulário, clique em "Finalizar cadastro" para adicionar o novo veículo à lista.'
          },
          {
            question: 'Como visualizar os detalhes de um veículo?',
            answer: 'Para visualizar os detalhes de um veículo, clique no ícone de "olho" (visibility) ao lado do veículo que você deseja visualizar. Um modal será exibido mostrando todas as informações detalhadas sobre o veículo selecionado.'
          },
          {
            question: 'Como editar um veículo existente?',
            answer: 'Para editar um veículo, clique no ícone de "lápis" (edit) ao lado do veículo que você deseja modificar. Isso abrirá um modal com um formulário pré-preenchido com os dados do veículo. Faça as alterações necessárias e clique em "Salvar" para atualizar as informações.'
          },
          {
            question: 'Como excluir um veículo?',
            answer: 'Para excluir um veículo, clique no ícone de "lixeira" (delete) ao lado do veículo que você deseja remover. Você será solicitado a confirmar a exclusão. Após confirmar, o veículo será removido da lista.'
          },
          {
            question: 'Como buscar veículos específicos?',
            answer: 'Use o campo de busca localizado acima da tabela. Digite o nome ou detalhes do veículo que você deseja encontrar e a tabela será filtrada automaticamente para mostrar apenas os veículos que correspondem à sua pesquisa.'
          },
          {
            question: 'Como navegar entre as páginas da tabela?',
            answer: 'Use o paginador localizado na parte inferior da tabela para navegar entre as páginas de veículos. Você pode selecionar o número de itens por página e usar os botões de navegação para ir para a página anterior ou seguinte.'
          },
          {
            question: 'O que significa "Quilometragem por litro em Estrada"?',
            answer: 'Este valor indica a quantidade de quilômetros que o veículo pode percorrer com um litro de elétrico em estrada. É importante para estimar o custo de viagens em rodovias.'
          },
          {
            question: 'O que significa "Quilometragem por litro em Cidade "?',
            answer: 'Este valor representa a quantidade de quilômetros que o veículo pode percorrer com um litro de elétrico em condições urbanas. Ele ajuda a entender a eficiência do veículo em ambientes com tráfego intenso.'
          },
          {
            question: 'O que é "Consumo energetico"?',
            answer: 'Refere-se ao consumo energético do veículo, geralmente expresso em kWh por 100 km. Esse dado é crucial para veículos elétricos, pois ajuda a calcular a autonomia com base na capacidade da bateria.'
          },
          {
            question: 'O que é "Autonomia em modo elétrico"?',
            answer: 'Este valor indica a distância máxima que o veículo pode percorrer em modo elétrico. É fundamental para os motoristas que utilizam veículos híbridos ou elétricos e desejam saber a eficiência do modo elétrico.'
          },
          {
            question: 'A capacidade da bateria é obrigatória?',
            answer: 'A capacidade da bateria não é um campo obrigatório, mas se inserido, proporcionará informações mais fidedignas sobre o uso da bateria em trajetos, permitindo um cálculo mais preciso da autonomia do veículo.'
          }
        ]
      }
    });
  }

}
